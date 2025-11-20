## Meet.XLM Landing (Next.js)

Landing page inspirada na experiência da POAP, mas focada em provas de presença na rede Stellar.

### Rodando localmente
```bash
npm install
npm run dev
# acesse http://localhost:3000
```

### Stack
- Next.js (app router) + TypeScript
- Tailwind CSS (config em `tailwind.config.js`, `postcss.config.js`, diretivas em `src/app/globals.css`)
- shadcn-style components em `components/ui` (ex.: `card.tsx`, `interactive-3d-robot.tsx`)
- Spline embed via `@splinetool/react-spline`
