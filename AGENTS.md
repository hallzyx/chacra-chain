# AGENTS.md — ChacraChain
> Project orchestration for ARZ Lite.
> Always read this first.

## Documentation Map

| File | Status |
|---|---|
| `product.md` | ✅ complete |
| `stack.md` | ✅ complete |
| `userflow_register_sale.md` | ✅ complete |
| `userflow_check_price.md` | ✅ complete |
| `userflow_view_my_sales.md` | ✅ complete |

## Loading Rules
- Before any task → read this AGENTS.md first.
- Before implementing a feature → read the matching `userflow_*.md` document.
- Before any technical decision → read `stack.md`.
- Before discussing product scope → read `product.md`.

## Demo Flow Summary
The judges will see:
1. Main dashboard with clear navigation for product actions
2. **Register Sale** flow (`/register-sale`) with on-chain confirmation
3. **Check Price** flow (`/check-price`) showing average market price
4. **My Sales** flow (`/my-sales`) with historical records and HashScan links
5. End-to-end usage on Hedera Testnet through HCS-backed records

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- `@hashgraph/sdk`

## Current Focus
Finalized MVP demo for immutable agricultural sale records and transparent price intelligence on Hedera HCS.

## Running Locally
```bash
npm run dev
```

## Active MCPs
| MCP | Reason | Usage |
|---|---|---|
| `Hedera_search_hedera` | Hedera technical docs | HCS queries and transaction references |

## Active Skills
| Skill | Reason | Usage |
|---|---|---|
| `nextjs-15` | Project uses Next.js App Router | Routing and page architecture |
| `tailwind-4` | Consistent UI styling | Components and visual system |
