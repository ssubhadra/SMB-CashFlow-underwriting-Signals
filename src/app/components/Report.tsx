import { Activity, AlertTriangle, CheckCircle2, DollarSign, Download, Flag, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router';

type Analysis = {
  risk_score: number;
  risk_level: string;
  analyst_review_required: boolean;
  recommended_loan_amount: number;
  recommended_collection_window: string;
  metrics: {
    average_monthly_deposits: number;
    average_monthly_outflows: number;
    average_balance: number;
    monthly_net_cash_flow: number;
    cash_flow_volatility_ratio: number;
    cash_flow_volatility: string;
    overdraft_count: number;
    monthly_debt_payments: number;
    debt_to_deposit_ratio: number;
    estimated_weeks_of_liquidity: number;
  };
  ai_explanation: string | { summary?: string; top_drivers?: string[] };
};

type ReportState = {
  result?: {
    status: string;
    business: {
      name: string;
      industry: string;
      months_analyzed: number;
    };
    analysis: Analysis;
  } | null;
};

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function getAiText(aiExplanation: Analysis['ai_explanation'] | undefined) {
  if (!aiExplanation) return null;
  if (typeof aiExplanation === 'string') return aiExplanation;
  return aiExplanation.summary ?? null;
}

export function Report() {
  const location = useLocation();
  const { result } = (location.state ?? {}) as ReportState;
  const analysis = result?.analysis;
  const metrics = analysis?.metrics;
  const businessName = result?.business.name ?? 'Riverside Coffee Roasters';
  const industry = result?.business.industry ?? 'Restaurant';
  const monthsAnalyzed = result?.business.months_analyzed ?? 12;
  const riskScore = analysis?.risk_score ?? 73;
  const riskLevel = analysis?.risk_level ?? 'Low-to-Moderate';
  const recommendedLoanAmount = analysis?.recommended_loan_amount ?? 85000;
  const avgMonthlyDeposits = metrics?.average_monthly_deposits ?? 60167;
  const avgBalance = metrics?.average_balance ?? 61000;
  const monthlyOutflows = metrics?.average_monthly_outflows ?? 35450;
  const monthlyNetCashFlow = metrics?.monthly_net_cash_flow ?? avgMonthlyDeposits - monthlyOutflows;
  const volatility = metrics?.cash_flow_volatility ?? 'Low';
  const volatilityRatio = metrics ? `${Math.round(metrics.cash_flow_volatility_ratio * 100)}%` : '18%';
  const overdraftCount = metrics?.overdraft_count ?? 1;
  const debtRatio = metrics?.debt_to_deposit_ratio ?? 0.082;
  const monthlyDebtPayments = metrics?.monthly_debt_payments ?? 2050;
  const analystReviewRequired = analysis?.analyst_review_required ?? true;
  const aiText =
    getAiText(analysis?.ai_explanation) ??
    'Riverside Coffee Roasters shows strong cash-flow momentum with consistent revenue and healthy cash-flow management.';
  const reportDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl">Underwriting Analysis Report</h1>
          <p className="text-sm text-muted-foreground">Generated on {reportDate}</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!result && (
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-8 text-sm text-muted-foreground">
            This report is showing seeded demo data. Return to the dashboard from a live analysis to view an uploaded-data report.
          </div>
        )}

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
                <h3 className="text-xl mb-2">{riskLevel === 'High' ? 'Analyst Review Required' : 'Underwriting Signal Ready'}</h3>
                <p className="text-muted-foreground">Risk Score: {riskScore}/100 ({riskLevel} Risk)</p>
              </div>
            </div>
            <div className="bg-background/80 backdrop-blur rounded-lg p-6">
              <h4 className="mb-3">Recommended Loan Amount: {formatCurrency(recommendedLoanAmount)}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{aiText}</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl">Business Information</h2>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Business Name</div>
                <div className="font-medium">{businessName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Industry</div>
                <div className="font-medium">{industry}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Analysis Period</div>
                <div className="font-medium">{monthsAnalyzed} months</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Analysis Date</div>
                <div className="font-medium">{reportDate}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl">Key Financial Metrics</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <MetricCard icon={<DollarSign className="w-5 h-5 text-muted-foreground" />} label="Average Monthly Deposits" value={formatCurrency(avgMonthlyDeposits)} helper="Live API metric" />
            <MetricCard icon={<Activity className="w-5 h-5 text-muted-foreground" />} label="Average Balance" value={formatCurrency(avgBalance)} helper="Estimated from transaction balances" />
            <MetricCard icon={<Activity className="w-5 h-5 text-muted-foreground" />} label="Cash Flow Volatility" value={volatilityRatio} helper={`${volatility} volatility`} />
            <MetricCard icon={<AlertTriangle className="w-5 h-5 text-muted-foreground" />} label="Overdraft Incidents" value={overdraftCount.toLocaleString()} helper="Detected from balances and transaction descriptions" />
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl">Detailed Cash Flow Analysis</h2>
          </div>

          <div className="grid gap-6">
            <DetailPanel
              title="Revenue Analysis"
              body={`${businessName} generated average monthly deposits of ${formatCurrency(avgMonthlyDeposits)} over the ${monthsAnalyzed}-month analysis period.`}
              rows={[
                ['Average Monthly Deposits', formatCurrency(avgMonthlyDeposits)],
                ['Monthly Net Cash Flow', formatCurrency(monthlyNetCashFlow)],
              ]}
            />
            <DetailPanel
              title="Expense Management"
              body={`Average monthly outflows are ${formatCurrency(monthlyOutflows)}. The API compares outflows with deposits and balance behavior to estimate repayment capacity.`}
              rows={[
                ['Average Monthly Outflows', `${formatCurrency(monthlyOutflows)}/month`],
                ['Estimated Weeks of Liquidity', `${metrics?.estimated_weeks_of_liquidity ?? 0} weeks`],
              ]}
            />
            <DetailPanel
              title="Debt Position"
              body={`Detected monthly debt payments average ${formatCurrency(monthlyDebtPayments)}. Debt payments represent about ${Math.round(debtRatio * 100)}% of average monthly deposits.`}
              rows={[
                ['Monthly Debt Payments', `${formatCurrency(monthlyDebtPayments)}/month`],
                ['Debt-to-Deposit Ratio', `${Math.round(debtRatio * 100)}%`],
              ]}
            />
          </div>
        </section>

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
                <p className="text-sm text-muted-foreground leading-relaxed">{aiText}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl">Analyst Review Flag</h2>
          </div>

          <div className={`${analystReviewRequired ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900' : 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900'} rounded-lg p-6`}>
            <div className="flex items-start gap-3">
              <Flag className={`w-5 h-5 mt-0.5 ${analystReviewRequired ? 'text-amber-600' : 'text-green-600'}`} />
              <div>
                <h3 className={`mb-2 ${analystReviewRequired ? 'text-amber-900 dark:text-amber-100' : 'text-green-900 dark:text-green-100'}`}>
                  {analystReviewRequired ? 'Manual Review Recommended' : 'No Manual Review Flag'}
                </h3>
                <p className={`text-sm ${analystReviewRequired ? 'text-amber-800 dark:text-amber-200' : 'text-green-800 dark:text-green-200'}`}>
                  {analystReviewRequired
                    ? 'Automated analysis recommends a lending officer review before final action.'
                    : 'Automated analysis did not require analyst review for this request.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>This report was generated by SMB Credit Signal using automated analysis of transaction data.</p>
            <p>Generated: {reportDate}</p>
            <p className="text-xs pt-4">Portfolio demonstration project.</p>
            <Link to="/dashboard" state={{ result, payload: (location.state as { payload?: unknown } | null)?.payload }} className="inline-block pt-2 text-primary hover:underline">
              Back to dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="text-3xl mb-2">{value}</div>
      <div className="flex items-center gap-1 text-sm text-green-600">
        <TrendingUp className="w-4 h-4" />
        <span>{helper}</span>
      </div>
    </div>
  );
}

function DetailPanel({
  title,
  body,
  rows,
}: {
  title: string;
  body: string;
  rows: [string, string][];
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="mb-4">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{body}</p>
      <div className="bg-muted/50 rounded-lg p-4">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-1">
            <span className="text-sm">{label}</span>
            <span className="text-sm font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
