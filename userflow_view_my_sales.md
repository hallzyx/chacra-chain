# User Flow — View My Sales

## Actors
- Farmer (authenticated end user)
- ChacraChain backend (session validation + data retrieval)

## Preconditions
- User has a valid session token.
- User may have zero or more registered sales.

## Steps
1. User navigates to **My Sales** (`/my-sales`).
2. Frontend checks local session state and requests `GET /api/user/sales`.
3. Backend validates auth token and returns user-scoped sales with HCS metadata.
4. Frontend renders:
   - Total sales count
   - Total volume (kg)
   - Sale cards with quantity, unit price, timestamps, and HashScan links
5. User can open HashScan links for transaction-level verification.
6. If there are no records, user gets a clear CTA to `/register-sale`.

## Expected Output
- User can audit personal sales history and verify provenance externally.

## Error Paths
- Invalid token → redirect to `/login`.
- API failure → error panel with retry guidance.

## Acceptance Criteria
- [x] Route is protected for authenticated users.
- [x] Data is user-scoped and excludes other users’ records.
- [x] HashScan links are generated from transaction IDs.
- [x] Empty state includes a valid route to the register-sale flow.
- [x] UI remains usable and responsive on mobile and desktop.
