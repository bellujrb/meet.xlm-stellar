#!/bin/bash

# Script para fazer deploy das Supabase Functions
# Este script facilita o processo de deploy de todas as functions

set -e

echo "🚀 Iniciando deploy das Supabase Functions..."
echo ""

# Verificar se está no diretório correto
if [ ! -f "config.toml" ]; then
  echo "❌ Erro: Execute este script a partir do diretório supabase/"
  exit 1
fi

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI não está instalado."
  echo "   Instale com: brew install supabase/tap/supabase"
  exit 1
fi

# Verificar se está logado
echo "📋 Verificando login no Supabase..."
if ! supabase projects list &> /dev/null; then
  echo "⚠️  Você precisa fazer login no Supabase primeiro."
  echo ""
  echo "   Execute: supabase login"
  echo "   Isso abrirá seu navegador para autenticação."
  echo ""
  read -p "Pressione Enter após fazer login, ou Ctrl+C para cancelar..."
fi

# Verificar se o projeto está linkado
if [ ! -f ".supabase/config.toml" ]; then
  echo "⚠️  Projeto não está linkado."
  echo ""
  echo "   Você precisa linkar seu projeto Supabase."
  echo "   Execute: supabase link --project-ref SEU_PROJECT_REF"
  echo ""
  echo "   Para encontrar seu PROJECT_REF:"
  echo "   1. Acesse https://supabase.com/dashboard"
  echo "   2. Selecione seu projeto"
  echo "   3. Vá em Settings > General"
  echo "   4. Copie o 'Reference ID'"
  echo ""
  read -p "Digite o PROJECT_REF do seu projeto: " PROJECT_REF
  
  if [ -z "$PROJECT_REF" ]; then
    echo "❌ PROJECT_REF não fornecido. Cancelando..."
    exit 1
  fi
  
  echo "🔗 Linkando projeto..."
  supabase link --project-ref "$PROJECT_REF"
fi

# Aplicar migrations
echo ""
echo "📦 Aplicando migrations..."
supabase db push

# Deploy das functions
echo ""
echo "🚀 Fazendo deploy das functions..."
echo ""

FUNCTIONS=("create-event" "list-events" "get-event" "list-user-events" "register-attendance" "verify")

for func in "${FUNCTIONS[@]}"; do
  echo "📤 Deploying $func..."
  supabase functions deploy "$func" || {
    echo "❌ Erro ao fazer deploy de $func"
    exit 1
  }
  echo "✅ $func deployado com sucesso!"
  echo ""
done

echo ""
echo "✅ Deploy concluído com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Configure as variáveis de ambiente no dashboard do Supabase:"
echo "      - DB_URL: URL do seu banco de dados"
echo "      - SERVICE_ROLE_KEY: Chave de serviço do Supabase"
echo "      - ANON_KEY: Chave anônima do Supabase (opcional)"
echo ""
echo "   2. Configure a variável ZKVERIFY_SEED (opcional, para integração com zkVerify):"
echo "      - ZKVERIFY_SEED: Seed phrase da conta zkVerify"
echo ""
echo "   3. Teste as functions usando os endpoints:"
echo "      - POST /functions/v1/create-event"
echo "      - GET /functions/v1/list-events"
echo "      - GET /functions/v1/get-event"
echo "      - GET /functions/v1/list-user-events"
echo "      - POST /functions/v1/register-attendance"
echo "      - POST /functions/v1/verify"
echo ""

