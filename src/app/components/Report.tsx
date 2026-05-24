import { Download, CheckCircle2, TrendingUp, AlertTriangle, Calendar, DollarSign, Activity, Flag } from 'lucide-react';

export function Report() {
  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Report Header - Print-friendly */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl">Underwriting Analysis Report</h1>
          <p className="text-sm text-muted-foreground">Generated on May 24, 2026</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Report Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Executive Summary */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl">Executive Summary</h2>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl mb-2">Approved for Lending</h3>
                <p className="text-muted-foreground">Risk Score: 73/100 (Low-to-Moderate Risk)</p>
              </div>
            </div>
            <div className="bg-background/80 backdrop-blur rounded-lg p-6">
              <h4 className="mb-3">Recommended Loan Amount: $85,000</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Riverside Coffee Roasters demonstrates a strong financial profile with consistent revenue growth and healthy cash flow management.
                The business has shown 160% balance growth over the analysis period, maintains low debt obligations (8.2% debt-to-revenue ratio),
                and exhibits minimal overdraft activity. The recommended loan amount is based on the business's cash flow capacity and ability
                to service additional debt while maintaining operational stability.
              </p>
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl">Business Information</h2>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Business Name</div>
                <div className="font-medium">Riverside Coffee Roasters</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Business ID</div>
                <div className="font-medium">riverside-coffee-001</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Analysis Period</div>
                <div className="font-medium">June 2025 - June 2026 (12 months)</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Analysis Date</div>
                <div className="font-medium">May 24, 2026</div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl">Key Financial Metrics</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Average Monthly Revenue</span>
                <DollarSign className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl mb-2">$60,167</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>12% increase vs. prior 6 months</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Current Account Balance</span>
                <Activity className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl mb-2">$61,000</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>165% increase since start of period</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Cash Flow Volatility</span>
                <Activity className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl mb-2">18%</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Low volatility indicates stability</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Overdraft Incidents</span>
                <AlertTriangle className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl mb-2">1</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Minimal overdraft activity</span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Analysis */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl">Detailed Cash Flow Analysis</h2>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="mb-4">Revenue Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              The business has demonstrated consistent revenue generation with an average monthly revenue of $60,167 over the 12-month period.
              Notable revenue growth of 12% was observed in the latter half of the analysis period, indicating positive business momentum.
              The business shows seasonal strength in Q4, with December reaching $71,000 in revenue—the highest monthly figure in the period.
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Revenue Range</span>
                <span className="text-sm font-medium">$45,000 - $72,000 per month</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Growth Trend</span>
                <span className="text-sm font-medium text-green-600">Positive (upward)</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="mb-4">Expense Management</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Fixed monthly expenses average $35,450, representing stable operational costs. The business maintains a healthy expense-to-revenue
              ratio with expenses consistently below revenue, indicating profitable operations. Major expense categories include payroll ($28,500/mo),
              rent and utilities ($4,200/mo), software subscriptions ($1,800/mo), and insurance ($950/mo).
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Fixed Operating Costs</span>
                <span className="text-sm font-medium">$35,450/month</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Expense-to-Revenue Ratio</span>
                <span className="text-sm font-medium">59% (healthy)</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4">Debt Position</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Current debt obligations total $42,000 in outstanding balance with monthly payments of $2,050. This includes a business line of
              credit ($850/mo) and an equipment loan ($1,200/mo). The debt-to-revenue ratio of 8.2% is well within acceptable parameters for
              additional lending, indicating the business can comfortably service additional debt.
            </p>
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900 dark:text-green-100">Low Debt Burden</span>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                The 8.2% debt-to-revenue ratio indicates minimal debt burden and strong capacity for additional borrowing.
              </p>
            </div>
          </div>
        </section>

        {/* AI Risk Explanation */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl">AI Risk Assessment</h2>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg mt-1">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Automated Analysis Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Riverside Coffee Roasters shows strong upward cash flow momentum with consistent revenue growth over the past 6 months.
                  Average monthly balance has increased 160% since July, demonstrating excellent cash management and business growth.
                  Only 1 overdraft incident was detected in the 12-month period, indicating strong financial discipline.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  The debt-to-revenue ratio of 8% is well within safe parameters, suggesting the business has substantial capacity to
                  take on additional debt without strain. The business demonstrates seasonal strength in Q4 with reliable recovery patterns,
                  which adds predictability to cash flow forecasting.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on historical cash flow patterns, monthly revenue trends, and existing debt obligations, the business can
                  comfortably support a loan of up to $85,000 while maintaining healthy financial operations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Analyst Review Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl">Analyst Review Flag</h2>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Flag className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="mb-2 text-amber-900 dark:text-amber-100">Manual Review Recommended</h3>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
                  While automated analysis indicates low-moderate risk, we recommend a manual review by a lending officer for:
                </p>
                <div className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">—</span>
                    <span>Verification of business documentation and identity</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">—</span>
                    <span>Review of any industry-specific risk factors</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">—</span>
                    <span>Confirmation of collateral if applicable</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">—</span>
                    <span>Final approval of loan terms and conditions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Footer */}
        <section className="border-t border-border pt-8">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              This report was generated by CashFlow AI using automated analysis of 12 months of transaction data.
            </p>
            <p>
              Report ID: RPT-2026-05-24-001 | Generated: May 24, 2026 10:30 AM
            </p>
            <p className="text-xs pt-4">
              © 2026 CashFlow AI. This is a portfolio demonstration project.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
