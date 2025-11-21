# 🎨 Design Guide - Meet.XLM App

Este guia documenta o sistema de design do Meet.XLM App, inspirado no estilo **Neobrutalism/Doodle**.

## 🎯 Filosofia de Design

O design do Meet.XLM segue uma estética **neobrutalist** com elementos **doodle**, caracterizada por:

- **Bordas grossas e pretas** (#18181B, 2-3px)
- **Sombras duras** (sem blur, offset fixo)
- **Cores vibrantes** mas controladas
- **Elementos rotacionados** levemente
- **Emojis decorativos** 
- **Tipografia bold e impactante**

## 🎨 Paleta de Cores

### Principais
```
Background:    #F5F1E8 (Bege creme)
Primary:       #FBBF24 (Amarelo âmbar)
Secondary:     #7C3AED (Roxo)
Tertiary:      #3B82F6 (Azul)
```

### Neutras
```
Black:         #18181B (Quase preto)
White:         #FFFFFF
Gray Light:    #E5E7EB
Gray Medium:   #71717A
```

### Acentos
```
Live/Alert:    #EF4444 (Vermelho)
Success:       #10B981 (Verde)
Info:          #06B6D4 (Ciano)
```

## 📐 Espaçamentos

```javascript
// Padding interno de componentes
Small:    8-12px
Medium:   14-16px
Large:    20-24px

// Margins entre seções
Section:  32-36px
Cards:    16-20px
```

## 🔲 Bordas e Sombras

### Bordas
```javascript
// Todos os componentes principais têm bordas grossas
borderWidth: 2-3px
borderColor: '#18181B'
borderRadius: 12-20px (arredondado mas não circular)
```

### Sombras (Estilo Neobrutalist)
```javascript
// Sombra padrão
shadowColor: '#18181B'
shadowOffset: { width: 4, height: 4 }
shadowOpacity: 1
shadowRadius: 0  // Sem blur!

// Sombra pequena (badges, botões)
shadowOffset: { width: 2, height: 2 }

// Sombra grande (cards principais)
shadowOffset: { width: 6, height: 6 }
```

## 📝 Tipografia

### Tamanhos
```javascript
Hero Title:     32-36px (weight: 800)
Section Title:  28-32px (weight: 800)
Card Title:     20-22px (weight: 700-800)
Body Large:     16-18px (weight: 600-700)
Body Regular:   14-15px (weight: 600)
Caption:        12-13px (weight: 600-700)
```

### Características
- **Letter spacing**: -0.5 a -1 para títulos
- **Line height**: 1.2-1.4 para títulos
- **Weight**: Sempre bold (600+)

## 🎭 Componentes

### EventCard
```javascript
{
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  borderWidth: 3,
  borderColor: '#18181B',
  shadowOffset: { width: 6, height: 6 },
}
```

**Elementos:**
- Imagem com borda inferior
- Badge do organizador (arredondado, com borda)
- Badge de status (LIVE: vermelho, UPCOMING: cinza)
- Título bold e grande
- Detalhes com ícones em pequenos badges
- Botão amarelo de confirmação

### CalendarCard
```javascript
{
  borderRadius: 16,
  borderWidth: 3,
  borderColor: '#18181B',
  shadowOffset: { width: 5, height: 5 },
}
```

### Header
```javascript
{
  backgroundColor: '#F5F1E8',
  borderBottomWidth: 3,
  borderBottomColor: '#18181B',
}
```

**Logo:**
- Avatar com emoji ✨
- Background amarelo (#FBBF24)
- Rotação -5deg
- Bordas e sombra

### BottomNavigation
```javascript
{
  backgroundColor: '#F5F1E8',
  borderTopWidth: 3,
  borderTopColor: '#18181B',
}
```

**Tab ativo:**
- Background amarelo (#FBBF24)
- Borda preta
- Sombra 2x2

## 🎪 Elementos Decorativos

### Emojis
Usados para adicionar personalidade:
- 🎉 (Eventos)
- 📅 (Calendários)
- ✨ (Destaques)
- 🔮 (Em breve)
- ⭐️ (Favoritos)

**Styling:**
- Tamanho: 24-48px
- Rotação: 10-15deg
- Posicionamento: Ao lado de títulos ou cantos

### Badges
```javascript
{
  paddingHorizontal: 12-14px,
  paddingVertical: 6-8px,
  borderRadius: 20px,
  borderWidth: 2,
  borderColor: '#18181B',
  transform: [{ rotate: '3deg' }], // Opcional
}
```

### Rotações
- Elementos estáticos: -1deg a 1deg
- Badges e tags: 3deg a 5deg
- Emojis: 10deg a 15deg

## 🎬 Animações

### Hover/Press States
```javascript
// Aumentar sombra
shadowOffset: { width: 6, height: 6 } → { width: 8, height: 8 }

// Mover elemento
transform: [
  { translateX: -2 },
  { translateY: -2 }
]

// Rotacionar
transform: [{ rotate: '3deg' }] → [{ rotate: '0deg' }]
```

### Transições
- Duração: 200-300ms
- Easing: ease-out ou spring

## 📱 Estados de Componentes

### Live/Active
```javascript
{
  backgroundColor: '#EF4444',
  color: '#FFFFFF',
}
```

### Upcoming
```javascript
{
  backgroundColor: '#E5E7EB',
  color: '#18181B',
}
```

### Selected/Active Nav
```javascript
{
  backgroundColor: '#FBBF24',
  borderWidth: 2,
  borderColor: '#18181B',
}
```

### Empty State
```javascript
{
  backgroundColor: '#FFFFFF',
  borderWidth: 3,
  borderColor: '#18181B',
  borderStyle: 'dashed',
  shadowOffset: { width: 4, height: 4 },
}
```

## ✅ Checklist de Componente

Ao criar um novo componente, verifique:

- [ ] Borda preta de 2-3px
- [ ] Sombra dura (sem blur)
- [ ] Border radius entre 12-20px
- [ ] Tipografia bold (600+)
- [ ] Cores da paleta oficial
- [ ] Espaçamento consistente
- [ ] Emoji decorativo (se aplicável)
- [ ] Estados hover/active definidos
- [ ] Acessibilidade (contraste, tamanhos)

## 🚀 Exemplos de Uso

### Botão Primário
```javascript
{
  backgroundColor: '#FBBF24',
  color: '#18181B',
  borderWidth: 3,
  borderColor: '#18181B',
  borderRadius: 16,
  paddingHorizontal: 24,
  paddingVertical: 14,
  fontWeight: '800',
  shadowColor: '#18181B',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
}
```

### Badge de Status
```javascript
{
  backgroundColor: '#EF4444', // ou '#E5E7EB'
  color: '#FFFFFF', // ou '#18181B'
  borderWidth: 2,
  borderColor: '#18181B',
  borderRadius: 20,
  paddingHorizontal: 14,
  paddingVertical: 6,
  fontWeight: '700',
  fontSize: 12,
  transform: [{ rotate: '3deg' }],
}
```

## 🎨 Inspirações

O design é inspirado em:
- **Neobrutalism** - Bordas grossas, sombras duras
- **Doodle Style** - Elementos rotacionados, handwritten feel
- **Memphis Design** - Cores vibrantes, formas geométricas
- **Y2K Aesthetic** - Nostalgia digital, elementos divertidos

---

**Última atualização:** Novembro 2024
**Versão:** 1.0

