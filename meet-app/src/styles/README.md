# 🎨 Styles Directory

Esta pasta contém todos os estilos (StyleSheets) do app, organizados por tipo.

## 📁 Estrutura

```
styles/
├── components/          # Estilos dos componentes reutilizáveis
│   ├── Header.styles.ts
│   ├── EventCard.styles.ts
│   ├── CalendarCard.styles.ts
│   ├── BottomNavigation.styles.ts
│   ├── SuccessModal.styles.ts
│   ├── RegisterSuccessModal.styles.ts
│   └── ZKProofModal.styles.ts
├── screens/             # Estilos das telas principais
│   ├── HomeScreen.styles.ts
│   ├── EventDetailsScreen.styles.ts
│   ├── CreateEventScreen.styles.ts
│   ├── SearchScreen.styles.ts
│   ├── NotificationsScreen.styles.ts
│   └── SettingsScreen.styles.ts
└── README.md

## 🎯 Como Usar

```typescript
// Importar estilos em um componente
import { styles } from '../styles/components/Header.styles';

// Usar no JSX
<View style={styles.header}>
  ...
</View>
```

## ✅ Benefícios

- **Separação de responsabilidades**: Lógica separada de estilo
- **Manutenibilidade**: Fácil encontrar e modificar estilos
- **Reutilização**: Estilos podem ser compartilhados
- **Performance**: StyleSheets são otimizados pelo React Native
- **Organização**: Estrutura clara e escalável

## 🎨 Padrão de Design

Todos os estilos seguem o **design neobrutalist**:
- Bordas grossas pretas (2-3px)
- Sombras duras sem blur
- Cores vibrantes (#FBBF24, #A78BFA, #4ADE80)
- Elementos rotacionados
- Tipografia bold (600-800)

