# 📱 Como Instalar o Meet.XLM como PWA

O Meet.XLM é um Progressive Web App (PWA), o que significa que você pode instalá-lo no seu dispositivo e usá-lo como um app nativo!

## 🚀 Como Instalar

### **Desktop (Chrome, Edge, Firefox)**

1. Abra o app no navegador: `http://localhost:5173` (dev) ou sua URL de produção
2. Procure pelo ícone de instalação na barra de endereços (canto direito)
   - Chrome/Edge: Ícone de "+" ou "Instalar"
   - Firefox: Menu (três linhas) → "Instalar"
3. Clique em "Instalar" ou "Adicionar à tela inicial"
4. Confirme a instalação
5. O app será instalado e poderá ser aberto como um aplicativo independente

### **Mobile (Android - Chrome)**

1. Abra o app no navegador Chrome
2. Toque no menu (três pontos) no canto superior direito
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. Confirme o nome do app e toque em "Adicionar"
5. O ícone do app aparecerá na sua tela inicial

### **Mobile (iOS - Safari)**

1. Abra o app no Safari
2. Toque no botão de compartilhar (quadrado com seta para cima)
3. Role para baixo e toque em "Adicionar à Tela de Início"
4. Edite o nome se desejar e toque em "Adicionar"
5. O ícone do app aparecerá na sua tela inicial

## ✨ Funcionalidades do PWA

Quando instalado como PWA, o app oferece:

- ✅ **Experiência Nativa**: Abre como um app independente, sem barra do navegador
- ✅ **Funciona Offline**: Service Worker permite uso básico sem internet
- ✅ **Atualizações Automáticas**: O app se atualiza automaticamente quando há novas versões
- ✅ **Ícone na Tela Inicial**: Acesso rápido como qualquer app nativo
- ✅ **Notificações Push**: Suporte para notificações (quando implementado)

## 🔧 Desenvolvimento

### Build para Produção

Para testar o PWA em produção:

```bash
npm run build
npm run preview
```

### Verificar Service Worker

1. Abra as DevTools (F12)
2. Vá para a aba "Application" (Chrome) ou "Storage" (Firefox)
3. Verifique "Service Workers" - deve mostrar o worker registrado
4. Verifique "Manifest" - deve mostrar as informações do PWA

### Testar Offline

1. Abra as DevTools (F12)
2. Vá para a aba "Network"
3. Marque "Offline"
4. Recarregue a página - o app deve continuar funcionando

## 📝 Notas Importantes

- O PWA só funciona em **HTTPS** em produção (ou localhost em desenvolvimento)
- Os ícones PWA (192x192 e 512x512) precisam estar na pasta `public/`
- O Service Worker é registrado automaticamente pelo Vite PWA Plugin
- Atualizações são automáticas quando há mudanças no código

## 🎨 Personalizar Ícones

Para adicionar seus próprios ícones:

1. Crie imagens PNG:
   - `pwa-192x192.png` (192x192 pixels)
   - `pwa-512x512.png` (512x512 pixels)
2. Coloque na pasta `public/`
3. Rebuild o app: `npm run build`

## 🐛 Troubleshooting

### PWA não aparece para instalação?

- Verifique se está usando HTTPS (ou localhost)
- Verifique se o manifest.json está sendo gerado (aba Application → Manifest)
- Verifique se o Service Worker está registrado (aba Application → Service Workers)
- Limpe o cache do navegador e recarregue

### App não funciona offline?

- Verifique se o Service Worker está ativo
- Verifique se os arquivos estão sendo cacheados corretamente
- Teste em modo de produção (`npm run build && npm run preview`)

### Ícones não aparecem?

- Verifique se os arquivos PNG existem na pasta `public/`
- Verifique se os caminhos no `vite.config.ts` estão corretos
- Rebuild o app após adicionar novos ícones

