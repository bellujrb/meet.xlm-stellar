#![no_std]

use soroban_sdk::{contract, contractimpl, Bytes, BytesN, Env, Vec};

#[contract]
pub struct HashStore;

#[contractimpl]
impl HashStore {
    /// Appends a 32-byte hash to the list for a given event identifier.
    pub fn add_hash(env: Env, event_id: Bytes, hash: BytesN<32>) {
        let mut hashes: Vec<BytesN<32>> = env
            .storage()
            .persistent()
            .get(&event_id)
            .unwrap_or_else(|| Vec::new(&env));

        hashes.push_back(hash);
        env.storage().persistent().set(&event_id, &hashes);
    }

    /// Returns all hashes stored for the event. Empty if the event has none.
    pub fn get_hashes(env: Env, event_id: Bytes) -> Vec<BytesN<32>> {
        env.storage()
            .persistent()
            .get(&event_id)
            .unwrap_or_else(|| Vec::new(&env))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::EnvExt, Bytes, BytesN, Env};

    #[test]
    fn add_and_list_hashes_per_event() {
        let env = Env::default();
        let contract_id = env.register_contract(None, HashStore);
        let client = HashStoreClient::new(&env, &contract_id);

        let event_a = Bytes::from_slice(&env, b"event-a");
        let event_b = Bytes::from_slice(&env, b"event-b");
        let hash1 = BytesN::from_array(&env, &[1u8; 32]);
        let hash2 = BytesN::from_array(&env, &[2u8; 32]);
        let hash3 = BytesN::from_array(&env, &[3u8; 32]);

        // Initially empty.
        assert_eq!(client.get_hashes(&event_a).len(), 0);

        // Add hashes to two separate events.
        client.add_hash(&event_a, &hash1);
        client.add_hash(&event_a, &hash2);
        client.add_hash(&event_b, &hash3);

        let hashes_a = client.get_hashes(&event_a);
        let hashes_b = client.get_hashes(&event_b);

        assert_eq!(hashes_a.len(), 2);
        assert_eq!(hashes_a.get(0), hash1);
        assert_eq!(hashes_a.get(1), hash2);

        assert_eq!(hashes_b.len(), 1);
        assert_eq!(hashes_b.get(0), hash3);
    }
}
