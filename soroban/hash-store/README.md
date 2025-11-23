# HashStore Soroban Contract

Contrato Soroban para armazenar hashes de provas ZK relacionadas a eventos.

## Pré-requisitos

1. **Rust** (versão 1.70 ou superior)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Soroban CLI**
   ```bash
   # macOS (com Homebrew)
   brew install soroban/tap/soroban
   
   # Linux
   curl -sSL https://soroban.stellar.org | sh
   ```

3. **Conta na Testnet** com XLM para deploy
   - Use o [Friendbot](https://laboratory.stellar.org/#account-creator?network=test) para obter XLM na testnet

## Build e Deploy Automático

Execute o script de build e deploy:

```bash
./build-and-deploy.sh
```

O script irá:
1. Verificar/instalar o Soroban CLI
2. Configurar a rede testnet
3. Compilar o contrato
4. Fazer deploy na testnet
5. Salvar o Contract ID em `contract_id.txt`

**Importante:** Você precisará exportar sua chave secreta antes de executar:

```bash
export SOROBAN_SECRET_KEY='your-secret-key-here'
./build-and-deploy.sh
```

## Build Manual

### 1. Compilar o contrato

```bash
soroban contract build
```

O arquivo WASM será gerado em:
```
target/wasm32-unknown-unknown/release/hash_store.wasm
```

### 2. Configurar rede testnet

```bash
soroban network add --global testnet \
    --rpc-url https://soroban-testnet.stellar.org:443 \
    --network-passphrase "Test SDF Network ; September 2015"
```

### 3. Deploy na testnet

```bash
soroban contract deploy \
    --wasm target/wasm32-unknown-unknown/release/hash_store.wasm \
    --network testnet \
    --source-account YOUR_SECRET_KEY
```

## Uso do Contrato

### Adicionar um hash

```bash
soroban contract invoke \
    --id CONTRACT_ID \
    --network testnet \
    -- add_hash \
    --event_id 'event-123' \
    --hash '0101010101010101010101010101010101010101010101010101010101010101'
```

### Obter todos os hashes de um evento

```bash
soroban contract invoke \
    --id CONTRACT_ID \
    --network testnet \
    -- get_hashes \
    --event_id 'event-123'
```

## Testes

Execute os testes unitários:

```bash
cargo test
```

Ou use o Soroban CLI para testar:

```bash
soroban contract test
```

## Estrutura do Contrato

### Funções

- **`add_hash(event_id: Bytes, hash: BytesN<32>)`**
  - Adiciona um hash de 32 bytes à lista de um evento específico
  
- **`get_hashes(event_id: Bytes) -> Vec<BytesN<32>>`**
  - Retorna todos os hashes armazenados para um evento específico

### Exemplo de uso

```rust
// Adicionar hash para evento "event-a"
client.add_hash(&event_a, &hash1);

// Obter todos os hashes de "event-a"
let hashes = client.get_hashes(&event_a);
```

## Obter XLM na Testnet

Se você precisar de XLM na testnet para o deploy:

1. Acesse: https://laboratory.stellar.org/#account-creator?network=test
2. Gere uma nova chave
3. Solicite XLM usando o Friendbot

Ou use o CLI:

```bash
# Criar conta e solicitar funding
soroban keys generate --global my-key
soroban keys fund --network testnet --global my-key
```

## Troubleshooting

### Erro: "soroban: command not found"
Instale o Soroban CLI usando os comandos acima.

### Erro: "insufficient balance"
Você precisa de XLM na testnet. Use o Friendbot para obter fundos.

### Erro durante o build
Certifique-se de que o Rust está atualizado:
```bash
rustup update
```

### Verificar versões
```bash
rustc --version
cargo --version
soroban --version
```

## Links Úteis

- [Documentação Soroban](https://soroban.stellar.org/docs)
- [Stellar Laboratory (Testnet)](https://laboratory.stellar.org/)
- [Soroban Examples](https://github.com/stellar/soroban-examples)

