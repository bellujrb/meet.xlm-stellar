#!/bin/bash

# Script para configurar os secrets do Supabase automaticamente
# Este script obtém as informações do projeto e configura os secrets

set -e

PROJECT_REF="fmyubhvjgjsnltlgpmkz"

echo "🔧 Configurando secrets do Supabase..."
echo "Project: $PROJECT_REF"
echo ""

# Verificar se está logado
if ! supabase projects list &> /dev/null; then
  echo "❌ Você precisa fazer login primeiro: supabase login"
  exit 1
fi

# Verificar secrets existentes
echo "📋 Secrets atuais:"
supabase secrets list
echo ""

# Obter informações do projeto via API do Supabase
echo "🔍 Obtendo informações do projeto..."
echo ""
echo "Para configurar os secrets, você precisa fornecer:"
echo "  1. DB_URL - Connection string do banco de dados"
echo "  2. SERVICE_ROLE_KEY - Chave de serviço do Supabase"
echo "  3. ANON_KEY - Chave anônima (opcional)"
echo ""
echo "Você pode encontrar essas informações em:"
echo "  https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
echo "  https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
echo ""

# Pedir ao usuário para fornecer os valores
read -p "Digite o DB_URL (ou pressione Enter para pular): " DB_URL
read -p "Digite o SERVICE_ROLE_KEY (ou pressione Enter para pular): " SERVICE_ROLE_KEY
read -p "Digite o ANON_KEY (ou pressione Enter para pular - opcional): " ANON_KEY

# Configurar os secrets
if [ -n "$DB_URL" ]; then
  echo ""
  echo "🔐 Configurando DB_URL..."
  supabase secrets set DB_URL="$DB_URL" --project-ref "$PROJECT_REF"
  echo "✅ DB_URL configurado"
fi

if [ -n "$SERVICE_ROLE_KEY" ]; then
  echo ""
  echo "🔐 Configurando SERVICE_ROLE_KEY..."
  supabase secrets set SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY" --project-ref "$PROJECT_REF"
  echo "✅ SERVICE_ROLE_KEY configurado"
fi

if [ -n "$ANON_KEY" ]; then
  echo ""
  echo "🔐 Configurando ANON_KEY..."
  supabase secrets set ANON_KEY="$ANON_KEY" --project-ref "$PROJECT_REF"
  echo "✅ ANON_KEY configurado"
fi

echo ""
echo "📋 Secrets configurados:"
supabase secrets list --project-ref "$PROJECT_REF"
echo ""
echo "✅ Configuração concluída!"
echo ""
echo "🧪 Teste as functions agora com:"
echo "   ./test-functions.sh"

