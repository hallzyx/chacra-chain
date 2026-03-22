# Stack — ChacraChain

## Technical Decisions
- **Language:** TypeScript
- **Framework:** Next.js App Router
- **Styling:** Tailwind CSS
- **Blockchain SDK:** `@hashgraph/sdk` (HCS-focused)
- **Authentication:** Email/password with session token
- **Backend Layer:** Next.js Route Handlers (`/api/*`)
- **Persistence for local development:** `db.json`
- **Transport:** REST between frontend and Route Handlers
- **Deployment target:** Vercel

## Agent Skills
| Skill | Reason | Usage |
|---|---|---|
| `nextjs-15` | Next.js App Router conventions | Routing and server architecture |
| `tailwind-4` | Tailwind styling patterns | Components and responsive UI |
| `react-19` | Modern React patterns | Frontend components |

## Active MCPs
| MCP | Reason | Usage |
|---|---|---|
| `Hedera_search_hedera` | Hedera protocol documentation | HCS and transaction-level references |

## Folder Structure
```txt
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Authentication
│   ├── register/             # Account registration
│   └── (app)/
│       ├── dashboard/        # Authenticated dashboard
│       ├── register-sale/    # Sale registration flow
│       ├── check-price/      # Price query flow
│       └── my-sales/         # User sales history
├── lib/
│   ├── auth.ts               # Auth, session, crypto helpers
│   ├── db.ts                 # Local data access abstraction
│   └── hedera-server.ts      # Server-side Hedera operations
└── types/                    # Shared TypeScript types
```

## Environment Variables
| Variable | Purpose |
|---|---|
| `HEDERA_ACCOUNT_ID` | Hedera operator account ID |
| `HEDERA_PRIVATE_KEY` | Hedera operator private key |
| `HEDERA_HCS_TOPIC_ID` | HCS topic ID used for sale messages |
| `APP_ENCRYPTION_KEY` | Encryption key for sensitive wallet data |

## Commands
- `npm run dev` — start local development
- `npm run build` — production build validation
- `npm run lint` — static checks

## MVP Scope (Implemented)
- ✅ Immutable agricultural sale registration through HCS
- ✅ Price average query from historical records
- ✅ Authenticated user dashboard and profile context
- ✅ User-specific sales history with HashScan verification links
- ✅ Custodial backend signing flow for Hedera interactions

## Out of Scope (Current MVP)
- 🔲 Non-custodial wallet UX
- 🔲 Advanced cooperative or inventory modules
- 🔲 Multi-crop optimization model (beyond current baseline)
- 🔲 Production-grade external database integration
- 🔲 Mainnet rollout with hardened operational infrastructure
