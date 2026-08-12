# 🏠 HomeDirect

> **Rent without the middleman.** A transparent, blockchain-powered rental marketplace for Nigeria and Africa — built on Stellar.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built on Stellar](https://img.shields.io/badge/Blockchain-Stellar%20%2F%20Soroban-0F5132)](https://stellar.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Open Issues](https://img.shields.io/github/issues/homedirect-africa/homedirect)](https://github.com/homedirect-africa/homedirect/issues)

---

## The Problem

Renting a home in Nigeria is a gauntlet of fees:

| Fee | Typical cost |
|-----|-------------|
| Agent commission | 10–15% of annual rent |
| Legal / agreement fee | ₦20,000 – ₦100,000+ |
| Caution deposit | 1–3 months rent (held informally) |
| Inspection fees | ₦2,000 – ₦10,000 per visit |

Agents inflate rents, hold deposits informally, and control access to information that should be freely available. Tenants — especially young Nigerians relocating for work — bear all of this cost with zero transparency.

## The Solution

HomeDirect is a direct landlord-to-tenant rental platform:

- ✅ **No agent in the chain** — landlords list directly, tenants apply directly
- ✅ **One flat 5% service fee** — paid by tenant at lease signing, replaces all middlemen
- ✅ **Smart contract leases** — encoded on Stellar, tamper-proof and legally referenceable
- ✅ **Escrow deposits** — security deposits locked in Soroban smart contracts, not held by anyone
- ✅ **NGN + USDC payments** — pay in naira or dollar-pegged stablecoin via Stellar

**Phase 1 cities:** Lagos · Abuja · Ibadan (Oyo) · Port Harcourt (Rivers) · Anambra  
**Vision:** Expand across Africa — Ghana, Kenya, South Africa and beyond

---

## Repo Structure

```
homedirect/
├── frontend/               # Next.js 14 + TypeScript + Tailwind CSS
│   ├── app/
│   │   ├── components/     # UI components (WalletConnect, etc.)
│   │   ├── dashboard/     # Landlord and tenant dashboards
│   │   │   ├── landlord/  # Property listing management
│   │   │   └── tenant/    # Application and lease management
│   │   └── page.tsx       # Homepage
│   ├── hooks/              # React hooks (useStellarWallet)
│   ├── lib/
│   │   └── stellar/       # Stellar wallet integration
│   └── Dockerfile
│
├── contracts/              # Stellar Soroban smart contracts (Rust)
│   ├── homedirect_lease/   # Lease creation, rent payments, disputes
│   │   ├── src/
│   │   │   ├── lib.rs      # Contract interface
│   │   │   ├── logic.rs    # Business logic
│   │   │   ├── storage.rs  # Storage operations
│   │   │   ├── types.rs    # Type definitions
│   │   │   └── test.rs     # Unit tests
│   │   └── Cargo.toml
│   └── homedirect_escrow/  # Security deposit escrow logic
│       ├── src/
│       │   ├── lib.rs
│       │   ├── logic.rs
│       │   ├── storage.rs
│       │   ├── types.rs
│       │   └── test.rs
│       └── Cargo.toml
│
├── relayer/                # Node.js backend / Stellar relayer
│   ├── src/
│   │   ├── routes/         # Express API routes
│   │   │   ├── lease.ts    # Lease endpoints
│   │   │   ├── property.ts # Property endpoints
│   │   │   ├── user.ts     # User endpoints
│   │   │   ├── payments.ts # Paystack integration
│   │   │   ├── kyc.ts      # Dojah KYC endpoints
│   │   │   └── webhook.ts  # Webhook handlers
│   │   ├── services/
│   │   │   ├── stellar.ts  # Stellar SDK integration
│   │   │   ├── paystack.ts # Paystack service
│   │   │   └── dojah.ts    # Dojah KYC service
│   │   ├── database/
│   │   │   ├── schema.sql  # PostgreSQL schema
│   │   │   └── models.ts   # TypeScript models
│   │   └── index.ts        # Express app entry
│   ├── docs/
│   │   └── openapi.yaml    # API documentation
│   ├── Dockerfile
│   └── package.json
│
├── scripts/                # Deployment and utility scripts
│   └── deploy.sh           # Docker deployment script
│
├── docker-compose.yml      # Multi-container orchestration
├── .env.example           # Environment variables template
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- Rust + `cargo` (for smart contracts)
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli) (`cargo install stellar-cli`)

### 1. Clone the repo

```bash
git clone https://github.com/homedirect-africa/homedirect.git
cd homedirect
```

### 2. Run the frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### 3. Run the relayer

```bash
cd relayer
npm install
cp .env.example .env       # fill in your Stellar keys
npm run dev
# → http://localhost:3001
```

### 4. Build smart contracts

```bash
cd contracts/homedirect_lease
stellar contract build
# output → target/wasm32-unknown-unknown/release/homedirect_lease.wasm
```

### 5. Deploy to Stellar Testnet

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/homedirect_lease.wasm \
  --source YOUR_SECRET_KEY \
  --network testnet
```

### 6. Deploy with Docker (Recommended)

```bash
# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Deploy all services
./scripts/deploy.sh

# Or manually with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_RELAYER_URL=http://localhost:3001
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_LEASE_CONTRACT_ID=CXXXXXXXXXXXXXXXX
```

### Relayer (`relayer/.env`)
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
LEASE_CONTRACT_ID=CXXXXXXXXXXXXXXXX
PLATFORM_SECRET_KEY=SXXXXXXXXXXXXXXXXXXXXXXXX
PAYSTACK_SECRET_KEY=sk_test_XXXXXXXX
DOJAH_API_KEY=XXXXXXXX
```

---

## Smart Contracts

Both contracts are written in Rust targeting Soroban (Stellar's smart contract platform).

### `homedirect_lease`
Manages the full lifecycle of a rental agreement:
- `create_lease` — creates lease, collects 5% fee + escrow deposit
- `pay_rent` — monthly rent transfer landlord → tenant
- `release_deposit` — returns deposit to tenant after successful tenancy
- `raise_dispute` — flags lease for arbitration
- `resolve_dispute` — admin releases deposit to winning party
- `collect_platform_fee` — collects 5% platform fee on total rent
- `set_token_config` — configures USDC token and platform wallet addresses

### `homedirect_escrow`
Standalone escrow for multi-property landlords and batch deposit management:
- `lock_deposit` — locks security deposit in escrow
- `release_deposit` — releases full deposit to tenant
- `partial_release` — releases partial deposit amount
- `confiscate_deposit` — confiscates deposit to landlord (dispute resolution)
- `set_admin` — updates contract admin address

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Freighter Wallet |
| Smart Contracts | Rust, Soroban SDK (Stellar) |
| Relayer / Backend | Node.js, Express, TypeScript |
| Payments (NGN) | Paystack |
| Blockchain | Stellar Network + Soroban |
| Stablecoin | USDC on Stellar |
| KYC | Dojah (NIN / BVN verification) |
| Database | PostgreSQL |
| Deployment | Docker, Docker Compose |

---

## Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| Phase 0 | Foundation, Stellar integration, KYC, Paystack | 🔨 In progress |
| Phase 1 | MVP web app — listings, applications, smart contract lease | 🔨 In progress |
| Phase 1.5 | Closed beta (Lagos & Abuja) | ⏳ Planned |
| Phase 2 | Full Nigeria launch — all 5 cities | ⏳ Planned |
| Phase 3 | Mobile app (React Native) | ⏳ Planned |
| Phase 4 | Africa expansion — Ghana, Kenya, South Africa | ⏳ Planned |

---

## Contributing

We welcome contributions of all kinds — code, design, documentation, testing, or just filing a great bug report.

📖 Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

### Good first issues

Look for issues tagged [`good first issue`](https://github.com/homedirect-africa/homedirect/labels/good%20first%20issue) — these are small, well-defined tasks great for getting familiar with the codebase.

### Areas that need the most help

- 🦀 Soroban smart contract tests (`contracts/`)
- 🎨 UI components and accessibility (`frontend/app/components/`)
- 🔌 KYC and Paystack integration (`relayer/src/services/`)
- 📱 Mobile-first responsive improvements
- 🌍 Localization for other African markets

---

## Community

- **GitHub Discussions** — questions, ideas, RFCs
- **Issues** — bug reports and feature requests
- **Twitter / X** — [@HomeDirectAfrica](https://twitter.com/homedirectafrica) *(coming soon)*

---

## License

MIT © HomeDirect Africa Contributors

---

<p align="center">
  Built with ❤️ for Nigeria and Africa · Powered by <a href="https://stellar.org">Stellar</a>
</p>