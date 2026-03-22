# Environment Setup — Hedera Testnet

This document explains not only which `.env` values are required, but also **why each value exists** in the runtime model.

## 1) Required variables

Add the following values to `.env.local` (or Dokploy environment settings in production):

```bash
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_HCS_TOPIC_ID=0.0.xxxxx
APP_ENCRYPTION_KEY=a-long-random-string
```

## 2) What each value does

### `HEDERA_ACCOUNT_ID`
- **Role:** Platform operator Hedera account ID.
- **Used by:** `src/lib/hedera-server.ts` in `getServerHederaClient()`.
- **Why needed:** The operator account creates and funds each new user Hedera account during registration.
- **If missing:** Registration fails when attempting to create user wallets.

### `HEDERA_PRIVATE_KEY`
- **Role:** Private key for the platform operator account.
- **Used by:** same server client bootstrap as above.
- **Why needed:** Required to sign account creation/funding operations.
- **If missing:** Backend cannot perform Hedera administrative operations.

### `HEDERA_HCS_TOPIC_ID`
- **Role:** Destination HCS topic for sale submissions.
- **Used by:** `submitSaleToHcs()` in `src/lib/hedera-server.ts`.
- **Why needed:** Every sale message must be submitted to a concrete topic.
- **If missing:** `POST /api/sales` fails with configuration error.

### `APP_ENCRYPTION_KEY`
- **Role:** Secret used to derive encryption key material for wallet private keys.
- **Used by:** `encryptSensitiveValue()` / `decryptSensitiveValue()` in `src/lib/auth.ts`.
- **Why needed:** User private keys are stored encrypted at rest in `db.json`.
- **If missing:** Registration/signing flows that depend on key encryption/decryption fail.

## 3) Topic setup prerequisite (must run first)

Before real sale submissions, create an HCS topic once:

```bash
node scripts/create-topic.js
```

Then copy the generated topic ID into `HEDERA_HCS_TOPIC_ID`.

## 4) Custodial account model in this MVP

- The platform uses the operator account to provision user accounts.
- Each registered user gets a dedicated Hedera account and keypair.
- User sale submissions are signed using that user’s own Hedera account credentials (decrypted server-side).

This preserves user-level provenance while keeping onboarding friction low.

## 5) Security rules

- Keep all secrets server-side only.
- Never use `NEXT_PUBLIC_*` for private keys or encryption secrets.
- Never commit `.env.local`.
- Rotate compromised values immediately.

## 6) Runtime/deployment note

Because this MVP persists data to `db.json`, a writable filesystem is required.

- VPS + Dokploy: ✅ compatible
- Vercel serverless filesystem: ❌ read-only for writes (`EROFS`)
