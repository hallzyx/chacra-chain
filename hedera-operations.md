# Hedera Operations — Setup and Runtime

This guide explains the exact Hedera operational flow used by ChacraChain.

## 1) One-time setup sequence

1. Configure operator env values:
   - `HEDERA_ACCOUNT_ID`
   - `HEDERA_PRIVATE_KEY`
2. Create HCS topic:

```bash
node scripts/create-topic.js
```

3. Copy resulting topic ID to:
   - `HEDERA_HCS_TOPIC_ID`
4. Restart app runtime.

## 2) Registration-time account provisioning

During `POST /api/auth/register`:

1. Backend calls `createHederaTestnetAccount()`.
2. A new ED25519 keypair is generated.
3. Operator account creates the new Hedera account.
4. New account receives initial balance (`5 HBAR` in current implementation).
5. Private key is encrypted and persisted.

## 3) Sale-time signing and submission

During `POST /api/sales`:

1. Backend validates session token.
2. Backend decrypts user wallet private key.
3. Backend builds a Hedera client for that user account.
4. Sale payload is submitted to configured HCS topic.
5. Transaction metadata is returned and stored locally.

## 4) Verification path

- Each HCS submission returns a transaction ID.
- Frontend builds a HashScan testnet URL for direct external validation.
- Judges can verify that the transaction exists independently of app UI.

## 5) Why this model is strong for hackathons

- Fast onboarding (no external wallet setup).
- Real on-chain operations with user-level signatures.
- Clear and auditable traceability from app event to public explorer.
