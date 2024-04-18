use soroban_sdk::{contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum CertHubDataKey {
    CertificationHub,
}

pub fn write_certification_hub_address(env: &Env, address: Address) {
    env.storage()
        .instance()
        .set(&CertHubDataKey::CertificationHub, &address);
}

pub fn read_certification_hub_address(env: &Env) -> Address {
    return env
        .storage()
        .instance()
        .get::<_, Address>(&CertHubDataKey::CertificationHub)
        .expect("CertificationHub not initialized");
}
