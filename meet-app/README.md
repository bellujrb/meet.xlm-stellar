# Meet.XLM - Stellar Events App 🎉

App de eventos com design **Clean e Minimalista** inspirado no Luma, desenvolvido com React Native e Expo.

## 🎨 Design System

Este app segue um design limpo e minimalista com:
- **Estilo Clean** - Bordas finas, espaçamento generoso
- **Minimalista** - Foco no conteúdo, sem distrações
- **Cores Neutras** - Branco, cinzas e acentos sutis
- **Tipografia Legível** - Hierarquia clara e pesos balanceados

Ver [CHANGELOG.md](./CHANGELOG.md) para histórico de mudanças de design.

## 🚀 Funcionalidades

- ✨ Interface moderna e clean
- 📅 Lista de eventos com status (LIVE/EM BREVE)
- 📍 Informações de localização e horário
- 🗓️ Calendários personalizados
- 🎯 Navegação intuitiva com bottom tabs
- ✅ **Status de confirmação visual** - Badge "Confir..." nos eventos confirmados
- 🎨 Design minimalista e focado no conteúdo

## 🛠️ Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **@expo/vector-icons** - Ícones do app

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Ou com yarn
yarn install
```

## 🎮 Executando o App

```bash
# Iniciar o servidor Expo
npm start

# Rodar no iOS
npm run ios

# Rodar no Android
npm run android

# Rodar no Web
npm run web
```

## 🔑 Autenticação

- O app atualmente usa autenticação mockada para desenvolvimento.
- Clique no botão "Login (Mocked)" na tela de login para acessar o app.

## 📱 Estrutura do Projeto

```
meet-app/
├── assets/              # Imagens e ícones
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── EventCard.tsx
│   │   ├── CalendarCard.tsx
│   │   ├── Header.tsx
│   │   └── BottomNavigation.tsx
│   ├── screens/         # Telas do app
│   │   └── HomeScreen.tsx
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── data/            # Mock data
│       └── mockData.ts
├── App.tsx              # Componente principal
├── DESIGN_GUIDE.md      # Guia do sistema de design
└── package.json         # Dependências
```

## 🎨 Componentes Principais

### HomeScreen
Tela principal que exibe:
- Header com logo Meet.XLM e configurações
- Seção "Seus Eventos" com emojis decorativos 🎉
- Lista de eventos com cards estilizados
- Seção "Seus Calendários" 📅
- Scroll horizontal de calendários
- Seção "Escolhidos para Você" ✨
- Bottom navigation com tabs ativas em amarelo

### EventCard (Estilo Neobrutalist)
Card de evento com:
- Borda preta grossa (3px)
- Sombra dura 6x6
- Imagem do evento com borda inferior
- Badge do organizador (arredondado, com borda)
- Badge de status rotacionado (LIVE: vermelho, UPCOMING: cinza)
- Título bold e grande
- Detalhes com ícones em badges
- Botão amarelo de confirmação

### CalendarCard
Card de calendário com:
- Borda preta 3px
- Sombra dura 5x5
- Imagem do calendário
- Overlay preto com nome

### Header (Estilo Neobrutalist)
Cabeçalho do app com:
- Background bege (#F5F1E8)
- Logo "Meet.XLM" com texto rotacionado
- Avatar com emoji ✨ em círculo amarelo
- Bordas e sombras no estilo neobrutalist
- Botão de configurações em círculo branco

### BottomNavigation
Navegação inferior com:
- Background bege matching header
- 5 tabs: Home, Busca, Adicionar, Favoritos, Mensagens
- Tab ativa: background amarelo com borda preta e sombra
- Ícones maiores e mais visíveis

## 🎯 Próximos Passos

- [ ] Integração com backend/API
- [ ] Sistema de autenticação
- [ ] Criação de eventos
- [ ] Sistema de notificações
- [ ] Chat entre participantes
- [ ] Integração com Stellar blockchain
- [ ] Pagamentos com XLM
- [ ] NFT Tickets

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
