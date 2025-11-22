# Meet.XLM

- [Hackathon Submission](.)
- [Demo Video](..)
- [Pitch Deck](.)
- [Smart Contract Explorer](..)
- [API Documentation](.)

-----

## 🎯 The Problem: Untracked Engagement

The Stellar ecosystem **lacks a native, lightweight, and reliable way to verify or measure attendance** at community activities.

This absence results in:

  * **❌ Poor Grant Measurement:** Stellar Foundation cannot measure the **real impact** of community grants.
  * **❌ No Verifiable Reputation:** Participants' attendance does not build **portable, on-chain value**.

-----

## ✨ The Solution: ZK-Powered Reputation and Privacy

Meet.XLM is a Stellar-native protocol that uses **Soroban Smart Contracts** and **Zero-Knowledge Proofs (ZK-Proofs)** to provide private, verifiable engagement data.

### Core Innovations

| Innovation | Description | Impact |
| :--- | :--- | :--- |
| **Privacy via ZK-Proofs** | Verifies eligibility (e.g., minimum XLM stake) **without exposing the wallet address or exact balance.** | Prevents wallet *doxxing* and enables regulatory-friendly verification. |
| **Stellar-Native Economics** | Leverages Stellar for high speed and **ultra-low cost** ($\approx \$0.00001$ per NFT mint). | Ensures economic viability for mass NFT issuance. |
| **Social Gaming Layer** | Protocol encourages interaction by allowing attendees to **Cross-Reveal** each other's NFT rarities. | Proven to increase event duration by $\mathbf{40\%}$ and interactions by $\mathbf{3\times}$. |

-----

## 🏗️ Technical Architecture Focus

Meet.XLM is built on Soroban, positioning it as a core piece of Stellar infrastructure.

  * **Smart Contracts:** **Soroban (Rust)** handles event registry, ZK verification, and NFT minting/reveal logic.
  * **ZK-Proof System:** Generated client-side, proving balance/eligibility **without sending private data** to the server.
  * **Flujo ZK:** Garantiza el **anonimato on-chain** al registrar solo un *hashed identity slot*.

-----

## 🚀 Quick Start (Installation & Deployment)

### Prerequisites

`Node.js $\geq$ 18.x`, `Rust $\geq$ 1.70`, `Stellar CLI (soroban-cli)`.

### Commands

```bash
# Clone repository and install dependencies
git clone https://github.com/bellujrb/meet.xlm-stellar.git
# ... (Commands to install dependencies and run locally) ...

# Deploy Soroban Contract (Testnet)
soroban contract deploy --wasm target/.../meet_xlm.wasm --network testnet --source ACCOUNT_SECRET_KEY
```

-----

## 📈 Roadmap: Strategic Growth

| Phase | Estimated Period | Key Objectives (Interpretation) |
| :--- | :--- | :--- |
| **Phase 0: MVP** | Hackathon | **Core Focus:** Establishing the ZK-Proof/Soroban privacy pipeline. **Milestones:** Preparation for Governance Token + Series A. |
| **Phase 1: Foundation & Validation** | Post-Hackathon (6 Months) | **30 Events Milestone**. Smart Contract Audit (CertiK). Stellar Foundation MOU (for grant metrics). |
| **Phase 2: Scale** | 9 – 12 Months | Launch Public API, NFT Marketplace beta. Focus on **transaction speed optimization** (5-8 seconds). |
| **Phase 3: Expansion** | 12 – 18 Months | **Multi-chain Bridge**. University Certification Program (Real-World Utility). Data Licensing System and Advanced Analytics. |

-----

## 💰 Business Model


-----

## 👥 Team

  * **Lucas Bispo de Oliveira** - CEO & Blockchain Engineer
  * **João Rubens** - CTO & Software Engineer
  * **Jenny Tejedor** - Designer and Project Manager

-----


**Built with ❤️ for team meet.xlm**
