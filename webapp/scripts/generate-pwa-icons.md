# Gerar Ícones PWA

Os ícones PWA precisam ser arquivos PNG. Você pode:

## Opção 1: Usar um Gerador Online

1. Acesse: https://realfavicongenerator.net/ ou https://www.pwabuilder.com/imageGenerator
2. Faça upload do arquivo `public/pwa-icon.svg`
3. Gere os ícones nos tamanhos:
   - 192x192 pixels (pwa-192x192.png)
   - 512x512 pixels (pwa-512x512.png)
4. Baixe e coloque na pasta `public/`

## Opção 2: Usar ImageMagick (se instalado)

```bash
# Converter SVG para PNG
convert -background none -resize 192x192 public/pwa-icon.svg public/pwa-192x192.png
convert -background none -resize 512x512 public/pwa-icon.svg public/pwa-512x512.png
```

## Opção 3: Usar um Editor de Imagens

1. Abra o `public/pwa-icon.svg` em um editor (Figma, Illustrator, etc)
2. Exporte como PNG nos tamanhos:
   - 192x192 pixels
   - 512x512 pixels
3. Salve na pasta `public/` com os nomes corretos

## Opção 4: Criar Manualmente

Crie ícones simples com:
- Fundo: #F5F1E8
- Texto/Logo: #18181B
- Tamanhos: 192x192 e 512x512 pixels
- Formato: PNG com transparência

