# 🚀 Quick Start - Deploy Supabase Functions

## ✅ O que já foi configurado:

1. ✅ Supabase CLI instalado
2. ✅ `config.toml` atualizado com todas as configurações
3. ✅ Script de deploy automatizado criado (`deploy.sh`)
4. ✅ Guia completo de deploy criado (`DEPLOY_GUIDE.md`)

## 🎯 Próximos passos (execute no terminal):

### 1. Login no Supabase
```bash
cd back-end/supabase
supabase login
```
*Isso abrirá seu navegador para autenticação*

### 2. Linkar seu projeto
```bash
# Substitua SEU_PROJECT_REF pelo Reference ID do seu projeto
# Encontre em: https://supabase.com/dashboard > Settings > General
supabase link --project-ref SEU_PROJECT_REF
```

### 3. Executar o script de deploy (recomendado)
```bash
./deploy.sh
```

**OU** deploy manual:

```bash
# Aplicar migrations
supabase db push

# Deploy das functions
supabase functions deploy create-event
supabase functions deploy list-events
supabase functions deploy get-event
supabase functions deploy list-user-events
supabase functions deploy register-attendance
```

### 4. Configurar variáveis de ambiente no Dashboard

No Supabase Dashboard:
1. Vá em **Project Settings** > **Edge Functions** > **Secrets**
2. Adicione:
   - `DB_URL`: Connection string do banco (Settings > Database)
   - `SERVICE_ROLE_KEY`: service_role key (Settings > API)
   - `ANON_KEY`: anon public key (Settings > API) - opcional

## 📚 Documentação

- Guia completo: `DEPLOY_GUIDE.md`
- Script automatizado: `deploy.sh`

## 🆘 Precisa de ajuda?

Consulte o arquivo `DEPLOY_GUIDE.md` para instruções detalhadas e troubleshooting.

