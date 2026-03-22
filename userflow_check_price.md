# User Flow — Check Price

## Actors
- Farmer (authenticated or app visitor depending on route policy)
- ChacraChain backend (price aggregation service)

## Preconditions
- Historical sale records are available in the application data layer.
- API route for sales query is available.

## Steps
1. The user opens **Check Price** (`/check-price`).
2. The page applies default filters (date range + optional variety).
3. Frontend requests aggregated data from `GET /api/sales`.
4. Backend filters records and computes average unit price in PEN.
5. Frontend renders:
   - Current average price
   - Number of records used
   - Last update timestamp
   - Trend visualization
6. User can update filters and refresh results.

## Expected Output
- Fast, readable market guidance based on recorded transaction history.
- Transparent context on how many records drive the current average.

## Error Paths
- API failure → explicit error banner with message.
- No records for selected filters → empty but valid state (`0.00` and zero records).

## Acceptance Criteria
- [x] Default query runs on page load.
- [x] Date range and variety filters trigger recomputation.
- [x] Average value is formatted in PEN with two decimals.
- [x] Record count and refresh context are shown.
- [x] Errors are displayed without breaking page navigation.
