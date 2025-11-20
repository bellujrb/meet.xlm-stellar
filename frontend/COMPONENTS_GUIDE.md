# 🎨 Meet.XLM Creative Components Guide

## 📦 Components Created

### 1. **CreativeNavbar** (`components/ui/creative-navbar.tsx`)
A fun, handwritten-style navigation bar with:
- Sticky positioning
- Mobile-responsive menu
- Animated logo with shadow effects
- Border-2 zinc-900 style (matching creative-pricing)
- Hover animations with translate and rotate effects

**Features:**
- Desktop navigation links
- Mobile hamburger menu
- CTA button with shadow-offset effect
- Font-handwritten styling

---

### 2. **CreativeHeader** (`components/ui/creative-header.tsx`)
A hero section featuring the 3D robot with creative styling:
- Grid layout (responsive: 1 col mobile, 2 cols desktop)
- Interactive 3D Spline robot on the right
- Text content with handwritten font on the left
- Multiple CTA buttons
- Decorative elements (stars, underlines, badges)
- Tag badge with "Built on Stellar"
- Social proof section showing user count

**Design Elements:**
- Rotated text (-2deg, 1deg variations)
- Shadow-offset effects (`shadow-[4px_4px_0px_0px]`)
- Border-2 with zinc-900
- Hover effects with translate animations
- Gradient backgrounds

---

### 3. **CreativePricing** (`components/ui/creative-pricing.tsx`)
A pricing section with 3D card effects:
- 3-column grid layout (responsive)
- Each card has rotation effect
- Shadow-offset animations on hover
- "Popular" badge for featured plan
- Handwritten font styling
- Icons from lucide-react

**Card Features:**
- Price display
- Feature list with checkmarks
- CTA buttons with custom styling
- Hover animations (shadow grows, card translates)

---

### 4. **InteractiveRobotSpline** (`components/blocks/interactive-3d-robot.tsx`)
3D robot component using Spline:
- Lazy loading with Suspense
- Loading fallback with spinner
- Client-side only rendering (`'use client'`)
- Customizable scene URL

---

### 5. **Button** (`components/ui/button.tsx`)
shadcn/ui Button component with variants:
- Multiple variants: default, destructive, outline, secondary, ghost, link
- Multiple sizes: default, sm, lg, icon
- Uses class-variance-authority
- Supports asChild prop with Radix Slot

---

### 6. **Card** (`components/ui/card.tsx`)
shadcn/ui Card components:
- Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent
- Used as base for other components

---

## 🎨 Design System

### Colors
- **Primary:** Amber-400/500 (yellow/gold)
- **Accents:** Blue-500, Purple-500
- **Text:** Zinc-900 (dark mode: white)
- **Borders:** Zinc-900 (dark mode: white)

### Typography
- **Font Family:** `font-handwritten` (Comic Sans MS, cursive)
- **Weights:** 400, 700, 900 (bold)
- **Sizes:** text-sm to text-7xl

### Effects
1. **Border Style:** `border-2 border-zinc-900`
2. **Shadow Offset:** `shadow-[4px_4px_0px_0px] shadow-zinc-900`
3. **Hover Effect:** 
   ```tsx
   group-hover:shadow-[8px_8px_0px_0px]
   group-hover:translate-x-[-4px]
   group-hover:translate-y-[-4px]
   ```
4. **Rotations:** `rotate-[-1deg]`, `rotate-[1deg]`, `rotate-[-2deg]`

---

## 📚 Dependencies Installed

```json
{
  "lucide-react": "^latest",
  "@radix-ui/react-slot": "^latest",
  "class-variance-authority": "^latest",
  "@splinetool/react-spline": "^latest"
}
```

---

## 🚀 Usage Example

```tsx
import { CreativeNavbar } from "@/components/ui/creative-navbar";
import { CreativeHeader } from "@/components/ui/creative-header";
import { CreativePricing } from "@/components/ui/creative-pricing";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <CreativeNavbar />
      
      <CreativeHeader
        title="Meet.XLM"
        subtitle="Your subtitle"
        description="Your description"
        robotSceneUrl="https://prod.spline.design/YOUR_SCENE_URL"
      />

      <CreativePricing 
        tag="Pricing"
        title="Choose Your Plan"
        description="Get started today"
        tiers={yourTiersArray}
      />
    </div>
  );
}
```

---

## 🎯 Key Features

✅ **Fully Responsive** - Mobile-first design
✅ **Dark Mode Support** - All components support dark mode
✅ **Type-Safe** - Full TypeScript support
✅ **Accessible** - Semantic HTML and ARIA labels
✅ **Animated** - Smooth transitions and hover effects
✅ **Creative Style** - Unique handwritten, playful design
✅ **3D Interactive** - Spline 3D robot integration

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` to modify color schemes:
```js
colors: {
  primary: { ... },
  secondary: { ... },
}
```

### Change Fonts
Edit `tailwind.config.js`:
```js
fontFamily: {
  handwritten: ['Your Font', 'cursive'],
}
```

### Modify Shadow Effects
In components, change shadow values:
```tsx
shadow-[6px_6px_0px_0px] // Increase offset
shadow-[2px_2px_0px_0px] // Decrease offset
```

---

## 📱 Responsive Breakpoints

- **Mobile:** < 768px (md)
- **Tablet:** 768px - 1024px (md - lg)
- **Desktop:** > 1024px (lg)
- **Wide:** > 1280px (xl)

---

## 🔗 Links

- [Lucide Icons](https://lucide.dev/)
- [Spline 3D](https://spline.design/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ for Meet.XLM - Stellar Proof of Attendance Protocol

