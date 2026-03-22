# ChacraChain

ChacraChain is a Next.js + Hedera MVP focused on agricultural sale traceability and transparent market intelligence. It allows users to register sales immutably through Hedera Consensus Service (HCS), query average prices, and review a verifiable personal sales history.

## Core Value

- Immutable sale records on Hedera testnet
- Auditable transaction links via HashScan
- Fast UX with traditional sign-in (no wallet extension required)
- Custodial backend transaction handling for low-friction onboarding

## Main App Routes

- `/` — landing page
- `/login` — sign in
- `/register` — account creation
- `/dashboard` — authenticated overview
- `/register-sale` — create a sale and submit to HCS
- `/check-price` — compute and display average prices
- `/my-sales` — user sales history with verification links

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- `@hashgraph/sdk`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Required Environment Variables

Create `.env.local` in the project root.

```bash
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_HCS_TOPIC_ID=0.0.xxxxx
APP_ENCRYPTION_KEY=a-long-random-string
```

> Important: Never expose private keys with `NEXT_PUBLIC_*` variables.

## Data Layer Notes

This project currently uses `db.json` through `src/lib/db.ts` for local development and demo persistence.

- Works locally where filesystem writes are allowed.
- Vercel serverless runtime is read-only for this use case (`EROFS` on `db.json` writes).

### Deployment decision for this version

This MVP is deployed on **VPS + Dokploy** to keep writable persistence and preserve current architecture behavior.

- See [deployment.md](./deployment.md) for full operational setup.
- See [architecture.md](./architecture.md) for rationale and tradeoffs.

## Build and Validation

```bash
npm run lint
npm run build
```

## Project Documentation

- [architecture.md](./architecture.md) — system architecture and component interactions
- [api-reference.md](./api-reference.md) — API endpoints, payloads, and response contracts
- [hedera-operations.md](./hedera-operations.md) — topic setup, account provisioning, and signing flow
- [deployment.md](./deployment.md) — deployment guidance and platform constraints
- [judges-guide.md](./judges-guide.md) — concise hackathon presentation script for judges
- [product.md](./product.md) — product definition and scope
- [stack.md](./stack.md) — technical stack and implementation boundaries
- [userflow_register_sale.md](./userflow_register_sale.md) — register sale flow
- [userflow_check_price.md](./userflow_check_price.md) — check price flow
- [userflow_view_my_sales.md](./userflow_view_my_sales.md) — sales history flow
- [ENV_SETUP.md](./ENV_SETUP.md) — environment variable setup
- [AGENTS.md](./AGENTS.md) — project orchestration instructions

## Quick Judge Path (Suggested)

If you are evaluating the project in limited time, follow this order:

1. [judges-guide.md](./judges-guide.md)
2. [product.md](./product.md)
3. [architecture.md](./architecture.md)
4. [hedera-operations.md](./hedera-operations.md)
5. [deployment.md](./deployment.md)
