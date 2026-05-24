import { Link } from 'react-router';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, DollarSign, Activity, CreditCard, AlertCircle, FileText, Download, Info } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { useState } from 'react';

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
  const riskScore = 73; // Out of 100
  const recommendedLoan = 85000;

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Cash Flow Analysis</h1>
            <p className="text-muted-foreground">Riverside Coffee Roasters — Last 12 months</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/report"
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
              </div>
              <h2 className="text-4xl mb-2">{riskScore}/100</h2>
              <p className="text-muted-foreground mb-4">Low-to-moderate risk profile</p>
              <div className="bg-background/80 backdrop-blur rounded-lg p-4 max-w-2xl">
                <p className="text-sm leading-relaxed">
                  <strong className="text-foreground">AI Analysis:</strong> Riverside Coffee Roasters shows strong upward cash flow momentum with consistent revenue growth over the past 6 months. Average monthly balance has increased 160% since July. Only 1 overdraft incident detected in 12 months. Debt-to-revenue ratio of 8% is well within safe parameters. The business demonstrates seasonal strength in Q4 with reliable recovery patterns.
                </p>
              </div>
            </div>
            <div className="bg-background rounded-lg p-6 text-center min-w-[200px]">
              <div className="text-sm text-muted-foreground mb-2">Recommended Loan Amount</div>
              <div className="text-3xl mb-1">${(recommendedLoan / 1000).toFixed(0)}K</div>
              <div className="text-xs text-muted-foreground">Based on cash flow capacity</div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
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

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4">Monthly Revenue & Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
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
                    return [Math.abs(value).toLocaleString(), name === 'expenses' ? 'Expenses' : 'Revenue'];
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
              <LineChart data={balanceData}>
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
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm">Payroll</span>
                <span className="font-medium">$28,500/mo</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm">Rent & Utilities</span>
                <span className="font-medium">$4,200/mo</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm">Software & Subscriptions</span>
                <span className="font-medium">$1,800/mo</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Insurance</span>
                <span className="font-medium">$950/mo</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t-2 border-border">
                <span className="font-medium">Total Fixed Costs</span>
                <span className="font-medium">$35,450/mo</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Debt Obligations
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm">Business Line of Credit</span>
                <span className="font-medium">$850/mo</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm">Equipment Loan</span>
                <span className="font-medium">$1,200/mo</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm">Outstanding Balance</span>
                <span className="font-medium">$42,000</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t-2 border-border">
                <span className="font-medium">Debt-to-Revenue Ratio</span>
                <span className="font-medium text-green-600">8.2%</span>
              </div>
            </div>
            <div className="mt-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-3">
              <p className="text-sm text-green-900 dark:text-green-100">
                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                Debt levels are healthy and manageable
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
