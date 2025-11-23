#!/bin/bash

# Script para testar as Supabase Functions
# Execute após configurar as variáveis de ambiente no dashboard

BASE_URL="https://fmyubhvjgjsnltlgpmkz.supabase.co/functions/v1"
WALLET_ADDRESS="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

echo "🧪 Testando Supabase Functions"
echo "================================"
echo ""

# Test 1: List Events
echo "1️⃣  Testando list-events (GET)..."
RESPONSE=$(curl -s -X GET "$BASE_URL/list-events" \
  -H "Content-Type: application/json")
echo "Response: $RESPONSE"
echo ""

# Test 2: List Events with wallet address
echo "2️⃣  Testando list-events com wallet address..."
RESPONSE=$(curl -s -X GET "$BASE_URL/list-events" \
  -H "Content-Type: application/json" \
  -H "x-wallet-address: $WALLET_ADDRESS")
echo "Response: $RESPONSE"
echo ""

# Test 3: Create Event
echo "3️⃣  Testando create-event (POST)..."
RESPONSE=$(curl -s -X POST "$BASE_URL/create-event" \
  -H "Content-Type: application/json" \
  -H "x-wallet-address: $WALLET_ADDRESS" \
  -d '{
    "title": "Stellar Hack+ Buenos Aires",
    "organizer": "Stellar Foundation",
    "organizerIcon": "🌟",
    "startTime": "2024-12-25T10:00:00Z",
    "location": "Buenos Aires, Argentina",
    "description": "Hackathon description...",
    "imageUrl": "https://example.com/image.jpg",
    "requiresXlm": true,
    "xlmMinimum": 10.5
  }')
echo "Response: $RESPONSE"
echo ""

# Extract event_id from response (if successful)
EVENT_ID=$(echo $RESPONSE | grep -o '"event_id":"[^"]*' | cut -d'"' -f4)

if [ -n "$EVENT_ID" ]; then
  echo "✅ Evento criado com ID: $EVENT_ID"
  echo ""
  
  # Test 4: Get Event
  echo "4️⃣  Testando get-event (GET)..."
  RESPONSE=$(curl -s -X GET "$BASE_URL/get-event?event_id=$EVENT_ID" \
    -H "Content-Type: application/json" \
    -H "x-wallet-address: $WALLET_ADDRESS")
  echo "Response: $RESPONSE"
  echo ""
  
  # Test 5: Register Attendance
  echo "5️⃣  Testando register-attendance (POST)..."
  RESPONSE=$(curl -s -X POST "$BASE_URL/register-attendance" \
    -H "Content-Type: application/json" \
    -H "x-wallet-address: $WALLET_ADDRESS" \
    -d "{\"event_id\": \"$EVENT_ID\"}")
  echo "Response: $RESPONSE"
  echo ""
  
  # Test 6: List User Events
  echo "6️⃣  Testando list-user-events (GET)..."
  RESPONSE=$(curl -s -X GET "$BASE_URL/list-user-events" \
    -H "Content-Type: application/json" \
    -H "x-wallet-address: $WALLET_ADDRESS")
  echo "Response: $RESPONSE"
  echo ""
else
  echo "⚠️  Não foi possível criar evento. Verifique se as variáveis de ambiente estão configuradas."
  echo ""
fi

# Test 7: List Events again (should show the created event)
echo "7️⃣  Testando list-events novamente (deve mostrar o evento criado)..."
RESPONSE=$(curl -s -X GET "$BASE_URL/list-events" \
  -H "Content-Type: application/json")
echo "Response: $RESPONSE"
echo ""

echo "✅ Testes concluídos!"
echo ""
echo "💡 Dica: Se você recebeu erros 500, verifique se configurou as variáveis de ambiente:"
echo "   - DB_URL"
echo "   - SERVICE_ROLE_KEY"
echo "   Veja ENV_SETUP.md para instruções detalhadas."

