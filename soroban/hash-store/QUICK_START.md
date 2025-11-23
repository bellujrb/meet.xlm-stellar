# Quick Start - Build e Deploy na Testnet

## Passo 1: Instalar Soroban CLI

```bash
cargo install --locked soroban-cli
```

**Nota:** Isso pode levar alguns minutos. Se você já tem o Rust instalado, será mais rápido.

Alternativa: Veja `INSTALL.md` para outras opções.

## Passo 2: Obter XLM na Testnet

Você precisa de XLM na testnet para fazer o deploy:

1. Acesse: https://laboratory.stellar.org/#account-creator?network=test
2. Gere uma nova conta
3. Solicite XLM usando o Friendbot
4. Copie sua **Secret Key**

## Passo 3: Configurar sua Secret Key

```bash
export SOROBAN_SECRET_KEY='S...'  # Sua secret key aqui
```

## Passo 4: Build e Deploy

Execute o script automático:

```bash
cd soroban/hash-store
./build-and-deploy.sh
```

O script irá:
- ✅ Verificar/instalar Soroban CLI (se necessário)
- ✅ Configurar rede testnet
- ✅ Compilar o contrato
- ✅ Fazer deploy na testnet
- ✅ Salvar o Contract ID em `contract_id.txt`

## Ou Faça Manualmente

### Build:
```bash
soroban contract build
```

### Configurar Testnet:
```bash
soroban network add --global testnet \
    --rpc-url https://soroban-testnet.stellar.org:443 \
    --network-passphrase "Test SDF Network ; September 2015"
```

### Deploy:
```bash
soroban contract deploy \
    --wasm target/wasm32-unknown-unknown/release/hash_store.wasm \
    --network testnet \
    --source-account YOUR_SECRET_KEY
```

## Passo 5: Testar o Contrato

Após o deploy, você receberá um Contract ID. Use-o para testar:

### Adicionar Hash:
```bash
soroban contract invoke \
    --id CONTRACT_ID \
    --network testnet \
    -- add_hash \
    --event_id 'evento-teste-123' \
    --hash '0101010101010101010101010101010101010101010101010101010101010101'
```

### Obter Hashes:
```bash
soroban contract invoke \
    --id CONTRACT_ID \
    --network testnet \
    -- get_hashes \
    --event_id 'evento-teste-123'
```

## Troubleshooting

### Erro: "soroban: command not found"
Instale o Soroban CLI (Passo 1).

### Erro: "insufficient balance"
Você precisa de XLM na testnet (Passo 2).

### Erro durante o build
Certifique-se de que o Rust está atualizado:
```bash
rustup update
```

## Arquivos Úteis

- `build.sh` - Apenas build do contrato
- `build-and-deploy.sh` - Build + deploy completo
- `INSTALL.md` - Opções de instalação do Soroban CLI
- `README.md` - Documentação completa

