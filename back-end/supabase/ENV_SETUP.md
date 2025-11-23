# ⚠️ Configuração de Variáveis de Ambiente

> 📝 **Arquivo de exemplo:** Veja `env.example` para um template completo de todas as variáveis de ambiente necessárias.

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

   **Secret 4 (Para integração Soroban - RECOMENDADO):**
   - Name: `SOROBAN_SEED_PHRASE`
   - Value: `stamp license check gas atom jaguar victory worry trim hip supreme space cost tackle style lucky perfect test venture cattle friend child laugh census`
   - ⚠️ Esta é a seed phrase que será convertida automaticamente em secret key
   - ⚠️ A conta derivada precisa ter XLM suficiente na Futurenet para pagar as taxas de transação

   **Secret 5 (Alternativa - se não usar seed phrase):**
   - Name: `SOROBAN_SECRET_KEY`
   - Value: [sua chave secreta da conta Stellar diretamente]
   - ⚠️ Use apenas se não quiser usar a seed phrase
   - ⚠️ Esta conta precisa ter XLM suficiente para pagar as taxas de transação

   **Secret 6 (Opcional - configuração Soroban):**
   - Name: `SOROBAN_RPC_URL`
   - Value: `https://soroban-futurenet.stellar.org:443` (padrão: futurenet)
   - Ou: `https://soroban-testnet.stellar.org:443` (para testnet)

   **Secret 7 (Opcional - configuração Soroban):**
   - Name: `SOROBAN_NETWORK_PASSPHRASE`
   - Value: `Test SDF Future Network ; October 2022` (padrão: futurenet)
   - Ou: `Test SDF Network ; September 2015` (para testnet)

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

## Configuração do Soroban (Futurenet)

A integração está configurada para usar a **Futurenet** por padrão. Para que a função `verify` envie hashes ao contrato Soroban na Stellar, você precisa:

1. **Adicionar a Seed Phrase como variável de ambiente:**
   - No Supabase Dashboard > Edge Functions > Secrets
   - Adicione `SOROBAN_SEED_PHRASE` com a seed phrase fornecida:
     ```
     stamp license check gas atom jaguar victory worry trim hip supreme space cost tackle style lucky perfect test venture cattle friend child laugh census
     ```
   - O sistema converterá automaticamente a seed phrase em uma secret key usando o caminho de derivação padrão do Stellar (`m/44'/148'/0'`)

2. **Obter XLM na Futurenet:**
   - Acesse: https://laboratory.stellar.org/#account-creator?network=futurenet
   - Ou use o Friendbot da Futurenet para obter XLM de teste
   - Certifique-se de que a conta derivada da seed phrase tenha XLM suficiente para pagar taxas de transação

3. **Verificar o Contract ID:**
   - O Contract ID está hardcoded no código: `CDDCZS36ZERM7L2C4H6CC3PYYQPLWR357BOEJROMTL4X5WLVDNO4GSLI`
   - Certifique-se de que este contrato está deployado na **Futurenet**

4. **Rede configurada:**
   - **Rede padrão:** Futurenet
   - **RPC URL padrão:** `https://soroban-futurenet.stellar.org:443`
   - **Network Passphrase:** `Test SDF Future Network ; October 2022`

## Importante

- ⚠️ **NUNCA** compartilhe a `SERVICE_ROLE_KEY` publicamente
- ⚠️ **NUNCA** compartilhe a `SOROBAN_SEED_PHRASE` ou `SOROBAN_SECRET_KEY` publicamente
- ⚠️ **NUNCA** commite secrets no código
- ✅ Os secrets são armazenados de forma segura no Supabase
- ✅ Cada function tem acesso automático aos secrets configurados
- ⚠️ A conta Stellar derivada da seed phrase precisa ter XLM suficiente na **Futurenet** para pagar taxas de transação
- ✅ A seed phrase é automaticamente convertida em secret key usando o caminho de derivação padrão do Stellar

