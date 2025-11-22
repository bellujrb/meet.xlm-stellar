#!/bin/bash

# Script para configurar os secrets com os nomes corretos
# Este script usa os valores dos secrets existentes (SUPABASE_*) para criar os novos

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

echo "📋 Secrets atuais:"
supabase secrets list --project-ref "$PROJECT_REF"
echo ""

echo "ℹ️  As functions esperam os seguintes nomes de secrets:"
echo "   - DB_URL (ao invés de SUPABASE_DB_URL)"
echo "   - SERVICE_ROLE_KEY (ao invés de SUPABASE_SERVICE_ROLE_KEY)"
echo "   - ANON_KEY (ao invés de SUPABASE_ANON_KEY)"
echo ""

echo "Para configurar, você precisa obter os valores do dashboard do Supabase:"
echo ""
echo "1. Acesse: https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
echo "   - Copie a 'service_role' key (secret)"
echo "   - Copie a 'anon' key (public)"
echo ""
echo "2. Acesse: https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
echo "   - Copie a 'Connection string' (URI ou Connection pooling)"
echo ""

read -p "Pressione Enter quando tiver os valores prontos..."

echo ""
read -p "Cole o DB_URL (connection string): " DB_URL
read -p "Cole o SERVICE_ROLE_KEY: " SERVICE_ROLE_KEY
read -p "Cole o ANON_KEY (opcional, pode deixar em branco): " ANON_KEY

if [ -z "$DB_URL" ] || [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "❌ DB_URL e SERVICE_ROLE_KEY são obrigatórios!"
  exit 1
fi

echo ""
echo "🔐 Configurando secrets..."

# Configurar DB_URL
echo "  → Configurando DB_URL..."
supabase secrets set DB_URL="$DB_URL" --project-ref "$PROJECT_REF" --yes

# Configurar SERVICE_ROLE_KEY
echo "  → Configurando SERVICE_ROLE_KEY..."
supabase secrets set SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY" --project-ref "$PROJECT_REF" --yes

# Configurar ANON_KEY se fornecido
if [ -n "$ANON_KEY" ]; then
  echo "  → Configurando ANON_KEY..."
  supabase secrets set ANON_KEY="$ANON_KEY" --project-ref "$PROJECT_REF" --yes
fi

echo ""
echo "✅ Secrets configurados com sucesso!"
echo ""
echo "📋 Secrets finais:"
supabase secrets list --project-ref "$PROJECT_REF"
echo ""
echo "🧪 Teste as functions agora:"
echo "   cd back-end/supabase && ./test-functions.sh"

