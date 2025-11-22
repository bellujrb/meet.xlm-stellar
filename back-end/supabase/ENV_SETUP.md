# ⚠️ Configuração de Variáveis de Ambiente

## Problema Identificado

As functions estão retornando erro `500 - Internal server error` porque as variáveis de ambiente não estão configuradas.

## Solução: Configurar Secrets no Supabase Dashboard

### Passo 1: Acessar Edge Functions Secrets

1. Acesse: https://supabase.com/dashboard/project/fmyubhvjgjsnltlgpmkz
2. Vá em **Project Settings** (ícone de engrenagem no canto inferior esquerdo)
3. Clique em **Edge Functions** no menu lateral
4. Clique na aba **Secrets**

### Passo 2: Obter os Valores Necessários

#### DB_URL (Connection String)

1. No dashboard, vá em **Settings** > **Database**
2. Role até **Connection string**
3. Selecione **URI** ou **Connection pooling**
4. Copie a string de conexão
5. Formato esperado: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
   - OU: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`

#### SERVICE_ROLE_KEY

1. No dashboard, vá em **Settings** > **API**
2. Role até **Project API keys**
3. Copie a chave **service_role** (secret) - ⚠️ **NÃO compartilhe esta chave!**
4. Esta chave tem permissões completas no banco de dados

#### ANON_KEY (Opcional)

1. No mesmo local (**Settings** > **API**)
2. Copie a chave **anon** (public)
3. Esta é opcional, mas recomendada para algumas operações

### Passo 3: Adicionar os Secrets

No painel de **Edge Functions** > **Secrets**:

1. Clique em **Add new secret**
2. Adicione cada variável:

   **Secret 1:**
   - Name: `DB_URL`
   - Value: [cole a connection string copiada]

   **Secret 2:**
   - Name: `SERVICE_ROLE_KEY`
   - Value: [cole a service_role key]

   **Secret 3 (Opcional):**
   - Name: `ANON_KEY`
   - Value: [cole a anon key]

3. Clique em **Save** para cada secret

### Passo 4: Verificar

Após adicionar os secrets, aguarde alguns segundos e teste novamente:

```bash
curl -X GET "https://fmyubhvjgjsnltlgpmkz.supabase.co/functions/v1/list-events" \
  -H "Content-Type: application/json"
```

Você deve receber uma resposta JSON com a lista de eventos (provavelmente vazia se não houver eventos ainda).

## Exemplo de Resposta Esperada

Após configurar as variáveis, você deve receber:

```json
{
  "data": {
    "events": [],
    "count": 0,
    "limit": 50,
    "offset": 0
  }
}
```

Ou, se houver eventos:

```json
{
  "data": {
    "events": [
      {
        "id": "uuid",
        "event_id": "uuid",
        "title": "Event Name",
        "organizer": "Organizer Name",
        ...
      }
    ],
    "count": 1,
    "limit": 50,
    "offset": 0
  }
}
```

## Importante

- ⚠️ **NUNCA** compartilhe a `SERVICE_ROLE_KEY` publicamente
- ⚠️ **NUNCA** commite secrets no código
- ✅ Os secrets são armazenados de forma segura no Supabase
- ✅ Cada function tem acesso automático aos secrets configurados

