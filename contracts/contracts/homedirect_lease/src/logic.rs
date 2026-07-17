use soroban_sdk::{Env, Address, String, xdr::ToXdr, symbol_short};
use crate::storage;
use crate::types::{Error, Lease, LeaseStatus};

pub fn initialize(env: &Env, admin: Address) -> Result<(), Error> {
    if storage::get_version(env) != 0 {
        return Err(Error::AlreadyInitialized);
    }
    storage::set_version(env, 1);
    storage::set_admin(env, admin);
    Ok(())
}

pub fn set_admin(env: &Env, new_admin: Address) -> Result<(), Error> {
    let admin = storage::get_admin(env).ok_or(Error::Unauthorized)?;
    admin.require_auth();
    storage::set_admin(env, new_admin);
    Ok(())
}

fn generate_lease_id(env: &Env, property_id: String, tenant: Address) -> String {
    let timestamp = env.ledger().timestamp();
    let tuple = (property_id.clone(), tenant.clone(), timestamp);
    let id_hash = env.crypto().sha256(&tuple.to_xdr(env));
    
    let hex_chars = b"0123456789abcdef";
    let mut hex_bytes = [0u8; 64];
    for (i, &b) in id_hash.to_array().iter().enumerate() {
        hex_bytes[i * 2] = hex_chars[(b >> 4) as usize];
        hex_bytes[i * 2 + 1] = hex_chars[(b & 0x0F) as usize];
    }
    String::from_str(env, core::str::from_utf8(&hex_bytes).unwrap())
}

pub fn create_lease(
    env: &Env,
    landlord: Address,
    tenant: Address,
    property_id: String,
    monthly_rent: i128,
    security_deposit: i128,
    duration_months: u32,
) -> Result<String, Error> {
    // Check if property already has an active lease
    if storage::property_has_lease(env, property_id.clone()) {
        return Err(Error::PropertyAlreadyLeased);
    }

    // Authorize landlord
    landlord.require_auth();

    let timestamp = env.ledger().timestamp();
    let lease_id = generate_lease_id(env, property_id.clone(), tenant.clone());
    
    // Calculate end timestamp (assuming 30 days per month for simplicity)
    let seconds_per_month: u64 = 30 * 24 * 60 * 60;
    let end_timestamp = timestamp + (duration_months as u64 * seconds_per_month);

    let lease = Lease {
        lease_id: lease_id.clone(),
        property_id: property_id.clone(),
        landlord: landlord.clone(),
        tenant: tenant.clone(),
        monthly_rent,
        security_deposit,
        duration_months,
        start_timestamp: timestamp,
        end_timestamp,
        status: LeaseStatus::Active,
        rent_paid_months: 0,
        platform_fee_collected: false,
    };

    storage::save_lease(env, lease_id.clone(), lease);

    env.events().publish(
        (symbol_short!("created"), lease_id.clone()),
        (landlord, tenant, property_id),
    );

    Ok(lease_id)
}

pub fn pay_rent(env: &Env, lease_id: String, amount: i128, payer: Address) -> Result<(), Error> {
    let mut lease = storage::get_lease(env, lease_id.clone()).ok_or(Error::LeaseNotFound)?;

    // Verify payer is tenant
    if lease.tenant != payer {
        return Err(Error::Unauthorized);
    }

    // Check lease status
    if lease.status != LeaseStatus::Active {
        return Err(Error::InvalidLeaseStatus);
    }

    // Verify payment amount
    if amount < lease.monthly_rent {
        return Err(Error::InsufficientPayment);
    }

    // Update rent payment tracking
    lease.rent_paid_months += 1;

    // Check if lease is complete
    if lease.rent_paid_months >= lease.duration_months {
        lease.status = LeaseStatus::Completed;
    }

    let paid_months = lease.rent_paid_months;
    storage::update_lease(env, lease_id.clone(), lease);

    env.events().publish(
        (symbol_short!("rent_paid"), lease_id),
        (amount, paid_months),
    );

    Ok(())
}

pub fn release_deposit(env: &Env, lease_id: String, _to_tenant: bool) -> Result<(), Error> {
    let admin = storage::get_admin(env).ok_or(Error::Unauthorized)?;
    admin.require_auth();

    let mut lease = storage::get_lease(env, lease_id.clone()).ok_or(Error::LeaseNotFound)?;

    // Only allow deposit release for completed leases or via dispute resolution
    if lease.status != LeaseStatus::Completed && lease.status != LeaseStatus::Disputed {
        return Err(Error::InvalidLeaseStatus);
    }

    // In a real implementation, this would transfer the deposit
    // For now, we just mark the lease as terminated
    lease.status = LeaseStatus::Terminated;
    storage::update_lease(env, lease_id, lease);

    Ok(())
}

pub fn raise_dispute(env: &Env, lease_id: String, party: Address) -> Result<(), Error> {
    let mut lease = storage::get_lease(env, lease_id.clone()).ok_or(Error::LeaseNotFound)?;

    // Only landlord or tenant can raise dispute
    if lease.landlord != party && lease.tenant != party {
        return Err(Error::Unauthorized);
    }

    party.require_auth();

    if lease.status != LeaseStatus::Active {
        return Err(Error::InvalidLeaseStatus);
    }

    lease.status = LeaseStatus::Disputed;
    storage::update_lease(env, lease_id.clone(), lease);

    env.events().publish(
        (symbol_short!("dispute"), lease_id),
        party,
    );

    Ok(())
}

pub fn resolve_dispute(env: &Env, lease_id: String, winner: Address) -> Result<(), Error> {
    let admin = storage::get_admin(env).ok_or(Error::Unauthorized)?;
    admin.require_auth();

    let mut lease = storage::get_lease(env, lease_id.clone()).ok_or(Error::LeaseNotFound)?;

    if lease.status != LeaseStatus::Disputed {
        return Err(Error::InvalidLeaseStatus);
    }

    // Verify winner is either landlord or tenant
    if lease.landlord != winner && lease.tenant != winner {
        return Err(Error::Unauthorized);
    }

    lease.status = LeaseStatus::Terminated;
    storage::update_lease(env, lease_id.clone(), lease);

    env.events().publish(
        (symbol_short!("resolved"), lease_id),
        winner,
    );

    Ok(())
}
