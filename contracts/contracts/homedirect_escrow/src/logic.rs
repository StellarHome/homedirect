use soroban_sdk::{Env, Address, String, symbol_short};
use crate::storage;
use crate::types::{Error, Deposit, DepositStatus};

pub fn initialize(env: &Env, admin: Address) -> Result<(), Error> {
    if storage::get_version(env) != 0 {
        return Err(Error::AlreadyInitialized);
    }
    storage::set_version(env, 1);
    storage::set_admin(env, &admin);
    Ok(())
}

pub fn set_admin(env: &Env, new_admin: Address) -> Result<(), Error> {
    let admin = storage::get_admin(env).ok_or(Error::Unauthorized)?;
    admin.require_auth();
    storage::set_admin(env, &new_admin);
    Ok(())
}

pub fn lock_deposit(
    env: &Env,
    lease_id: String,
    tenant: Address,
    landlord: Address,
    amount: i128,
) -> Result<(), Error> {
    // Check if deposit already exists
    if storage::deposit_exists(env, lease_id.clone()) {
        return Err(Error::DepositAlreadyExists);
    }

    // Authorize tenant
    tenant.require_auth();

    let timestamp = env.ledger().timestamp();
    
    let deposit = Deposit {
        lease_id: lease_id.clone(),
        tenant: tenant.clone(),
        landlord: landlord.clone(),
        amount,
        status: DepositStatus::Locked,
        locked_timestamp: timestamp,
        release_timestamp: None,
    };

    storage::save_deposit(env, lease_id.clone(), deposit);

    env.events().publish(
        (symbol_short!("locked"), lease_id),
        (tenant, landlord, amount),
    );

    Ok(())
}

pub fn release_deposit(env: &Env, lease_id: String, to_tenant: bool) -> Result<(), Error> {
    let admin = storage::get_admin(env).ok_or(Error::Unauthorized)?;
    admin.require_auth();

    let mut deposit = storage::get_deposit(env, lease_id.clone()).ok_or(Error::DepositNotFound)?;

    if deposit.status != DepositStatus::Locked {
        return Err(Error::InvalidDepositStatus);
    }

    deposit.status = DepositStatus::Released;
    deposit.release_timestamp = Some(env.ledger().timestamp());

    storage::update_deposit(env, lease_id.clone(), deposit);

    env.events().publish(
        (symbol_short!("released"), lease_id),
        to_tenant,
    );

    Ok(())
}

pub fn partial_release(env: &Env, lease_id: String, amount: i128) -> Result<(), Error> {
    let admin = storage::get_admin(env).ok_or(Error::Unauthorized)?;
    admin.require_auth();

    let mut deposit = storage::get_deposit(env, lease_id.clone()).ok_or(Error::DepositNotFound)?;

    if deposit.status != DepositStatus::Locked {
        return Err(Error::InvalidDepositStatus);
    }

    if amount > deposit.amount {
        return Err(Error::InsufficientBalance);
    }

    deposit.status = DepositStatus::PartiallyReleased;
    deposit.amount -= amount;

    storage::update_deposit(env, lease_id.clone(), deposit);

    env.events().publish(
        (symbol_short!("partial"), lease_id),
        amount,
    );

    Ok(())
}

pub fn confiscate_deposit(env: &Env, lease_id: String) -> Result<(), Error> {
    let admin = storage::get_admin(env).ok_or(Error::Unauthorized)?;
    admin.require_auth();

    let mut deposit = storage::get_deposit(env, lease_id.clone()).ok_or(Error::DepositNotFound)?;

    if deposit.status != DepositStatus::Locked {
        return Err(Error::InvalidDepositStatus);
    }

    let landlord = deposit.landlord.clone();
    deposit.status = DepositStatus::Confiscated;

    storage::update_deposit(env, lease_id.clone(), deposit);

    env.events().publish(
        (symbol_short!("confisc"), lease_id),
        landlord,
    );

    Ok(())
}
