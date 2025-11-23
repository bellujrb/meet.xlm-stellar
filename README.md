# Meet.XLM

- [App](https://meetxlm.vercel.app/)
- [Demo Video](https://drive.google.com/drive/folders/1ZR2s52V_wsZLrvpZ4GjL07B17yFMNi-v?usp=sharing)
- [Pitch Deck](https://goo.su/hcgMDd)
- [Smart Contract Explorer](https://stellar.expert/explorer/testnet/contract/CCBMKHFNQNZGDO7UYWURJ3GE3TK566QCW7QXFP46JYX4IUVVDWLQNF57)
- [API Documentation](.)

---
## 💰 The Hidden Problem

**≈$100,000 USD** — Stellar distributed $100,000 at Meridian alone.  
And has distributed **over $30M USD** in grants.

But behind this number exists a **blind spot**:

**There is no native, private, and anti-sybil way to prove real participation in XLM-funded events.**

Without this, blockchain doesn't touch the real world.

---

## 🔴 How It Works Today

Today, reporting and metrics for community events and grants are:
- ❌ **Manual**
- ❌ **Opaque**  
- ❌ **Inconsistent**

Result: **Stellar is growing in the dark** — no verifiable engagement data.

---

## ✅ The Solution

**Meet.XLM** is a native, private, and anti-sybil protocol based on **ZK-UltraHonk** and **Soroban**.

Transform event participation into **verifiable on-chain reputation** using:
- 🔐 **Zero-Knowledge Proofs** (ZK-proofs)
- ⚡ **Soroban Smart Contracts**
- 🎮 **Dynamic NFT Badges**

---

## 🎯 How It Works

```
1. HOST logs into the app
   ↓
2. Creates an event
   ↓
3. Sets minimum XLM requirement (e.g., ≥100 XLM)
   ↓
4. Shares event link with community
   ↓
5. ATTENDEE selects event
   ↓
6. Generates ZK-proof (client-side) proving balance WITHOUT revealing wallet
   ↓
7. Proof verified on-chain via Soroban → Access granted
   ↓
8. At check-in → Receives NFT badge with rarity (Common/Rare/Epic)
   ↓
9. Social game: Scan others to reveal their NFTs
```

**Result:** Verifiable, private, fraud-proof event participation.

---

## 🏗️ Architecture

```
┌─────────────┐
│  ORGANIZER  │ ──► Create Event ──► ┌──────────┐
└─────────────┘                       │ Backend  │
                                      │  API     │ ──► Verify ZK ──► ┌──────────┐
┌─────────────┐                       └──────────┘                   │ Soroban  │
│  ATTENDEE   │ ──► Generate ZK ───────────────────────────────────► │ Contract │
└─────────────┘     Proof (Client)                                   └──────────┘
                                                                            │
                                                                            ▼
                                                                      Mint NFT
```

### Core Components

**1. ZK-Proof System (Privacy)**
- Proves "has ≥X XLM" without exposing wallet or exact balance
- Generated **client-side** (no server trust needed)
- Uses **Noir circuits** compiled to WASM

**2. Soroban Smart Contract**
```rust
create_event(host, min_xlm, max_attendees, rarity_config)
mint_veiled_nft(attendee, event_id) 
reveal_nft(nft_id, rarity_seed)
cross_reveal(revealer, target_nft)
```

**3. Dynamic NFT Badges**
- **Veiled** before check-in
- **Revealed** with rarity at event
- **Cross-Reveal**: Social game to reveal others' NFTs

---

## 🚀 Why Stellar?

| Metric | Meet.XLM (Stellar) | POAP (Ethereum) |
|--------|---------------------|-----------------|
| **Cost per NFT** | $0.00001 | $5-20 |
| **Mint Time** | 5-8s | 30-60s |
| **Privacy** | ZK-proofs | Address exposed |
| **Payment** | USDC native | External |

**Example:** Event with 200 participants  
- Stellar: **$0.002 total**  
- Ethereum: **$2,000 total**

---

## 📊 Go-to-Market (LATAM Focus)

Our GTM strategy targets **LATAM Stellar ecosystem** in partnership with chapters and ambassador leaders:

✅ **Event Management** → Real-time dashboards, check-ins, metrics  
✅ **Engagement & Gamification** → NFT rewards, leaderboards, social games  
✅ **Privacy by Design** → ZK-proofs protect user data

**Pilot Partners:**
- Stellar LATAM Ambassadors
- Blockchain Acceleration Foundation (BAF)
- University chapters (Brazil, Argentina, Colombia)

---

## 🗺️ Roadmap

### **Q4 2025: Pilot**
- Launch with LATAM community leaders
- Feedback iteration and continuous improvement
- 30+ events milestone

### **Q1 2026: Grant Funding**
- Apply for Stellar Community Fund grant
- Advance technical development (ZK circuits, analytics)
- Partnership MOU with Stellar Foundation

### **Q2 2026: DAO & Public Good**
- Token launch (governance + utility)
- Transform into sustainable Digital Public Good
- White-label solution for ecosystem partners

### **Technical Evolution:**

**V0:** Generate and verify ZK-proofs using Soroban ✅  
**V1:** Dashboard for event management, check-ins, engagement metrics  
**V2:** Expand to prove ownership of ANY Stellar token (crucial for ambassadors)  
**V3:** Mint private NFTs via NFC proximity for gamified in-person engagement tracking

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18.x
Rust >= 1.70
Stellar CLI (soroban-cli)
```

### Installation
```bash
git clone https://github.com/bellujrb/meet.xlm-stellar.git
cd meet.xlm-stellar

# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run dev

# Soroban Contract
cd contracts && cargo build --target wasm32-unknown-unknown --release
```

---

## 👥 Dream Team

Our team has **5+ years of experience** in blockchain engineering and web3 infrastructure.  
Active engagement with **10+ web3 communities** and universities in the Brazil/LATAM ecosystem.

**Lucas Bispo de Oliveira** — CEO & Blockchain Engineer  
- [GitHub](https://github.com/bellujrb)

**João Rubens** — CTO & Software Engineer  
- 5+ years full-stack engineering
- Expert in distributed systems

**Jenny Tejedor** — Chief of Growth & Community  
- LATAM ecosystem connector
- 6+ years community management


---

## 🏆 Built for Stellar Hack+ Buenos Aires 2025

Special thanks to:
- Stellar Development Foundation (SDF)
- Blockchain Acceleration Foundation (BAF)
- The Stellar community in LATAM
-----


**Built with ❤️ for team meet.xlm**
