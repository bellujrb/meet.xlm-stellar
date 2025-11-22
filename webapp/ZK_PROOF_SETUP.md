# ZK Proof Setup Guide

Este guia explica como configurar e usar a geração de provas Zero-Knowledge no webapp.

## 📋 Pré-requisitos

1. **Nargo instalado** - Compilador Noir
   ```bash
   # Instalar via cargo
   cargo install nargo
   ```

## 🔧 Configuração

### 1. Compilar o Circuito Noir

```bash
cd ../zk-circuit
nargo compile
```

Isso gerará o arquivo `target/zk-circuit.json` com o circuito compilado.

### 2. Copiar Circuito para Webapp

```bash
# No diretório zk-circuit
./copy-to-webapp.sh
```

Ou manualmente:
```bash
cp target/zk-circuit.json ../webapp/public/zk_noir_circuit.json
```

### 3. Verificar Arquivo

O arquivo `webapp/public/zk_noir_circuit.json` deve existir e conter:
- `noir_version`
- `bytecode`
- `hash`

## 🚀 Como Funciona

### Fluxo de Geração de Prova

1. **Obter Saldo XLM**: O sistema consulta o saldo XLM da wallet Stellar conectada
2. **Validar Saldo**: Verifica se o saldo é suficiente (>= threshold)
3. **Gerar Nonce**: Cria um nonce aleatório para evitar replay attacks
4. **Gerar Witness**: Executa o circuito Noir com os inputs
5. **Gerar Prova**: Usa o backend UltraHonk para gerar a prova ZK
6. **Verificar Localmente**: Valida a prova antes de enviar

### Estrutura dos Inputs

```typescript
{
  threshold: number;      // u64 - valor mínimo em stroops (1 XLM = 10,000,000 stroops)
  nonce: string;          // Field - nonce público
  balance: number;        // u64 - saldo real em stroops
  secret_nonce: string;   // Field - nonce secreto (deve ser igual ao público)
}
```

### Conversão XLM → Stroops

- 1 XLM = 10,000,000 stroops
- Exemplo: 5.5 XLM = 55,000,000 stroops

## 📁 Arquivos Criados

- `src/lib/xlmBalance.ts` - Serviço para obter saldo XLM
- `src/lib/zkProof.ts` - Serviço de geração de prova ZK
- `src/lib/polyfills.ts` - Polyfills para Buffer e global
- `src/components/ZKProofModal.tsx` - Modal atualizado com geração real

## 🐛 Troubleshooting

### Erro: "Error loading circuit"
- Verifique se `public/zk_noir_circuit.json` existe
- Verifique se o arquivo está corretamente formatado (JSON válido)

### Erro: "Insufficient balance"
- O usuário não tem XLM suficiente na wallet
- Verifique o saldo na rede Stellar

### Erro: "Proof generation failed"
- Verifique o console do navegador para mais detalhes
- Certifique-se de que as dependências estão instaladas
- Verifique se o circuito foi compilado corretamente

## 📚 Dependências

- `@aztec/bb.js` - Backend para geração de provas
- `@noir-lang/noir_js` - Runtime do Noir para JavaScript
- `stellar-sdk` - SDK do Stellar para consultar saldos

## ✅ Checklist

- [ ] Nargo instalado
- [ ] Circuito compilado (`nargo compile`)
- [ ] Arquivo `zk_noir_circuit.json` em `public/`
- [ ] Dependências instaladas (`npm install`)
- [ ] Polyfills importados em `main.tsx`

