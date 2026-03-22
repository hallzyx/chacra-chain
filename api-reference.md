# API Reference — ChacraChain

## Auth

### `POST /api/auth/register`
Creates a user account and returns a session token.

**Request body**
```json
{
  "email": "farmer@example.com",
  "password": "your-secure-password"
}
```

**Success response (200/201)**
```json
{
  "token": "...",
  "user": {
    "agricultorId": "AGR-1234",
    "email": "farmer@example.com"
  },
  "wallet": {
    "hederaAccountId": "0.0.xxxxx",
    "publicKey": "..."
  }
}
```

### `POST /api/auth/login`
Authenticates an existing user.

**Request body**
```json
{
  "email": "farmer@example.com",
  "password": "your-secure-password"
}
```

**Success response**
Same shape as register response.

---

## Sales

### `POST /api/sales`
Registers a new sale and submits payload to HCS.

**Headers**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request body**
```json
{
  "variedadCultivo": "Papa Canchan",
  "cantidadKg": 5000,
  "precioUnitarioPen": 1.2,
  "fechaTransaccion": "2026-03-17T19:11:23-05:00"
}
```

**Success response**
```json
{
  "sale": {
    "id": "..."
  },
  "hcs": {
    "transactionId": "...",
    "consensusTimestamp": "..."
  },
  "hashscanUrl": "https://hashscan.io/testnet/transaction/..."
}
```

### `GET /api/sales`
Returns aggregated price metrics using optional filters.

**Query params (optional)**
- `variedadCultivo`
- `fechaDesde` (`YYYY-MM-DD`)
- `fechaHasta` (`YYYY-MM-DD`)

**Success response**
```json
{
  "averagePrice": 1.23,
  "recordCount": 157,
  "lastUpdated": "2026-03-22T10:30:00.000Z"
}
```

### `GET /api/user/sales`
Returns authenticated user sales history with HCS event references.

**Headers**
- `Authorization: Bearer <token>`

**Success response**
```json
{
  "sales": [
    {
      "sale": {
        "id": "...",
        "variedadCultivo": "Papa Canchan",
        "cantidadKg": 5000,
        "precioUnitarioPen": 1.2
      },
      "hcsEvent": {
        "transactionId": "...",
        "consensusTimestamp": "..."
      }
    }
  ]
}
```

## Error Contract

Most failing responses return:

```json
{
  "error": "Human-readable error message"
}
```
