# Guia de Deploy - Supabase Functions

Este guia explica como configurar e fazer deploy das Supabase Functions para o projeto Meet.XLM.

## Pré-requisitos

1. ✅ Supabase CLI instalado (já instalado via Homebrew)
2. Conta no Supabase (https://supabase.com)
3. Projeto criado no Supabase Dashboard

## Passo 1: Login no Supabase

Execute o seguinte comando no terminal:

```bash
cd back-end/supabase
supabase login
```

Isso abrirá seu navegador para autenticação. Após fazer login, você estará autenticado.

## Passo 2: Obter o Project Reference ID

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings** > **General**
4. Copie o **Reference ID** (formato: `abcdefghijklmnop`)

## Passo 3: Linkar o Projeto

Execute o comando substituindo `SEU_PROJECT_REF` pelo Reference ID copiado:

```bash
supabase link --project-ref SEU_PROJECT_REF
```

## Passo 4: Aplicar Migrations

Aplique as migrations para criar as tabelas no banco de dados:

```bash
supabase db push
```

Ou, se preferir usar o SQL Editor no dashboard:

1. Acesse o SQL Editor no dashboard do Supabase
2. Copie o conteúdo de `migrations/20250101_init_events_schema.sql`
3. Execute o SQL

## Passo 5: Configurar Variáveis de Ambiente

No dashboard do Supabase:

1. Vá em **Project Settings** > **Edge Functions** > **Secrets**
2. Adicione as seguintes variáveis:

   - `DB_URL`: URL do seu banco de dados
     - Formato: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`
     - Você pode encontrar isso em **Settings** > **Database** > **Connection string**
   
   - `SERVICE_ROLE_KEY`: Chave de serviço
     - Encontre em **Settings** > **API** > **service_role key** (secret)
   
   - `ANON_KEY`: Chave anônima (opcional)
     - Encontre em **Settings** > **API** > **anon public key**

## Passo 6: Deploy das Functions

### Opção 1: Usar o script automatizado

```bash
cd back-end/supabase
./deploy.sh
```

### Opção 2: Deploy manual

```bash
# Deploy individual de cada function
supabase functions deploy create-event
supabase functions deploy list-events
supabase functions deploy get-event
supabase functions deploy list-user-events
supabase functions deploy register-attendance
```

## Verificação

Após o deploy, você pode verificar as functions no dashboard:

1. Acesse **Edge Functions** no menu lateral
2. Você deve ver todas as 5 functions listadas

## Testando as Functions

Você pode testar as functions usando curl ou qualquer cliente HTTP:

```bash
# Exemplo: Listar eventos
curl -X GET "https://[PROJECT_REF].supabase.co/functions/v1/list-events" \
  -H "Authorization: Bearer [ANON_KEY]"

# Exemplo: Criar evento
curl -X POST "https://[PROJECT_REF].supabase.co/functions/v1/create-event" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -H "x-wallet-address: GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
  -d '{
    "title": "Test Event",
    "organizer": "Test Organizer",
    "startTime": "2024-12-25T10:00:00Z",
    "location": "Test Location"
  }'
```

## Troubleshooting

### Erro: "Cannot connect to the Docker daemon"
- Este erro aparece ao tentar usar Supabase localmente
- Para deploy remoto, você não precisa do Docker rodando

### Erro: "Missing DB_URL or SERVICE_ROLE_KEY"
- Verifique se as variáveis de ambiente foram configuradas corretamente
- As variáveis devem estar em **Edge Functions** > **Secrets**, não em **Environment Variables**

### Erro: "Project not linked"
- Execute `supabase link --project-ref SEU_PROJECT_REF` novamente

### Erro: "Function not found"
- Certifique-se de estar no diretório correto (`back-end/supabase`)
- Verifique se a function existe em `functions/[nome-da-function]/index.ts`

## Estrutura das Functions

- `create-event`: Cria um novo evento
- `list-events`: Lista eventos disponíveis
- `get-event`: Busca detalhes de um evento específico
- `list-user-events`: Lista eventos do usuário
- `register-attendance`: Registra participação em evento

Todas as functions estão configuradas com `verify_jwt = false` no `config.toml`, usando autenticação customizada via header `x-wallet-address`.

