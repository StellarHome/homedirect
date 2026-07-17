#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env, String};
use crate::types::DepositStatus;

#[test]
fn test_lock_deposit() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::EscrowContract);
    let client = crate::EscrowContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let lease_id = String::from_str(&env, "lease_123");

    // 1. Initialize
    client.initialize(&admin).unwrap();

    // 2. Lock deposit
    let amount = 200000i128;
    client.lock_deposit(&lease_id, &tenant, &landlord, &amount).unwrap();

    // 3. Verify deposit was locked
    let deposit = client.get_deposit(&lease_id).unwrap();
    assert_eq!(deposit.lease_id, lease_id);
    assert_eq!(deposit.tenant, tenant);
    assert_eq!(deposit.landlord, landlord);
    assert_eq!(deposit.amount, amount);
    assert_eq!(deposit.status, DepositStatus::Locked);
}

#[test]
fn test_release_deposit() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::EscrowContract);
    let client = crate::EscrowContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let lease_id = String::from_str(&env, "lease_456");

    // Initialize and lock deposit
    client.initialize(&admin).unwrap();
    client.lock_deposit(&lease_id, &tenant, &landlord, &200000i128).unwrap();

    // Release deposit to tenant
    client.release_deposit(&lease_id, true).unwrap();

    // Verify deposit was released
    let deposit = client.get_deposit(&lease_id).unwrap();
    assert_eq!(deposit.status, DepositStatus::Released);
    assert!(deposit.release_timestamp.is_some());
}

#[test]
fn test_partial_release() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::EscrowContract);
    let client = crate::EscrowContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let lease_id = String::from_str(&env, "lease_789");

    // Initialize and lock deposit
    client.initialize(&admin).unwrap();
    client.lock_deposit(&lease_id, &tenant, &landlord, &200000i128).unwrap();

    // Partially release 50000
    client.partial_release(&lease_id, &50000i128).unwrap();

    // Verify partial release
    let deposit = client.get_deposit(&lease_id).unwrap();
    assert_eq!(deposit.status, DepositStatus::PartiallyReleased);
    assert_eq!(deposit.amount, 150000i128); // 200000 - 50000
}

#[test]
fn test_confiscate_deposit() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::EscrowContract);
    let client = crate::EscrowContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let lease_id = String::from_str(&env, "lease_confisc");

    // Initialize and lock deposit
    client.initialize(&admin).unwrap();
    client.lock_deposit(&lease_id, &tenant, &landlord, &200000i128).unwrap();

    // Confiscate deposit
    client.confiscate_deposit(&lease_id).unwrap();

    // Verify confiscation
    let deposit = client.get_deposit(&lease_id).unwrap();
    assert_eq!(deposit.status, DepositStatus::Confiscated);
}

#[test]
fn test_deposit_already_exists() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::EscrowContract);
    let client = crate::EscrowContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let tenant = Address::generate(&env);
    let landlord = Address::generate(&env);
    let lease_id = String::from_str(&env, "lease_double");

    // Initialize and lock first deposit
    client.initialize(&admin).unwrap();
    client.lock_deposit(&lease_id.clone(), &tenant, &landlord, &200000i128).unwrap();

    // Try to lock second deposit for same lease - should fail
    let result = client.lock_deposit(&lease_id, &tenant, &landlord, &200000i128);
    assert!(result.is_err());
}
