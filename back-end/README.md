# Backend - Supabase Functions para Eventos

Backend baseado em Supabase Edge Functions para gerenciar eventos e participações.

## Estrutura

```
back-end/
├── supabase/
│   ├── functions/
│   │   ├── create-event/          # Criar eventos
│   │   ├── list-events/           # Listar eventos
│   │   ├── get-event/            # Buscar evento específico
│   │   ├── list-user-events/      # Listar eventos do usuário
│   │   ├── register-attendance/   # Registrar participação
│   │   └── shared/                # Utilitários compartilhados
│   ├── migrations/
│   │   └── 20250101_init_events_schema.sql
│   ├── config.toml
│   └── deno.json
└── README.md
```

## Migrations

Execute a migration para criar as tabelas necessárias:

```sql
-- Tabela events: armazena informações dos eventos
-- Tabela event_attendances: armazena registros de participação
-- Tabela logs: armazena logs das functions
-- Triggers: atualização automática de status e updated_at
```

## Functions

### 1. create-event

Cria um novo evento.

**Endpoint:** `POST /functions/v1/create-event`

**Headers:**
- `x-wallet-address`: Endereço da carteira Stellar do criador

**Body:**
```json
{
  "title": "Stellar Hack+ Buenos Aires",
  "organizer": "Stellar Foundation",
  "organizerIcon": "🌟",
  "startTime": "2024-12-25T10:00:00Z",
  "location": "Buenos Aires, Argentina",
  "description": "Hackathon description...",
  "imageUrl": "https://example.com/image.jpg",
  "requiresXlm": true,
  "xlmMinimum": 10.5
}
```

**Response:**
```json
{
  "event_id": "uuid",
  "title": "Stellar Hack+ Buenos Aires",
  "organizer": "Stellar Foundation",
  "organizer_icon": "🌟",
  "start_time": "2024-12-25T10:00:00Z",
  "location": "Buenos Aires, Argentina",
  "description": "Hackathon description...",
  "image_url": "https://example.com/image.jpg",
  "status": "UPCOMING",
  "requires_xlm": true,
  "xlm_minimum": 10.5,
  "created_by": "G...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 2. list-events

Lista eventos disponíveis.

**Endpoint:** `GET /functions/v1/list-events`

**Headers (opcional):**
- `x-wallet-address`: Endereço da carteira Stellar (para marcar eventos registrados)

**Query Parameters:**
- `status`: Filtrar por status (LIVE, UPCOMING, ENDED)
- `limit`: Limite de resultados (padrão: 50, máximo: 100)
- `offset`: Offset para paginação (padrão: 0)

**Exemplo:**
```
GET /functions/v1/list-events?status=UPCOMING&limit=20&offset=0
```

**Response:**
```json
{
  "events": [
    {
      "id": "uuid",
      "event_id": "uuid",
      "title": "Stellar Hack+ Buenos Aires",
      "organizer": "Stellar Foundation",
      "organizer_icon": "🌟",
      "time": "2024-12-25T10:00:00Z",
      "location": "Buenos Aires, Argentina",
      "description": "...",
      "image": "https://example.com/image.jpg",
      "status": "UPCOMING",
      "requires_xlm": true,
      "xlm_minimum": 10.5,
      "created_by": "G...",
      "created_at": "2024-01-01T00:00:00Z",
      "attendees": 15,
      "is_registered": false
    }
  ],
  "count": 1,
  "limit": 20,
  "offset": 0
}
```

### 3. get-event

Busca detalhes de um evento específico.

**Endpoint:** `GET /functions/v1/get-event?event_id=uuid`

**Headers (opcional):**
- `x-wallet-address`: Endereço da carteira Stellar (para verificar se está registrado)

**Query Parameters:**
- `event_id`: ID do evento (obrigatório)

**Response:**
```json
{
  "id": "uuid",
  "event_id": "uuid",
  "title": "Stellar Hack+ Buenos Aires",
  "organizer": "Stellar Foundation",
  "organizer_icon": "🌟",
  "time": "2024-12-25T10:00:00Z",
  "location": "Buenos Aires, Argentina",
  "description": "...",
  "image": "https://example.com/image.jpg",
  "status": "UPCOMING",
  "requires_xlm": true,
  "xlm_minimum": 10.5,
  "created_by": "G...",
  "created_at": "2024-01-01T00:00:00Z",
  "attendees": 15,
  "is_registered": false
}
```

### 4. list-user-events

Lista eventos nos quais o usuário está registrado.

**Endpoint:** `GET /functions/v1/list-user-events`

**Headers:**
- `x-wallet-address`: Endereço da carteira Stellar do usuário (obrigatório)

**Query Parameters:**
- `limit`: Limite de resultados (padrão: 50, máximo: 100)
- `offset`: Offset para paginação (padrão: 0)

**Response:**
```json
{
  "events": [
    {
      "id": "uuid",
      "event_id": "uuid",
      "title": "Stellar Hack+ Buenos Aires",
      "organizer": "Stellar Foundation",
      "organizer_icon": "🌟",
      "time": "2024-12-25T10:00:00Z",
      "location": "Buenos Aires, Argentina",
      "description": "...",
      "image": "https://example.com/image.jpg",
      "status": "UPCOMING",
      "requires_xlm": true,
      "xlm_minimum": 10.5,
      "created_by": "G...",
      "created_at": "2024-01-01T00:00:00Z",
      "attendees": 15,
      "is_registered": true
    }
  ],
  "count": 1,
  "limit": 50,
  "offset": 0
}
```

### 5. register-attendance

Registra participação em um evento.

**Endpoint:** `POST /functions/v1/register-attendance`

**Headers:**
- `x-wallet-address`: Endereço da carteira Stellar do usuário

**Body:**
```json
{
  "event_id": "uuid-do-evento"
}
```

**Response:**
```json
{
  "attendance_id": "uuid",
  "event_id": "uuid-do-evento",
  "event_title": "Stellar Hack+ Buenos Aires",
  "user_wallet": "G...",
  "registered_at": "2024-01-01T00:00:00Z"
}
```

## Autenticação

Todas as functions usam autenticação baseada em endereço de carteira Stellar através do header `x-wallet-address`. O formato esperado é um endereço Stellar válido (começa com "G" e tem 56 caracteres).

## CORS

Todas as functions suportam CORS e podem ser chamadas de qualquer origem.

## Variáveis de Ambiente

As functions precisam das seguintes variáveis de ambiente configuradas no Supabase:

- `DB_URL`: URL do banco de dados Supabase
- `SERVICE_ROLE_KEY`: Chave de serviço do Supabase
- `ANON_KEY`: Chave anônima do Supabase (opcional)

## Deploy

Para fazer deploy das functions:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-project-ref

# Deploy das functions
supabase functions deploy create-event
supabase functions deploy list-events
supabase functions deploy get-event
supabase functions deploy list-user-events
supabase functions deploy register-attendance
```

## Desenvolvimento Local

Para testar localmente:

```bash
# Iniciar Supabase localmente
supabase start

# Executar function localmente
supabase functions serve create-event
```

### Configuração do Editor (VS Code)

Se você estiver usando VS Code e receber erros de TypeScript sobre imports do Deno:

1. **Instale a extensão Deno**: Instale a extensão oficial "Deno" do DenoLand no VS Code
2. **Habilite Deno para este workspace**: A extensão detectará automaticamente os arquivos `.ts` nas functions
3. **Alternativa**: O erro é apenas do TypeScript do editor - o código funciona corretamente quando executado pelo Deno/Supabase

Os imports do Deno (como `https://deno.land/std@0.208.0/http/server.ts`) são válidos e funcionam quando executados pelo runtime do Deno, mesmo que o TypeScript do editor mostre um erro.

## Estrutura do Banco de Dados

### Tabela: events
- `id`: UUID (primary key)
- `event_id`: VARCHAR(255) (unique)
- `title`: VARCHAR(255)
- `organizer`: VARCHAR(255)
- `organizer_icon`: VARCHAR(10)
- `start_time`: TIMESTAMP
- `location`: VARCHAR(255)
- `description`: TEXT
- `image_url`: TEXT
- `status`: VARCHAR(20) (LIVE, UPCOMING, ENDED)
- `requires_xlm`: BOOLEAN
- `xlm_minimum`: DECIMAL(18, 2)
- `created_by`: VARCHAR(255) (Stellar wallet)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Tabela: event_attendances
- `id`: UUID (primary key)
- `attendance_id`: VARCHAR(255) (unique)
- `event_id`: VARCHAR(255) (foreign key)
- `user_wallet`: VARCHAR(255) (Stellar wallet)
- `registered_at`: TIMESTAMP
- Unique constraint: (event_id, user_wallet)

### Tabela: logs
- `id`: UUID (primary key)
- `timestamp`: TIMESTAMP
- `level`: VARCHAR(20) (debug, info, warn, error)
- `context`: VARCHAR(100)
- `message`: TEXT
- `metadata`: JSONB
- `operation_id`: VARCHAR(255)
- `error_stack`: TEXT

## Funcionalidades Automáticas

### Atualização de Status de Eventos

O banco de dados possui um trigger que atualiza automaticamente o status dos eventos baseado na data/hora:
- **UPCOMING**: Evento ainda não começou
- **LIVE**: Evento está acontecendo agora (dentro de 24h do start_time)
- **ENDED**: Evento já passou

O status é atualizado automaticamente sempre que um evento é criado ou atualizado.

