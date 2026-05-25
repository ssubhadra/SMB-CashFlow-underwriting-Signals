import { Copy, Check, Code2, AlertTriangle, FileJson, Server } from 'lucide-react';
import { useState } from 'react';

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 bg-background/80 backdrop-blur border border-border px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-sm hover:bg-accent"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </>
        )}
      </button>
      <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  );
}

export function ApiDocs() {
  const requestEndpoint = `POST https://smb-credit-signal-with-j90ab2ttt-subha-ss-projects-04b497d2.vercel.app/api/underwrite`;

  const requestHeaders = `Key: Content-Type
Value: application/json`;

  const sampleRequest = `{
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
    },
    {
      "date": "2025-01-08",
      "description": "Payroll",
      "amount": -12000,
      "type": "debit",
      "category": "payroll"
    },
    {
      "date": "2025-01-15",
      "description": "Business loan repayment",
      "amount": -3500,
      "type": "debit",
      "category": "debt_payment"
    }
  ]
}`;

  const sampleResponse = `{
  "status": "success",
  "business": {
    "name": "Riverside Coffee Roasters",
    "industry": "Restaurant",
    "months_analyzed": 6
  },
  "analysis": {
    "risk_score": 76,
    "risk_level": "Low",
    "analyst_review_required": false,
    "recommended_loan_amount": 39000,
    "recommended_collection_window": "3rd–7th of each month",
    "metrics": {
      "average_monthly_deposits": 42000,
      "average_monthly_outflows": 15500,
      "average_balance": 27875,
      "monthly_net_cash_flow": 26500,
      "cash_flow_volatility_ratio": 0,
      "cash_flow_volatility": "Low",
      "overdraft_count": 0,
      "low_balance_days": 0,
      "monthly_debt_payments": 3500,
      "debt_to_deposit_ratio": 0.083,
      "estimated_weeks_of_liquidity": 7.8
    },
    "ai_explanation": "Riverside Coffee Roasters shows low cash-flow risk based on transaction activity...",
    "explanation_source": "rules_template_v1"
  },
  "disclaimer": "Portfolio demo and underwriting support only. This is not a credit approval, decline, or adverse action decision."
}`;

  const curlExample = `curl.exe -X POST "https://smb-credit-signal-with-j90ab2ttt-subha-ss-projects-04b497d2.vercel.app/api/underwrite" -H "Content-Type: application/json" --data-binary "@examples/sample-underwrite-request.json"`;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm mb-4">
            <Server className="w-4 h-4" />
            Live REST API MVP
          </div>
          <h1 className="text-4xl mb-4">SMB Credit Signal API Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Submit SMB transaction data and receive cash-flow underwriting signals, repayment insights, and a plain-English risk explanation.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl mb-6">Quick Start</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm mb-2">Endpoint</h3>
              <p className="text-sm text-muted-foreground font-mono">POST /api/underwrite</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                <FileJson className="w-5 h-5" />
              </div>
              <h3 className="text-sm mb-2">Input</h3>
              <p className="text-sm text-muted-foreground">Business profile plus transaction array</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm mb-2">Output</h3>
              <p className="text-sm text-muted-foreground">Risk level, cash-flow metrics, review flag, and explanation</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-4">Authentication</h2>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">MVP note:</strong> This portfolio demo endpoint does not require authentication yet. A production version would need API keys, rate limits, audit logs, encryption controls, and lender-level access permissions.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-4">POST /api/underwrite</h2>
          <p className="text-muted-foreground mb-6">
            Submit transaction data for a sandbox underwriting-support analysis. The endpoint calculates deterministic cash-flow metrics first, then returns a plain-English explanation based on those metrics.
          </p>

          <h3 className="text-lg mb-3">How to Test</h3>
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <ol className="space-y-4 text-sm text-muted-foreground">
              <li>
                <span className="text-foreground">1. Open an API testing tool</span> such as Postman, Insomnia, Thunder Client, or any tool that can send HTTP requests.
              </li>
              <li>
                <span className="text-foreground">2. Create a new request</span> and set the method and URL to:
                <div className="mt-3">
                  <CodeBlock code={requestEndpoint} />
                </div>
              </li>
              <li>
                <span className="text-foreground">3. Under Headers, add:</span>
                <div className="mt-3">
                  <CodeBlock code={requestHeaders} />
                </div>
              </li>
              <li>
                <span className="text-foreground">4. Under Body, choose JSON</span>, then copy and paste the request body below.
              </li>
              <li>
                <span className="text-foreground">5. Hit Send.</span> The response should return the underwriting signal, cash-flow metrics, recommended loan amount, collection window, and explanation.
              </li>
            </ol>
          </div>

          <h3 className="text-lg mb-3">Request Body</h3>
          <div className="mb-6">
            <CodeBlock code={sampleRequest} />
          </div>

          <h3 className="text-lg mb-3">Response</h3>
          <div className="mb-6">
            <CodeBlock code={sampleResponse} />
          </div>

          <h3 className="text-lg mb-3">cURL Example</h3>
          <div>
            <CodeBlock code={curlExample} />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-4">Request Parameters</h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm">Parameter</th>
                  <th className="text-left px-6 py-3 text-sm">Type</th>
                  <th className="text-left px-6 py-3 text-sm">Required</th>
                  <th className="text-left px-6 py-3 text-sm">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">business_name</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">string</td>
                  <td className="px-6 py-4 text-sm">No</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">Display name for the business being analyzed</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">industry</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">string</td>
                  <td className="px-6 py-4 text-sm">No</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">Industry label used in the response</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">opening_balance</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">number</td>
                  <td className="px-6 py-4 text-sm">No</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">Starting account balance used to estimate running balance</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">analysis_period_months</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">integer</td>
                  <td className="px-6 py-4 text-sm">No</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">Months used to normalize monthly averages</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">transactions</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">array</td>
                  <td className="px-6 py-4 text-sm">Yes</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">Array of transaction objects with date, amount, type, category, and optional balance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-4">Calculated Metrics</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Average monthly deposits',
              'Average monthly outflows',
              'Average balance',
              'Monthly net cash flow',
              'Cash-flow volatility',
              'Overdraft count',
              'Low-balance days',
              'Monthly debt payments',
              'Debt-to-deposit ratio',
              'Estimated weeks of liquidity',
              'Recommended loan amount',
              'Recommended collection window'
            ].map((metric) => (
              <div key={metric} className="bg-card border border-border rounded-lg p-4 text-sm">
                {metric}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary/5 border border-primary/20 rounded-xl p-8">
          <h2 className="text-2xl mb-3">Important MVP Disclaimer</h2>
          <p className="text-muted-foreground">
            SMB Credit Signal is a portfolio MVP for underwriting support. The API explains calculated cash-flow signals; it does not approve, deny, or price loans. A production lender deployment would require compliance review, data security controls, model governance, monitoring, and human analyst oversight.
          </p>
        </section>
      </div>
    </div>
  );
}
