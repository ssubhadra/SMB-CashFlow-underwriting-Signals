# SMB Credit Signal

AI cash-flow explanation for SMB underwriting.

SMB Credit Signal is a portfolio MVP for lenders, financing companies, and open banking teams. It analyzes SMB transaction data, calculates cash-flow underwriting signals, returns a structured API response, and generates a plain-English risk explanation for analyst review.

## What this MVP includes

- Vite + React frontend
- Lender facing dashboard and report screens(available only on sample data or when you upload CSV/JSON)
- API documentation page
- Live REST-style endpoint: `POST /api/underwrite`
- Rules-based cash-flow metrics engine
- Plain-English risk explanation
- Analyst review flag

## API endpoint

```http
POST https://smb-credit-signal-with-j90ab2ttt-subha-ss-projects-04b497d2.vercel.app/api/underwrite/api/underwrite
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

## If you know how to run locally, please do so. The code is public

## Product architecture


Transaction data (CSV/JSON)
  ↓
Cash-flow metrics engine (Metrics important such as Deposits, outflows, OD counts, balance etc)
  ↓
Rules-based risk signals (Math logic grabbed from simple google search)
  ↓
Plain-English explanation layer (Small Langchain prompt template)
  ↓
Dashboard / report / API response
  ↓
Human analyst review

## Important disclaimer

This is a portfolio MVP for underwriting support only. It is not a credit approval, decline, pricing, or adverse action decision system. A production lender deployment would require compliance review, data security controls, model governance, audit logs, monitoring, and human analyst oversight.
