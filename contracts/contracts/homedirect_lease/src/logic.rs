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

pub fn set_token_config(env: &Env, usdc_token: Address, platform_wallet: Address) -> Result<(), Error> {
    let admin = storage::get_admin(env).ok_or(Error::Unauthorized)?;
    admin.require_auth();
    storage::set_usdc_token(env, usdc_token);
    storage::set_platform_wallet(env, platform_wallet);
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

    // Validate amounts
    if monthly_rent <= 0 || security_deposit <= 0 {
        return Err(Error::InvalidAmount);
    }

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

    // Check if lease has expired
    let current_timestamp = env.ledger().timestamp();
    if current_timestamp > lease.end_timestamp {
        lease.status = LeaseStatus::Terminated;
        storage::update_lease(env, lease_id.clone(), lease);
        return Err(Error::LeaseExpired);
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

pub fn collect_platform_fee(env: &Env, lease_id: String) -> Result<(), Error> {
    let admin = storage::get_admin(env).ok_or(Error::Unauthorized)?;
    admin.require_auth();

    let mut lease = storage::get_lease(env, lease_id.clone()).ok_or(Error::LeaseNotFound)?;

    if lease.platform_fee_collected {
        return Err(Error::PlatformFeeAlreadyCollected);
    }

    // Calculate 5% platform fee based on total rent
    let total_rent = lease.monthly_rent * lease.duration_months as i128;
    let platform_fee = total_rent / 20; // 5%

    // In a real implementation, this would transfer USDC to platform wallet
    // For now, we just mark it as collected
    lease.platform_fee_collected = true;
    storage::update_lease(env, lease_id.clone(), lease);

    env.events().publish(
        (symbol_short!("fee"), lease_id),
        platform_fee,
    );

    Ok(())
}
