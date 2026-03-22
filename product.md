# Product Specification — ChacraChain

## 1. Overview
- **Project Name:** ChacraChain
- **Sector:** AgriTech / Web3
- **Target Users:** Agricultural producers and cooperatives in Peru, initially focused on potato crop operations.
- **Problem Statement:** Agricultural producers face information asymmetry where intermediaries often control pricing. Farmers need trusted, immutable sales records and a verifiable source of average market prices.
- **Solution:** A lightweight decentralized application (DApp) MVP that provides immutable sale registration and transparent average price queries using low-cost DLT infrastructure.

## 2. Technical and Web3 Architecture
- **DLT Network:** Hedera Hashgraph
- **Core Service:** Hedera Consensus Service (HCS)
- **Why Hedera:** HCS provides fair ordering, consensus timestamps, and near-instant finality (typically 2–3 seconds) at very low message cost, making it practical for high-frequency agricultural transactions.
- **Web2.5 Onboarding Strategy:**
  - No wallet extension or seed phrase required for end users.
  - Traditional authentication flow (email/password in this MVP).
  - Custodial backend model: the platform manages Hedera account operations and transaction submission on behalf of users.

## 3. Core Features
1. **Immutable Sale Registration**  
   Each sale is submitted as a message to a dedicated HCS topic, generating an auditable and tamper-resistant transaction trail.

2. **Average Price Oracle**  
   The application computes average market prices using verified historical sales records.

3. **User Sales History**  
   Authenticated users can inspect their own sale timeline and verify transaction entries via HashScan.

## 4. Data Structure (HCS Payload Example)
Messages submitted to HCS follow a normalized JSON structure that is easy to index and consume from Mirror Node or backend storage.

```json
{
  "farmer_id": "AGR-1042",
  "crop_variety": "Papa Canchan",
  "quantity_kg": 5000,
  "unit_price_pen": 1.2,
  "transaction_date": "2026-03-17T19:11:23-05:00"
}
```

## 5. Business Model

ChacraChain is designed as a **B2G + B2B platform**, not a direct B2C product for low-income farmers.

### Positioning
- **Farmers should not pay** for access in the core model.
- The paying customers are institutions that benefit from verifiable market infrastructure.

### Revenue Channels
1. **Government and municipalities (B2G)**
   - Annual or multi-year licensing for local agricultural transparency programs.
   - ChacraChain is deployed as public digital infrastructure for farmers at zero direct cost.

2. **Cooperatives and producer associations (B2B)**
   - Subscription plans for traceable transaction history, audit exports, and negotiation evidence.
   - Helps cooperatives secure larger purchase contracts without dependency on opaque broker chains.

3. **Optional premium analytics modules (B2B/B2G add-ons)**
   - Advanced dashboards, crop-specific pricing indicators, and compliance reports.

### Why this model works
- Aligns incentives with entities that control budgets and policy outcomes.
- Protects farmer adoption by removing price barriers.
- Creates recurring institutional revenue while preserving public benefit.

## 6. Economic Predictability and Budget Planning

Hedera transaction and query fees are **denominated in USD** (and paid in HBAR). For HCS, fees are tied to network resource usage. This means fees are not a single universal flat number for all possible transactions, but they are highly predictable when the application keeps message structure and size stable.

### Why ChacraChain benefits from this
- ChacraChain submits sale records with a **consistent JSON schema**.
- Message complexity and byte-size range stay controlled.
- Per-record HCS costs remain predictable enough for institutional budgeting.

### Institutional impact
- **Government and municipalities:** easier annual budget estimation for farmer-facing digital transparency programs.
- **Cooperatives:** clearer operational cost forecasting for verifiable transaction pipelines.

This predictability is strategically important versus systems where transaction costs fluctuate heavily and are hard to model for public procurement.

### Illustrative cost model (for planning)

The table below is a **planning example** assuming a stable payload size and an average submit cost of **~$0.0001 per record**. Exact values can vary with network fee schedule updates and final payload size, so this should be recalibrated periodically.

| Records submitted | Illustrative cost per record (USD) | Illustrative total cost (USD) |
|---:|---:|---:|
| 1,000 | 0.0001 | 0.10 |
| 10,000 | 0.0001 | 1.00 |
| 100,000 | 0.0001 | 10.00 |

**Formula used:** `Estimated Total USD = Number of Records × Estimated USD per Record`

For procurement and cooperative planning, this provides a transparent baseline that is easier to budget than highly volatile fee models.

## 7. Stakeholder Value

### Farmers
- Free access to verifiable sale history.
- Reduced information asymmetry during negotiations.
- Better inclusion in formal procurement chains.

### Municipalities / Regional Governments
- Transparent and auditable agricultural operations.
- Better policy visibility on local production and transaction behavior.
- Stronger anti-fraud and anti-manipulation posture.

### Cooperatives
- Shared, tamper-resistant sales records across members.
- Negotiation leverage for larger volume contracts.
- Lower broker dependency and improved trust with buyers.

## 8. Product Roadmap

### Phase 1 — MVP Validation (Current)
- Immutable sale registration on Hedera HCS
- Price average query from recorded data
- User history with transaction verification links

### Phase 2 — Institutional Pilots
- Pilot deployments with selected municipalities and cooperatives
- Operational dashboards for local administrators
- Basic reporting exports (CSV/PDF) for oversight

### Phase 3 — Cooperative Operations Layer
- Multi-user cooperative workspaces
- Role-based permissions and approval workflows
- Batch transaction ingestion for high-volume periods

### Phase 4 — Market Intelligence and Integrations
- Region-level price trend intelligence
- API integrations with procurement or agricultural systems
- Cross-organization benchmarking and anomaly detection

### Phase 5 — Production Hardening
- Managed persistence and backup automation
- High-availability deployment strategy
- Compliance and governance controls for public-sector procurement

## 9. Success Metrics

- Number of active institutional contracts (municipal/government/cooperative)
- Number of active farmers using institution-sponsored access
- Monthly on-chain sale records submitted to HCS
- Reduction in transaction disputes in participating programs
- Increase in direct cooperative-to-buyer contract volume
