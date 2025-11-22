#!/bin/bash

# Script para rodar o app no iPhone físico

echo "📱 Rodando Meet.XLM no iPhone..."
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script do diretório meet-app/"
    exit 1
fi

echo "Escolha uma opção:"
echo ""
echo "1) Expo Go (Recomendado para desenvolvimento rápido)"
echo "   - Instale o Expo Go no iPhone"
echo "   - Conecte Mac e iPhone na mesma WiFi"
echo "   - Escaneie o QR code"
echo ""
echo "2) Build direto no iPhone (USB)"
echo "   - Conecte o iPhone via USB"
echo "   - Instala o app diretamente no iPhone"
echo ""
read -p "Escolha (1 ou 2): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Iniciando Expo Go..."
        echo ""
        echo "📋 Instruções:"
        echo "   1. Instale o Expo Go no iPhone (App Store)"
        echo "   2. Certifique-se que Mac e iPhone estão na mesma WiFi"
        echo "   3. Escaneie o QR code que aparecerá"
        echo ""
        echo "💡 Dica: Se o QR code não funcionar, use a opção 'Enter URL manually' no Expo Go"
        echo ""
        read -p "Pressione Enter para continuar..."
        npm start
        ;;
    2)
        echo ""
        echo "🔨 Fazendo build e instalando no iPhone..."
        echo ""
        echo "📋 Certifique-se que:"
        echo "   - iPhone está conectado via USB"
        echo "   - Você confiou no computador no iPhone"
        echo "   - Xcode está configurado (veja README.md)"
        echo ""
        read -p "Pressione Enter para continuar..."
        
        # Verificar se o dispositivo está conectado
        if command -v xcrun &> /dev/null; then
            echo "🔍 Verificando dispositivos conectados..."
            xcrun devicectl list devices 2>/dev/null || echo "⚠️  Não foi possível listar dispositivos. Continuando..."
        fi
        
        echo ""
        echo "🚀 Iniciando build..."
        npx expo run:ios --device
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac


