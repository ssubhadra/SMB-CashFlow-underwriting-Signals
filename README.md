# SMB Credit Signal

AI cash-flow intelligence for SMB underwriting.

SMB Credit Signal is a portfolio MVP for lenders, financing companies, and open banking teams. It analyzes SMB transaction data, calculates cash-flow underwriting signals, returns a structured API response, and generates a plain-English risk explanation for analyst review.

## What this MVP includes

- Vite + React frontend
- Lender-facing dashboard and report screens
- API documentation page
- Live REST-style endpoint: `POST /api/underwrite`
- Rules-based cash-flow metrics engine
- Plain-English risk explanation
- Analyst review flag

## API endpoint

```http
POST /api/underwrite
Content-Type: application/json
```

### Request shape

```json
{
  "business_name": "Riverside Coffee Roasters",
  "industry": "Restaurant",
  "opening_balance": 15000,
  "analysis_period_months": 6,
  "transactions": [
    {
      "date": "2025-01-03",
      "description": "Customer deposits",
      "amount": 42000,
      "type": "credit",
      "category": "revenue"
    }
  ]
}
```

### Response includes

- Risk score
- Risk level
- Analyst review flag
- Recommended loan amount
- Recommended collection window
- Average monthly deposits
- Average monthly outflows
- Average balance
- Monthly net cash flow
- Cash-flow volatility
- Overdraft count
- Low-balance days
- Monthly debt payments
- Debt-to-deposit ratio
- Estimated weeks of liquidity
- Plain-English risk explanation

## Run locally

```bash
npm install
npm run dev
```

The frontend runs with Vite.

To test the API locally in a Vercel-like environment:

```bash
npm install -D vercel
npx vercel dev
```

Then test:

```bash
curl -X POST http://localhost:3000/api/underwrite \
  -H "Content-Type: application/json" \
  -d @examples/sample-underwrite-request.json
```

## Deploy

Import this repo into Vercel.

Recommended settings:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

After deploy, test:

```bash
curl -X POST https://YOUR-VERCEL-URL.vercel.app/api/underwrite \
  -H "Content-Type: application/json" \
  -d @examples/sample-underwrite-request.json
```

## Product architecture

```text
Transaction data
  ↓
Cash-flow metrics engine
  ↓
Rules-based risk signals
  ↓
Plain-English explanation layer
  ↓
Dashboard / report / API response
  ↓
Human analyst review
```

## Important disclaimer

This is a portfolio MVP for underwriting support only. It is not a credit approval, decline, pricing, or adverse action decision system. A production lender deployment would require compliance review, data security controls, model governance, audit logs, monitoring, and human analyst oversight.
