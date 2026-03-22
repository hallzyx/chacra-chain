# User Flow — Register Sale

## Actors
- Farmer (authenticated end user)
- ChacraChain backend (custodial Hedera operator)

## Preconditions
- User has an active account and valid session token.
- Hedera operator credentials are configured on the server.
- HCS topic for sales is configured and reachable on testnet.

## Steps
1. The user signs in and lands on the authenticated app area.
2. The user opens **Register Sale** (`/register-sale`).
3. The form is shown with:
   - Farmer ID (pre-filled)
   - Crop variety
   - Quantity in kg
   - Unit price in PEN
   - Transaction date/time
4. The user submits the form.
5. Frontend validates required fields and sends `POST /api/sales`.
6. Backend validates session, resolves user wallet credentials, and submits the sale payload to HCS.
7. Backend returns transaction metadata (`transactionId`, consensus timestamp, optional HashScan URL).
8. Frontend renders success state and allows the user to register another sale.

## Expected Output
- Sale is persisted in app storage and linked to HCS metadata.
- User receives immediate on-screen confirmation.

## Error Paths
- Missing/invalid session token → redirect to `/login`.
- Missing HCS configuration → descriptive backend error.
- Hedera submission failure → user-friendly error state with retry option.

## Acceptance Criteria
- [x] Required inputs are validated before API submission.
- [x] Backend writes sale metadata and HCS transaction details.
- [x] Success state includes verifiable transaction reference.
- [x] Error state is visible and actionable.
- [x] Flow is responsive across mobile and desktop layouts.
