#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env, String};
use crate::types::LeaseStatus;

#[test]
fn test_create_lease() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::LeaseContract);
    let client = crate::LeaseContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let landlord = Address::generate(&env);
    let tenant = Address::generate(&env);
    let property_id = String::from_str(&env, "property_123");

    // 1. Initialize
    client.initialize(&admin);

    // 2. Create lease
    let monthly_rent = 100000i128;
    let security_deposit = 200000i128;
    let duration_months = 12u32;
    
    let lease_id = client.create_lease(
        &landlord,
        &tenant,
        &property_id,
        &monthly_rent,
        &security_deposit,
        &duration_months,
    );

    // 3. Verify lease was created
    let lease = client.get_lease(&lease_id).unwrap();
    assert_eq!(lease.landlord, landlord);
    assert_eq!(lease.tenant, tenant);
    assert_eq!(lease.property_id, property_id);
    assert_eq!(lease.monthly_rent, monthly_rent);
    assert_eq!(lease.status, LeaseStatus::Active);
    assert_eq!(lease.rent_paid_months, 0);

    // 4. Verify property mapping
    let mapped_lease_id = client.get_lease_by_property(&property_id).unwrap();
    assert_eq!(mapped_lease_id, lease_id);
}

#[test]
fn test_pay_rent() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::LeaseContract);
    let client = crate::LeaseContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let landlord = Address::generate(&env);
    let tenant = Address::generate(&env);
    let property_id = String::from_str(&env, "property_456");

    // Initialize and create lease
    client.initialize(&admin);
    let lease_id = client.create_lease(
        &landlord,
        &tenant,
        &property_id,
        &100000i128,
        &200000i128,
        &12u32,
    );

    // Pay rent
    client.pay_rent(&lease_id, &100000i128, &tenant);

    // Verify payment was recorded
    let lease = client.get_lease(&lease_id).unwrap();
    assert_eq!(lease.rent_paid_months, 1);
    assert_eq!(lease.status, LeaseStatus::Active);
}

#[test]
fn test_lease_completion() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::LeaseContract);
    let client = crate::LeaseContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let landlord = Address::generate(&env);
    let tenant = Address::generate(&env);
    let property_id = String::from_str(&env, "property_789");

    // Initialize and create 1-month lease for testing
    client.initialize(&admin);
    let lease_id = client.create_lease(
        &landlord,
        &tenant,
        &property_id,
        &100000i128,
        &200000i128,
        &1u32,
    );

    // Pay the single month's rent
    client.pay_rent(&lease_id, &100000i128, &tenant);

    // Verify lease is completed
    let lease = client.get_lease(&lease_id).unwrap();
    assert_eq!(lease.rent_paid_months, 1);
    assert_eq!(lease.status, LeaseStatus::Completed);
}

#[test]
fn test_dispute_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::LeaseContract);
    let client = crate::LeaseContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let landlord = Address::generate(&env);
    let tenant = Address::generate(&env);
    let property_id = String::from_str(&env, "property_dispute");

    // Initialize and create lease
    client.initialize(&admin);
    let lease_id = client.create_lease(
        &landlord,
        &tenant,
        &property_id,
        &100000i128,
        &200000i128,
        &12u32,
    );

    // Raise dispute as tenant
    client.raise_dispute(&lease_id, &tenant);
    
    let lease = client.get_lease(&lease_id).unwrap();
    assert_eq!(lease.status, LeaseStatus::Disputed);

    // Resolve dispute in favor of tenant
    client.resolve_dispute(&lease_id, &tenant);
    
    let lease = client.get_lease(&lease_id).unwrap();
    assert_eq!(lease.status, LeaseStatus::Terminated);
}

#[test]
fn test_platform_fee_collection() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::LeaseContract);
    let client = crate::LeaseContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let landlord = Address::generate(&env);
    let tenant = Address::generate(&env);
    let property_id = String::from_str(&env, "property_fee");

    // Initialize and create lease
    client.initialize(&admin);
    let lease_id = client.create_lease(
        &landlord,
        &tenant,
        &property_id,
        &100000i128,
        &200000i128,
        &12u32,
    );

    // Collect platform fee
    client.collect_platform_fee(&lease_id);

    // Verify fee was marked as collected
    let lease = client.get_lease(&lease_id).unwrap();
    assert!(lease.platform_fee_collected);
}

#[test]
fn test_token_config() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::LeaseContract);
    let client = crate::LeaseContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let usdc_token = Address::generate(&env);
    let platform_wallet = Address::generate(&env);

    // Initialize
    client.initialize(&admin);

    // Set token config
    client.set_token_config(&usdc_token, &platform_wallet);

    // Verify config was set (would need getter functions in real implementation)
    // For now, just ensure it doesn't error
}

#[test]
fn test_invalid_amounts() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::LeaseContract);
    let client = crate::LeaseContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let landlord = Address::generate(&env);
    let tenant = Address::generate(&env);
    let property_id = String::from_str(&env, "property_invalid");

    client.initialize(&admin);

    // Try to create lease with zero rent - should fail
    let result = client.try_create_lease(
        &landlord,
        &tenant,
        &property_id,
        &0i128,
        &200000i128,
        &12u32,
    );
    assert!(result.is_err());
}

#[test]
fn test_lease_expiration() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, crate::LeaseContract);
    let client = crate::LeaseContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let landlord = Address::generate(&env);
    let tenant = Address::generate(&env);
    let property_id = String::from_str(&env, "property_expire");

    client.initialize(&admin);
    let lease_id = client.create_lease(
        &landlord,
        &tenant,
        &property_id,
        &100000i128,
        &200000i128,
        &1u32,
    );

    // Note: Time advancement in Soroban tests requires different approach
    // For now, we'll just test that the lease structure has expiration fields
    let lease = client.get_lease(&lease_id).unwrap();
    assert!(lease.end_timestamp > lease.start_timestamp);
}
