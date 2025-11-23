-- Add zkverify_tx_hash column to zk_proofs table
ALTER TABLE zk_proofs 
ADD COLUMN IF NOT EXISTS zkverify_tx_hash VARCHAR(255);

-- Add index for zkverify_tx_hash
CREATE INDEX IF NOT EXISTS idx_zk_zkverify_tx_hash ON zk_proofs(zkverify_tx_hash) WHERE zkverify_tx_hash IS NOT NULL;

-- Add comment
COMMENT ON COLUMN zk_proofs.zkverify_tx_hash IS 'Transaction hash from zkVerify network after proof verification';

