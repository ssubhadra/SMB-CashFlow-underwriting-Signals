import { Link, useLocation } from 'react-router';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, DollarSign, Activity, CreditCard, AlertCircle, FileText, Download, Info } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { useRef, useState } from 'react';
import sampleRequest from '../../../examples/sample-underwrite-request.json';
import { underwrite } from '../../lib/underwrite';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type UnderwriteResponse = {
  status: string;
  business: {
    name: string;
    industry: string;
    months_analyzed: number;
  };
  analysis: {
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
      low_balance_days: number;
      monthly_debt_payments: number;
      debt_to_deposit_ratio: number;
      estimated_weeks_of_liquidity: number;
    };
    ai_explanation:
      | string
      | {
          summary?: string;
          top_drivers?: string[];
        };
    explanation_source: string;
  };
  disclaimer: string;
};

type Transaction = {
  date: string;
  description?: string;
  amount: number;
  type?: 'credit' | 'debit';
  category?: string;
  balance?: number;
};

type UnderwritePayload = {
  business_name?: string;
  industry?: string;
  opening_balance?: number;
  analysis_period_months?: number;
  transactions: Transaction[];
};

type DecisionStatus = 'approved' | 'needs_info' | null;
type DashboardLocationState =
  | UnderwriteResponse
  | UnderwriteResponse['analysis']
  | {
      result?: UnderwriteResponse;
      payload?: UnderwritePayload;
      analysis?: UnderwriteResponse['analysis'];
      business?: UnderwriteResponse['business'];
      status?: string;
      disclaimer?: string;
    }
  | null;

function getInitialResult(state: DashboardLocationState): UnderwriteResponse | null {
  if (!state || typeof state !== 'object') return null;

  if ('result' in state && state.result?.analysis) {
    return state.result;
  }

  if ('analysis' in state && state.analysis?.metrics) {
    return {
      status: state.status ?? 'success',
      business: state.business ?? {
        name: 'Analyzed Business',
        industry: 'Unknown',
        months_analyzed: 0,
      },
      analysis: state.analysis,
      disclaimer: state.disclaimer ?? '',
    };
  }

  if ('metrics' in state) {
    return {
      status: 'success',
      business: {
        name: 'Analyzed Business',
        industry: 'Unknown',
        months_analyzed: 0,
      },
      analysis: state,
      disclaimer: '',
    };
  }

  return null;
}

function getInitialPayload(state: DashboardLocationState): UnderwritePayload | null {
  if (!state || typeof state !== 'object') return null;
  if ('payload' in state && state.payload?.transactions) return state.payload;
  return null;
}

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function getRiskClassName(riskLevel: string) {
  if (riskLevel === 'High') return 'text-red-600';
  if (riskLevel === 'Low') return 'text-green-600';
  return 'text-amber-600';
}

function normalizeAmount(tx: Transaction) {
  if (tx.type === 'credit') return Math.abs(tx.amount);
  if (tx.type === 'debit') return -Math.abs(tx.amount);
  return tx.amount;
}

function getMonthLabel(date: string) {
  const parsed = new Date(`${date.slice(0, 7)}-01T00:00:00`);
  return parsed.toLocaleString('en-US', { month: 'short' });
}

function isDebtTransaction(tx: Transaction) {
  const text = `${tx.description ?? ''} ${tx.category ?? ''}`.toLowerCase();
  return (
    text.includes('loan') ||
    text.includes('debt') ||
    text.includes('mca') ||
    text.includes('financing') ||
    text.includes('credit card') ||
    text.includes('repayment')
  );
}

function toCategoryLabel(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildMonthlyRevenueData(payload: UnderwritePayload | null) {
  if (!payload?.transactions.length) return monthlyRevenue;

  const months = new Map<string, { month: string; revenue: number; expenses: number }>();

  for (const tx of payload.transactions) {
    if (!tx.date || typeof tx.amount !== 'number') continue;
    const key = tx.date.slice(0, 7);
    const amount = normalizeAmount(tx);
    const row = months.get(key) ?? { month: getMonthLabel(tx.date), revenue: 0, expenses: 0 };

    if (amount >= 0) row.revenue += amount;
    if (amount < 0) row.expenses += amount;
    months.set(key, row);
  }

  return [...months.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, row]) => row);
}

function buildBalanceData(payload: UnderwritePayload | null) {
  if (!payload?.transactions.length) return balanceData;

  let runningBalance = payload.opening_balance ?? 0;
  const balances = new Map<string, { month: string; total: number; count: number }>();

  for (const tx of [...payload.transactions].sort((a, b) => a.date.localeCompare(b.date))) {
    if (!tx.date || typeof tx.amount !== 'number') continue;
    runningBalance = tx.balance ?? runningBalance + normalizeAmount(tx);
    const key = tx.date.slice(0, 7);
    const row = balances.get(key) ?? { month: getMonthLabel(tx.date), total: 0, count: 0 };
    row.total += runningBalance;
    row.count += 1;
    balances.set(key, row);
  }

  return [...balances.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, row]) => ({
      month: row.month,
      balance: Math.round(row.total / row.count),
    }));
}

function buildExpenseRows(payload: UnderwritePayload | null, monthsAnalyzed: number) {
  if (!payload?.transactions.length) {
    return [
      { label: 'Payroll', amount: 28500 },
      { label: 'Rent & Utilities', amount: 4200 },
      { label: 'Software & Subscriptions', amount: 1800 },
      { label: 'Insurance', amount: 950 },
    ];
  }

  const totals = new Map<string, number>();

  for (const tx of payload.transactions) {
    const amount = normalizeAmount(tx);
    if (amount >= 0 || isDebtTransaction(tx)) continue;
    const category = tx.category ? toCategoryLabel(tx.category) : 'Uncategorized';
    totals.set(category, (totals.get(category) ?? 0) + Math.abs(amount));
  }

  return [...totals.entries()]
    .map(([label, total]) => ({ label, amount: Math.round(total / Math.max(monthsAnalyzed, 1)) }))
    .sort((left, right) => right.amount - left.amount)
    .slice(0, 4);
}

function buildDebtRows(payload: UnderwritePayload | null, monthsAnalyzed: number) {
  if (!payload?.transactions.length) {
    return [
      { label: 'Business Line of Credit', amount: 850 },
      { label: 'Equipment Loan', amount: 1200 },
    ];
  }

  const totals = new Map<string, number>();

  for (const tx of payload.transactions) {
    const amount = normalizeAmount(tx);
    if (amount >= 0 || !isDebtTransaction(tx)) continue;
    const label = tx.description || tx.category || 'Debt Payment';
    totals.set(label, (totals.get(label) ?? 0) + Math.abs(amount));
  }

  return [...totals.entries()]
    .map(([label, total]) => ({ label, amount: Math.round(total / Math.max(monthsAnalyzed, 1)) }))
    .sort((left, right) => right.amount - left.amount);
}

function getAiSummary(
  aiExplanation: UnderwriteResponse['analysis']['ai_explanation'] | undefined
) {
  if (!aiExplanation) {
    return {
      summary: 'Run analysis to generate a live risk summary.',
      topDrivers: [],
    };
  }

  if (typeof aiExplanation === 'string') {
    return {
      summary: aiExplanation,
      topDrivers: [
        'Average monthly deposits',
        'Cash-flow volatility',
        'Debt-to-deposit ratio',
        'Liquidity and overdraft signals',
      ],
    };
  }

  return {
    summary: aiExplanation.summary ?? 'No summary returned.',
    topDrivers: aiExplanation.top_drivers ?? [],
  };
}

function StatCard({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className={`text-2xl mb-1 ${className}`}>{value}</div>
    </div>
  );
}

// Demo data - converted to diverging format for 2-sided bars
const monthlyRevenue = [
  { month: 'Jul', revenue: 45000, expenses: -38000 },
  { month: 'Aug', revenue: 52000, expenses: -41000 },
  { month: 'Sep', revenue: 48000, expenses: -39000 },
  { month: 'Oct', revenue: 61000, expenses: -43000 },
  { month: 'Nov', revenue: 58000, expenses: -42000 },
  { month: 'Dec', revenue: 71000, expenses: -48000 },
  { month: 'Jan', revenue: 54000, expenses: -41000 },
  { month: 'Feb', revenue: 59000, expenses: -43000 },
  { month: 'Mar', revenue: 64000, expenses: -46000 },
  { month: 'Apr', revenue: 68000, expenses: -47000 },
  { month: 'May', revenue: 72000, expenses: -49000 },
  { month: 'Jun', revenue: 69000, expenses: -48000 },
];

const balanceData = [
  { month: 'Jul', balance: 23000 },
  { month: 'Aug', balance: 28000 },
  { month: 'Sep', balance: 25000 },
  { month: 'Oct', balance: 34000 },
  { month: 'Nov', balance: 38000 },
  { month: 'Dec', balance: 49000 },
  { month: 'Jan', balance: 42000 },
  { month: 'Feb', balance: 46000 },
  { month: 'Mar', balance: 52000 },
  { month: 'Apr', balance: 58000 },
  { month: 'May', balance: 64000 },
  { month: 'Jun', balance: 61000 },
];

function MetricTooltip({ calculation, children }: { calculation: string; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help flex items-center gap-1"
      >
        {children}
        <Info className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      {isVisible && (
        <div className="absolute z-50 bottom-full left-0 mb-2 bg-popover border border-border rounded-lg p-3 shadow-lg w-72">
          <div className="text-xs font-medium mb-1">Calculation</div>
          <div className="text-xs text-muted-foreground">{calculation}</div>
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  const location = useLocation();
  const initialResult = getInitialResult(location.state as DashboardLocationState);
  const initialPayload = getInitialPayload(location.state as DashboardLocationState);
  const riskScore = 73; // Out of 100
  const recommendedLoan = 85000;
  const [analysisResult, setAnalysisResult] = useState<UnderwriteResponse | null>(initialResult);
  const [analysisPayload, setAnalysisPayload] = useState<UnderwritePayload | null>(initialPayload);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [status, setStatus] = useState<DecisionStatus>(null);
  const isRunningRef = useRef(false);

  const analysis = analysisResult?.analysis;
  const monthsAnalyzed = analysisResult?.business.months_analyzed ?? analysisPayload?.analysis_period_months ?? 12;
  const businessName = analysisResult?.business.name ?? analysisPayload?.business_name ?? 'Riverside Coffee Roasters';
  const businessSubtitle = analysisResult
    ? `${businessName} - ${monthsAnalyzed} month analysis`
    : 'Riverside Coffee Roasters - Last 12 months';
  const chartMonthlyRevenue = buildMonthlyRevenueData(analysisPayload);
  const chartBalanceData = buildBalanceData(analysisPayload);
  const recurringExpenseRows = buildExpenseRows(analysisPayload, monthsAnalyzed);
  const debtRows = buildDebtRows(analysisPayload, monthsAnalyzed);
  const totalFixedCosts = recurringExpenseRows.reduce((sum, row) => sum + row.amount, 0);
  const displayedRiskScore = analysisResult?.analysis.risk_score ?? riskScore;
  const displayedLoanAmount = analysisResult?.analysis.recommended_loan_amount ?? recommendedLoan;
  const displayedRiskLevel = analysisResult?.analysis.risk_level ?? 'Low-to-moderate';
  const aiSummary = getAiSummary(analysis?.ai_explanation);
  const displayedExplanation =
    aiSummary.summary ??
    'Riverside Coffee Roasters shows strong upward cash flow momentum with consistent revenue growth over the past 6 months. Average monthly balance has increased 160% since July. Only 1 overdraft incident detected in 12 months. Debt-to-revenue ratio of 8% is well within safe parameters. The business demonstrates seasonal strength in Q4 with reliable recovery patterns.';

  const handleRunAnalysis = async () => {
    if (isRunningRef.current) return;

    const payload = analysisPayload ?? sampleRequest;
    isRunningRef.current = true;
    setIsRunningAnalysis(true);
    setAnalysisError(null);
    setStatus(null);

    try {
      const result = await underwrite(payload);
      setAnalysisResult(result);
      setAnalysisPayload(payload);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Unable to run analysis.');
    } finally {
      isRunningRef.current = false;
      setIsRunningAnalysis(false);
    }
  };

  if (location.pathname === '/result' && !analysisResult && !analysisError && !isRunningAnalysis) {
    return (
      <div className="flex-1 overflow-auto bg-muted/30">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl mb-3">No analysis yet</h1>
          <p className="text-muted-foreground mb-6">
            Choose a demo company or upload a CSV/JSON file to generate underwriting results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/demo"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Try demo companies
            </Link>
            <Link
              to="/upload"
              className="bg-card border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
            >
              Upload data
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Cash Flow Analysis</h1>
            <p className="text-muted-foreground">{businessSubtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isRunningAnalysis}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity flex items-center gap-2 text-sm"
            >
              <Activity className="w-4 h-4" />
              {isRunningAnalysis ? 'Running...' : 'Run analysis'}
            </button>
            <Link
              to="/report"
              state={{ result: analysisResult, payload: analysisPayload }}
              className="bg-card border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-2 text-sm"
            >
              <FileText className="w-4 h-4" />
              View full report
            </Link>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Risk Score Card */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm">Risk Assessment</span>
                {analysis?.analyst_review_required && (
                  <Badge variant="destructive">Analyst review required</Badge>
                )}
              </div>
              <h2 className="text-4xl mb-2">{displayedRiskScore}/100</h2>
              <p className={`mb-4 ${getRiskClassName(displayedRiskLevel)}`}>{displayedRiskLevel} risk profile</p>
              <div className="bg-background/80 backdrop-blur rounded-lg p-4 max-w-2xl">
                <p className="text-sm leading-relaxed">
                  <strong className="text-foreground">AI Analysis:</strong> {displayedExplanation}
                </p>
              </div>
              {analysis && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <Button
                    type="button"
                    onClick={() => setStatus('approved')}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Mark Approved
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setStatus('needs_info')}
                  >
                    Request Info
                  </Button>
                  {status && (
                    <span className="text-sm text-muted-foreground">
                      Status: {status === 'approved' ? 'Approved' : 'Needs more information'}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="bg-background rounded-lg p-6 text-center min-w-[200px]">
              <div className="text-sm text-muted-foreground mb-2">Recommended Loan Amount</div>
              <div className="text-3xl mb-1">${(displayedLoanAmount / 1000).toFixed(0)}K</div>
              <div className="text-xs text-muted-foreground">Based on cash flow capacity</div>
            </div>
          </div>
        </div>

        {(analysisResult || analysisError) && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="mb-3">Live API Result</h3>
            {analysisError ? (
              <p className="text-sm text-red-600">{analysisError}</p>
            ) : analysisResult ? (
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Status</div>
                  <div className="font-medium">{analysisResult.status}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Business</div>
                  <div className="font-medium">{analysisResult.business.name}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Collection Window</div>
                  <div className="font-medium">{analysisResult.analysis.recommended_collection_window}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Analyst Review</div>
                  <div className="font-medium">{analysisResult.analysis.analyst_review_required ? 'Required' : 'Not required'}</div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Key Metrics Grid */}
        {analysis ? (
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Avg Monthly Deposits"
              value={formatCurrency(analysis.metrics.average_monthly_deposits)}
            />
            <StatCard
              label="Avg Balance"
              value={formatCurrency(analysis.metrics.average_balance)}
            />
            <StatCard
              label="Risk Level"
              value={analysis.risk_level}
              className={getRiskClassName(analysis.risk_level)}
            />
            <StatCard
              label="Avg Monthly Outflows"
              value={formatCurrency(analysis.metrics.average_monthly_outflows)}
            />
            <StatCard
              label="Net Monthly Cash Flow"
              value={formatCurrency(analysis.metrics.monthly_net_cash_flow)}
            />
            <StatCard
              label="Cash Flow Volatility"
              value={analysis.metrics.cash_flow_volatility}
              className={getRiskClassName(analysis.metrics.cash_flow_volatility)}
            />
            <StatCard
              label="Overdraft Count"
              value={analysis.metrics.overdraft_count.toLocaleString()}
            />
            <StatCard
              label="Weeks of Liquidity"
              value={analysis.metrics.estimated_weeks_of_liquidity.toLocaleString()}
            />
          </div>
        ) : (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <MetricTooltip calculation="Sum of all credit transactions / Number of months in analysis period">
                <span className="text-sm text-muted-foreground">Avg Monthly Revenue</span>
              </MetricTooltip>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl mb-1">$60.2K</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12% vs. prior 6mo</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <MetricTooltip calculation="Current account balance as of the most recent transaction date">
                <span className="text-sm text-muted-foreground">Current Balance</span>
              </MetricTooltip>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl mb-1">$61K</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+165% since start</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <MetricTooltip calculation="Standard deviation of monthly net cash flow / Average monthly net cash flow × 100. Lower % indicates more stable cash flow.">
                <span className="text-sm text-muted-foreground">Cash Flow Volatility</span>
              </MetricTooltip>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl mb-1">18%</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Low volatility</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <MetricTooltip calculation="Total number of days where account balance fell below zero during the analysis period">
                <span className="text-sm text-muted-foreground">Overdraft Count</span>
              </MetricTooltip>
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl mb-1">1</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Low frequency</span>
            </div>
          </div>
        </div>
        )}

        {analysis && (
          <section className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="mb-3">AI Risk Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{aiSummary.summary}</p>

            {aiSummary.topDrivers.length > 0 && (
              <>
                <h4 className="mt-4 mb-2">Top Drivers</h4>
                <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                  {aiSummary.topDrivers.map((driver) => (
                    <li key={driver}>{driver}</li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4">Monthly Revenue & Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartMonthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => {
                    const seriesName = name.toLowerCase() === 'expenses' ? 'Expenses' : 'Revenue';
                    return [Math.abs(value).toLocaleString(), seriesName];
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4">Account Balance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartBalanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="balance" stroke="var(--color-chart-1)" strokeWidth={2} name="Balance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Recurring Expenses
            </h3>
            <div className="space-y-3">
              {recurringExpenseRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <span className="text-sm">{row.label}</span>
                  <span className="font-medium">{formatCurrency(row.amount)}/mo</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t-2 border-border">
                <span className="font-medium">Total Fixed Costs</span>
                <span className="font-medium">{formatCurrency(totalFixedCosts)}/mo</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Debt Obligations
            </h3>
            <div className="space-y-3">
              {debtRows.length > 0 ? (
                debtRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm">{row.label}</span>
                    <span className="font-medium">{formatCurrency(row.amount)}/mo</span>
                  </div>
                ))
              ) : (
                <div className="py-2 border-b border-border text-sm text-muted-foreground">
                  No debt-payment transactions detected
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t-2 border-border">
                <span className="font-medium">Debt-to-Deposit Ratio</span>
                <span className={`font-medium ${analysis && analysis.metrics.debt_to_deposit_ratio > 0.2 ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis ? `${Math.round(analysis.metrics.debt_to_deposit_ratio * 100)}%` : '8.2%'}
                </span>
              </div>
            </div>
            <div className={`mt-4 rounded-lg p-3 ${analysis && analysis.metrics.debt_to_deposit_ratio > 0.2 ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900' : 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900'}`}>
              <p className={`text-sm ${analysis && analysis.metrics.debt_to_deposit_ratio > 0.2 ? 'text-red-900 dark:text-red-100' : 'text-green-900 dark:text-green-100'}`}>
                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                {analysis && analysis.metrics.debt_to_deposit_ratio > 0.2
                  ? 'Debt payments may require analyst review'
                  : 'Debt levels are healthy and manageable'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
