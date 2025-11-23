#!/bin/bash
# Script para copiar o circuito compilado para o webapp public

echo "📦 Copying compiled circuit to webapp..."

# Verifica se o arquivo compilado existe
if [ -f "target/zk-circuit.json" ]; then
    echo "✅ Found compiled circuit"
    
    # Copia para o public do webapp
    cp target/zk-circuit.json ../webapp/public/zk_noir_circuit.json
    echo "✅ Circuit copied to webapp/public/zk_noir_circuit.json"
else
    echo "⚠️  Compiled circuit not found in target/zk-circuit.json"
    echo "💡 Please compile the circuit first with: nargo compile"
    exit 1
fi

