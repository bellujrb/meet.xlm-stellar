#!/bin/bash
# Script para compilar o circuito Noir e gerar o JSON para o frontend

echo "🔨 Compilando circuito Noir..."

# Compila o circuito
nargo compile

# Verifica se a compilação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "✅ Compilação bem-sucedida!"
    
    # Copia o arquivo compilado para o public do frontend
    if [ -f "target/zk-circuit.json" ]; then
        echo "📦 Copiando circuito compilado para frontend..."
        cp target/zk-circuit.json ../front-end/public/zk_noir_circuit.json
        echo "✅ Circuito copiado com sucesso!"
    else
        echo "⚠️  Arquivo compilado não encontrado em target/zk-circuit.json"
        echo "💡 Verifique se o Nargo gerou o arquivo corretamente"
    fi
else
    echo "❌ Erro na compilação do circuito"
    exit 1
fi

