# 🎨 Bento Grid - Creative Style Guide

## 📦 Componentes Criados

### 1. **BentoGrid** (`components/ui/bento-grid.tsx`)
Container responsivo para organizar cards em grid layout.

**Props:**
- `children`: ReactNode - Cards BentoCard
- `className`: string (opcional) - Classes CSS adicionais

**Layout:**
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3 colunas
- Altura automática: 22rem por linha
- Gap entre cards: 1.5rem (gap-6)

---

### 2. **BentoCard** (`components/ui/bento-grid.tsx`)
Card individual com estilo handwritten e animações.

**Props:**
- `name`: string - Título do card
- `description`: string - Descrição da feature
- `Icon`: Component - Ícone lucide-react
- `background`: ReactNode - Elemento de fundo (gradiente, imagem, etc)
- `href`: string - Link do botão CTA
- `cta`: string - Texto do botão
- `className`: string - Classes CSS para posicionamento no grid

**Estilo Criativo:**
- ✨ Borda preta grossa: `border-3 border-zinc-900`
- 🎯 Shadow offset: `shadow-[6px_6px_0px_0px]`
- 🔄 Hover: Shadow cresce + card translada
- 🎨 Ícone em badge amarelo com borda preta
- 📝 Fonte handwritten no título
- 🎪 Botão CTA aparece no hover (slide up)
- 🌈 Overlay amarelo suave no hover

---

### 3. **FeaturesSection** (`components/ui/features-section.tsx`)
Seção completa de features para Meet.XLM com 6 cards.

**Features Incluídas:**

1. **Mint NFT Badges** ⚡
   - Ícone: Zap (raio)
   - Background: Gradiente amber
   - Grid: 2 linhas, coluna 1

2. **Community Powered** 👥
   - Ícone: Users
   - Background: Gradiente blue
   - Grid: 1 linha, coluna 2

3. **Secure & Verified** 🛡️
   - Ícone: Shield
   - Background: Gradiente purple
   - Grid: 2-3 linhas, coluna 2

4. **Event Management** 📅
   - Ícone: Calendar
   - Background: Gradiente pink
   - Grid: 3 linhas, coluna 1

5. **Unlock Rewards** 🏆
   - Ícone: Trophy
   - Background: Gradiente green
   - Grid: 1-2 linhas, coluna 3

6. **Beautiful Design** ✨
   - Ícone: Sparkles
   - Background: Gradiente yellow
   - Grid: 3 linhas, coluna 3

---

## 🎨 Design System

### Cores dos Backgrounds
```tsx
// Amber
<div className="bg-gradient-to-br from-amber-200 via-amber-100 to-transparent" />

// Blue
<div className="bg-gradient-to-br from-blue-200 via-blue-100 to-transparent" />

// Purple
<div className="bg-gradient-to-br from-purple-200 via-purple-100 to-transparent" />

// Pink
<div className="bg-gradient-to-br from-pink-200 via-pink-100 to-transparent" />

// Green
<div className="bg-gradient-to-br from-green-200 via-green-100 to-transparent" />

// Yellow
<div className="bg-gradient-to-br from-yellow-200 via-yellow-100 to-transparent" />
```

### Elementos Visuais

| Elemento | Estilo |
|----------|--------|
| **Card Border** | `border-3 border-zinc-900` |
| **Card Shadow** | `shadow-[6px_6px_0px_0px]` |
| **Hover Shadow** | `shadow-[10px_10px_0px_0px]` |
| **Icon Badge** | Amarelo (`bg-amber-400`) com borda preta |
| **Icon Badge Size** | `w-14 h-14` |
| **Title Font** | `font-handwritten` |
| **Button** | Branco, borda preta, shadow-offset |

### Animações

1. **Card Hover:**
   ```css
   translate-x-[-4px] translate-y-[-4px]
   shadow-[10px_10px_0px_0px]
   ```

2. **Icon Badge Hover:**
   ```css
   rotate-[-5deg]
   shadow-[5px_5px_0px_0px]
   ```

3. **Content Hover:**
   ```css
   translate-y-[-4px]
   ```

4. **CTA Button:**
   - Inicial: `translate-y-10 opacity-0`
   - Hover: `translate-y-0 opacity-100`

5. **Overlay Hover:**
   ```css
   bg-amber-50/30
   ```

---

## 🚀 Como Usar

### Uso Básico

```tsx
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Zap } from "lucide-react";

const features = [
  {
    Icon: Zap,
    name: "Feature Name",
    description: "Feature description here",
    href: "/link",
    cta: "Learn more",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-amber-100 to-transparent" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  // ... mais features
];

<BentoGrid className="lg:grid-rows-3">
  {features.map((feature) => (
    <BentoCard key={feature.name} {...feature} />
  ))}
</BentoGrid>
```

### Personalizar Grid Layout

Use classes do Tailwind para controlar o posicionamento:

```tsx
// Card ocupa 2 linhas, coluna 1
className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2"

// Card ocupa 1 linha, coluna 2
className: "lg:row-start-1 lg:row-end-2 lg:col-start-2 lg:col-end-3"

// Card ocupa 3 colunas (full width)
className: "lg:col-span-3"
```

### Adicionar Nova Feature

```tsx
{
  Icon: YourIcon,
  name: "Your Feature",
  description: "Your description",
  href: "#your-link",
  cta: "Learn more",
  background: (
    <div className="absolute inset-0 bg-gradient-to-br from-COLOR-200 via-COLOR-100 to-transparent" />
  ),
  className: "lg:col-start-X lg:col-end-Y lg:row-start-A lg:row-end-B",
}
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- 1 coluna
- Cards em stack vertical
- Altura fixa: 22rem por card
- Gap: 1.5rem

### Tablet (768px - 1024px)
- 2 colunas
- Grid se ajusta automaticamente
- Cards podem ocupar múltiplas colunas

### Desktop (> 1024px)
- 3 colunas
- Grid totalmente controlável via className
- Layout personalizado por card

---

## 🎯 Features da Seção

### Header da Seção
- Badge azul: "Features"
- Título handwritten: "Everything you need"
- Descrição: Texto explicativo
- Centralizado

### Cards
Cada card tem:
1. Background gradiente (20% opacidade, 30% no hover)
2. Icon badge amarelo (14x14, borda preta, rotação no hover)
3. Título handwritten (text-2xl)
4. Descrição (text-base, zinc-700)
5. Botão CTA (aparece no hover)
6. Overlay amarelo suave (amber-50/30)

---

## 💡 Dicas de Customização

### Mudar Cor do Icon Badge
```tsx
// Trocar amber-400 por outra cor
className="bg-blue-400" // Azul
className="bg-purple-400" // Roxo
className="bg-green-400" // Verde
```

### Mudar Background do Card
```tsx
// Usar imagem
background: <img src="/path/to/image.jpg" className="absolute inset-0 object-cover" />

// Usar padrão
background: <div className="absolute inset-0 bg-[url('/pattern.svg')]" />

// Sem background
background: null
```

### Ajustar Shadow Offset
```tsx
// Shadow maior
shadow-[8px_8px_0px_0px]
hover:shadow-[12px_12px_0px_0px]

// Shadow menor
shadow-[4px_4px_0px_0px]
hover:shadow-[6px_6px_0px_0px]
```

---

## ✅ Checklist de Integração

- [x] Componente BentoGrid criado
- [x] Componente BentoCard criado  
- [x] FeaturesSection com 6 features
- [x] Ícones lucide-react
- [x] Backgrounds gradientes
- [x] Estilo handwritten aplicado
- [x] Animações de hover
- [x] Responsive design
- [x] Integrado na página principal

---

## 🎨 Ícones Disponíveis (lucide-react)

Alguns ícones úteis para features:
- `Zap` - Velocidade/energia
- `Users` - Comunidade
- `Shield` - Segurança
- `Calendar` - Eventos
- `Trophy` - Conquistas
- `Sparkles` - Design/magia
- `Rocket` - Lançamento
- `Heart` - Favoritos
- `Star` - Destaque
- `Check` - Verificado
- `Lock` - Privacidade
- `Globe` - Global/multilingual

Ver todos: https://lucide.dev/icons/

---

Built with ❤️ for Meet.XLM - Stellar Proof of Attendance Protocol

