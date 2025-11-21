# Project Name  
**Meet.XLM**  

---

## 1. Problem Statement

- The Stellar ecosystem currently has **no native, lightweight way to verify or measure attendance** at events, workshops, meetups, AMAs, or community activities.  
- This creates a major problem for **event organizers, community leaders, projects, and even the Stellar Foundation**, who cannot measure engagement, track participation over time, or reward real involvement.  
- As Stellar continues to grow globally, **on-chain participation data becomes essential** for community health, grants, user retention, governance, and ecosystem expansion — but today everything is manual, fragmented, or simply untracked.

---

## 2. Target User and User Need

### Primary Users
- Event organizers in the Stellar ecosystem  
- Community leaders  
- Hackathon hosts  
- Projects running workshops or educational sessions  
- Ecosystem partners organizing local meetups  

### Core Pain Point
They have **no standardized way** to:
- verify attendance,  
- prove participation,  
- or reward engagement.

Everything relies on spreadsheets, manual check-ins, or social confirmations.

### Current Workarounds
- Google Forms / spreadsheets  
- Social media check-ins  
- Manual QR registration  
- Discord/Telegram confirmations  

None of these provide **verifiable, tamper-proof, on-chain proof of participation**.

---

## 3. Solution Overview

### 3.1 Main Idea

We are building a **Stellar-native proof-of-attendance protocol**: a simple tool that allows organizers to issue verifiable attendance badges (POAP-style tokens) to participants of events and community activities.  
Users scan a QR code or click a link to instantly claim a badge recorded on Stellar.

This creates a **verifiable on-chain engagement history** — enabling rewards, analytics, and reputation building across the ecosystem.

### 3.2 Why Stellar?

Stellar is ideal for this because:

- **Fast, low-cost transactions** enable mass issuance of badges.  
- **Soroban smart contracts** ensure transparent, trust-minimized minting.  
- **Wallets and on/off-ramps** streamline onboarding for users.  
- Stellar’s mission around **real-world utility and community growth** aligns directly with verifiable participation tools.  
- The network is simple, stable, and perfect for high-volume, low-friction actions like attendance.

We plan to use:
- Soroban smart contracts for badge minting and event registry  
- Stellar accounts for optional identity binding  
- QR/link claim flows  
- Integrations with existing Stellar wallets  

---

## 4. Core Features (Planned for the Hackathon)

- **Feature 1: Event Creation Tool**  
  Organizers can create an event and generate a claim link or QR code.

- **Feature 2: Stellar-Native Badge Minting**  
  Users scan a QR or click a link to mint a badge on Stellar.

- **Feature 3: Attendance Dashboard**  
  Organizers see real-time claims, participation numbers, and event stats.

- **Feature 4: Verification Endpoint**  
  An API to confirm whether a user attended a specific event (for rewards or gating).

- **Stretch Goal:**  
  **Participation Reputation Score** based on the number and variety of badges collected.

---

## 5. MVP Architecture (Initial Draft)

> This is a first draft and will evolve during the hackathon.

- **Frontend:** Next.js dashboard + mobile-friendly claim page  
- **Backend:** Node/TypeScript API for event creation, QR generation, and distribution  
- **Smart Contracts:** Soroban contract for badge minting and event registry  
- **Data/Storage:** Postgres for metadata, Horizon/Soroban for on-chain state  

**Basic Flow:**  
User → Claim Page (QR) → Backend/API → Soroban Contract → Badge Minted → Organizer Dashboard Updates

---

## 6. Success Criteria (Hackathon)

By the end of Stellar Hack+, our MVP is successful if:

- [ ] A user can scan a QR code and mint a badge on Stellar  
- [ ] An organizer can create an event and distribute a claim link/QR  
- [ ] The dashboard displays real-time attendance metrics  
- [ ] We can demo the full flow: create → claim → verify  

**Optional Stretch:**  
- [ ] A simple reputation score works for a test user

---

## 7. Team

- **Team Name:** Fountain (or Stellar Attendance Protocol — TBD)  
- **Members & Roles:**  
  - *Lucas Bispo de Oliveira — CEO and Blockchain Engineer*  
  - *João Rubens — CTO and Software Engineer*
  - *Jenny Tejedor — Designer and Project Manager*
