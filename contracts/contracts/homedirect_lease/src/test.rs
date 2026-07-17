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
