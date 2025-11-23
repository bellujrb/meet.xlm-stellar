#!/bin/bash

# Script simplificado para fazer build do contrato HashStore
# Para deploy, use build-and-deploy.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔨 Fazendo build do contrato HashStore..."

# Verificar se o Soroban CLI está instalado
if ! command -v soroban &> /dev/null; then
    echo "❌ Soroban CLI não encontrado."
    echo ""
    echo "Instale com:"
    echo "  cargo install --locked soroban-cli"
    echo ""
    echo "Ou veja INSTALL.md para outras opções."
    exit 1
fi

# Mostrar versão
echo "Soroban CLI versão:"
soroban --version

# Build do contrato
echo ""
echo "Compilando contrato..."
soroban contract build

# Verificar se o arquivo WASM foi gerado
WASM_FILE="target/wasm32-unknown-unknown/release/hash_store.wasm"
if [ -f "$WASM_FILE" ]; then
    echo ""
    echo "✅ Build concluído com sucesso!"
    echo "📦 Arquivo WASM: $WASM_FILE"
    
    # Mostrar tamanho do arquivo
    SIZE=$(du -h "$WASM_FILE" | cut -f1)
    echo "📊 Tamanho: $SIZE"
else
    echo "❌ Erro: Arquivo WASM não foi gerado"
    exit 1
fi

