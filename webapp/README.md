# Meet.XLM - Web App 🎉

Web app PWA (Progressive Web App) para organizar e participar de eventos Stellar, desenvolvido com React, TypeScript e Vite.

## 🎨 Design System

Este app segue um design limpo e minimalista com:
- **Estilo Clean** - Bordas finas, espaçamento generoso
- **Minimalista** - Foco no conteúdo, sem distrações
- **Cores Neutras** - Branco, cinzas e acentos sutis
- **Tipografia Legível** - Hierarquia clara e pesos balanceados

## 🚀 Funcionalidades

- ✨ Interface moderna e clean
- 📅 Lista de eventos com status (LIVE/EM BREVE)
- 📍 Informações de localização e horário
- 🗓️ Calendários personalizados
- 🎯 Navegação intuitiva com bottom tabs
- ✅ **Status de confirmação visual** - Badge "Confir..." nos eventos confirmados
- 🎨 Design minimalista e focado no conteúdo
- 📱 **PWA** - Instalável como app nativo
- 🔐 Integração com Stellar Wallet
- 🛡️ Prova Zero-Knowledge para verificação de saldo XLM

## 🛠️ Tecnologias

- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **PWA Plugin** - Suporte a Progressive Web App
- **Stellar SDK** - Integração com blockchain Stellar
- **React Icons** - Ícones do app
- **CSS Modules** - Estilos modulares

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Ou com yarn
yarn install
```

## 🎮 Executando o App

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

O app estará disponível em `http://localhost:5173`

## 📱 PWA (Progressive Web App)

Este app é um PWA completo, o que significa que você pode:

1. **Instalar no dispositivo**: Ao acessar o app no navegador, você verá uma opção para "Instalar app"
2. **Funcionar offline**: O service worker permite que o app funcione mesmo sem conexão
3. **Experiência nativa**: O app se comporta como um app nativo quando instalado

### Instalando o PWA

- **Desktop**: Procure pelo ícone de instalação na barra de endereços do navegador
- **Mobile**: Use a opção "Adicionar à tela inicial" no menu do navegador

## 🔑 Autenticação

- O app atualmente usa autenticação mockada para desenvolvimento.
- Clique no botão "Login (Mocked)" na tela de login para acessar o app.
- A carteira Stellar é criada automaticamente e armazenada no localStorage.

## 📱 Estrutura do Projeto

```
webapp/
├── public/              # Arquivos estáticos e ícones PWA
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Header.tsx
│   │   ├── EventCard.tsx
│   │   ├── CalendarCard.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── UserMenu.tsx
│   │   └── Modals/
│   ├── screens/         # Telas do app
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── EventDetailsScreen.tsx
│   │   └── CreateEventScreen.tsx
│   ├── hooks/           # Custom hooks
│   │   └── useStellarWallet.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── data/            # Mock data
│   │   └── mockData.ts
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Entry point
├── index.html
├── vite.config.ts       # Configuração do Vite e PWA
├── tsconfig.json
└── package.json
```

## 🎨 Componentes Principais

### HomeScreen
Tela principal que exibe:
- Header com logo Meet.XLM e menu do usuário
- Seção "Your Events" com eventos confirmados
- Seção "Your Collections" com calendários
- Bottom navigation com tabs

### EventCard
Card de evento com:
- Borda preta grossa (3px)
- Sombra dura 6x6
- Imagem do evento
- Badge do organizador
- Badge de status (LIVE/UPCOMING)
- Informações de tempo e localização

### CalendarCard
Card de calendário com:
- Borda preta 3px
- Sombra dura 5x5
- Imagem do calendário
- Overlay com nome

### Header
Cabeçalho do app com:
- Logo "Meet.XLM" com texto rotacionado
- Avatar com emoji ✨
- Menu do usuário com informações da carteira Stellar

### BottomNavigation
Navegação inferior com:
- 5 tabs: Home, Busca, Adicionar, Notificações, Configurações
- Tab ativa destacada em amarelo
- Ícones maiores e mais visíveis

## 🔐 Stellar Wallet Integration

O app integra com a blockchain Stellar:
- Criação automática de carteira Stellar
- Armazenamento seguro no localStorage
- Verificação de saldo XLM
- Prova Zero-Knowledge para verificação de saldo mínimo

## 🎯 Próximos Passos

- [ ] Integração com backend/API
- [ ] Sistema de autenticação real
- [ ] Criação de eventos com persistência
- [ ] Sistema de notificações push
- [ ] Chat entre participantes
- [ ] Integração completa com Stellar blockchain
- [ ] Pagamentos com XLM
- [ ] NFT Tickets (POAPs)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Time

Desenvolvido para o Stellar Hack+ Buenos Aires 2024

