# Judges Guide — ChacraChain Demo

## Demo Goal

Show a complete, auditable workflow where agricultural sales become immutable records on Hedera and can be used for transparent pricing insights.

## Suggested Demo Script (3–5 minutes)

1. **Landing + Context**
   - Open `/`
   - Explain the problem: trust and price asymmetry in agriculture.

2. **Authentication**
   - Register a new user at `/register` or sign in at `/login`.

3. **Register a Sale**
   - Navigate to `/register-sale`.
   - Submit a sale with quantity and unit price.
   - Show returned transaction details and HashScan link.

4. **Check Market Price**
   - Open `/check-price`.
   - Demonstrate default average calculation and optional filters.

5. **Review My Sales**
   - Open `/my-sales`.
   - Show historical entries and transaction verification links.

## What to Emphasize

- Hedera-backed immutability (HCS message submission)
- User-friendly UX (no external wallet required)
- Verifiability through external explorer (HashScan)
- Practical low-cost infrastructure fit for frequent agricultural records

## Technical Credibility Points

- Next.js App Router full-stack approach
- Server-side credential handling and encryption strategy
- Modular flow separation: auth, sales registration, price aggregation, history retrieval
- Per-user Hedera account provisioning at registration time
- User-level signed HCS submissions with public explorer verifiability

## If Asked About Production Readiness

- Current build is a hackathon MVP focused on workflow validation.
- Deployment is intentionally VPS + Dokploy for writable persistence with `db.json`.
- Persistence layer remains abstracted and can be migrated to managed DB/KV later.
- Security-sensitive data is handled server-side with encrypted key storage.

## Recommended Judge Navigation

1. Review architecture: `architecture.md`
2. Review API behavior: `api-reference.md`
3. Review Hedera runtime operations: `hedera-operations.md`
4. Review deployment rationale: `deployment.md`
