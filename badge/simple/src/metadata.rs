use soroban_sdk::{contracttype, Env, Symbol};

#[derive(Clone)]
#[contracttype]
pub struct BadgeMetadata {
    pub name: Symbol,
    pub symbol: Symbol,
    pub uri: Symbol,
}

#[derive(Clone)]
#[contracttype]
pub enum MetadataKey {
    Metadata,
}

pub fn write_metadata(e: &Env, metadata: BadgeMetadata) {
    e.storage()
        .instance()
        .set(&MetadataKey::Metadata, &metadata);
}

pub fn read_metadata(e: &Env) -> BadgeMetadata {
    return e
        .storage()
        .instance()
        .get::<_, BadgeMetadata>(&MetadataKey::Metadata)
        .expect("Metadata not initialized");
}
