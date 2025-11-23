# Configuração Vercel

## Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no painel da Vercel:

1. **VITE_SUPABASE_URL**
   - URL do seu projeto Supabase
   - Exemplo: `https://fmyubhvjgjsnltlgpmkz.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**
   - Chave anônima do Supabase (pública, segura para frontend)
   - Encontre em: Supabase Dashboard > Settings > API > anon/public key

## Como Configurar

1. Acesse o painel da Vercel: https://vercel.com
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Adicione as variáveis acima
5. Faça um novo deploy

## Build Settings

O projeto está configurado para:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Troubleshooting

Se a aplicação aparecer em branco:

1. Verifique se as variáveis de ambiente estão configuradas
2. Verifique os logs de build na Vercel
3. Abra o console do navegador para ver erros
4. Verifique se o build está completando com sucesso

