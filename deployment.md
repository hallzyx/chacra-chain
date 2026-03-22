# Deployment Guide — ChacraChain

## Preferred Demo Hosting

For this MVP, the recommended production-like deployment is **VPS + Dokploy**.

## Why VPS + Dokploy (and not Vercel for this version)

- The app currently persists runtime state in `db.json` (`src/lib/db.ts`).
- This requires filesystem write access.
- Vercel serverless mounts app files as read-only at runtime, which causes:
  - `EROFS: read-only file system, open '/var/task/db.json'`

Because of this, Dokploy on a VPS is the correct operational fit for the current architecture.

## 1) VPS + Dokploy setup

1. Provision a VPS with Docker runtime available.
2. Install and configure Dokploy.
3. Connect the repository in Dokploy.
4. Configure environment variables in Dokploy:
   - `HEDERA_ACCOUNT_ID`
   - `HEDERA_PRIVATE_KEY`
   - `HEDERA_HCS_TOPIC_ID`
   - `APP_ENCRYPTION_KEY`
5. Ensure persistent app storage (project volume / bind mount) so `db.json` remains writable and durable.
6. Deploy using standard Next.js production commands:
   - build: `npm run build`
   - start: `npm run start`

## 2) First-time Hedera bootstrap (mandatory)

Before using sale registration in a fresh environment:

1. Set operator credentials (`HEDERA_ACCOUNT_ID`, `HEDERA_PRIVATE_KEY`).
2. Run:

```bash
node scripts/create-topic.js
```

3. Copy the generated topic ID to `HEDERA_HCS_TOPIC_ID`.
4. Restart/redeploy the app so runtime picks up the new env value.

## 3) Validation checklist

- Build succeeds (`npm run build`)
- Auth routes work (`/register`, `/login`)
- Sale registration flow returns HCS metadata
- Price query endpoint responds correctly
- My Sales displays records and HashScan links

## 4) Operational constraints

Current persistence uses `db.json`.

- If the app process lacks write permissions on VPS volume, auth/sales flows fail.
- Backup strategy is required for `db.json` in longer-lived environments.

## 5) Minimal future migration recommendation

1. Keep `src/lib/db.ts` as the abstraction boundary.
2. Replace file I/O implementation with external storage client.
3. Preserve `readDb()` / `writeDb()` signatures for minimal refactor impact.

## 6) Demo reliability tips

- Deploy and smoke-test right before the presentation.
- Keep one fallback account pre-registered.
- Validate Hedera topic configuration and operator balance.
- Avoid changing environment variables during demo runtime.
