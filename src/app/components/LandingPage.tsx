import { Link } from 'react-router';
import { ArrowRight, BarChart3, Shield, Zap, TrendingUp, FileText, CheckCircle2 } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-primary/5 px-4 py-2 rounded-full">
            <BarChart3 className="w-8 h-8 inline mr-2" />
            <span className="text-sm">CashFlow AI</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl text-center mb-6 tracking-tight">
          AI cash-flow underwriting API
          <br />
          <span className="text-muted-foreground">for SMB lenders</span>
        </h1>

        <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Analyze 6-12 months of transaction data, generate risk signals, and get plain-English explanations powered by AI
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            View demo dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/api-docs"
            className="bg-secondary text-secondary-foreground px-8 py-4 rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            See API docs
            <FileText className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-3xl text-center mb-16">Complete underwriting pipeline</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="mb-3">Automated Analysis</h3>
            <p className="text-muted-foreground">
              Process 6-12 months of SMB transaction data in seconds. Calculate cash-flow metrics, volatility, and risk scores automatically.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="mb-3">Risk Scoring</h3>
            <p className="text-muted-foreground">
              Advanced scoring logic evaluates overdrafts, balance trends, recurring expenses, and debt obligations to assess lending risk.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="mb-3">AI Explanations</h3>
            <p className="text-muted-foreground">
              LLM-powered explanations translate complex financial metrics into plain English that your team can understand.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-3xl text-center mb-16">Everything you need</h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1">Real-time Dashboard</h4>
              <p className="text-sm text-muted-foreground">Interactive dashboard with key metrics and risk visualization</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1">REST API</h4>
              <p className="text-sm text-muted-foreground">Simple POST endpoint for programmatic underwriting</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1">PDF Reports</h4>
              <p className="text-sm text-muted-foreground">Export detailed analysis reports for internal review</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1">Sandbox Mode</h4>
              <p className="text-sm text-muted-foreground">Test with demo data before connecting real accounts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
        <div className="bg-primary/5 rounded-2xl p-12 text-center">
          <h2 className="text-3xl mb-4">Ready to streamline your lending?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            See how CashFlow AI can help you make faster, more confident lending decisions
          </p>
          <Link
            to="/connect"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Get started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2026 CashFlow AI. Portfolio demo project.
        </div>
      </footer>
    </div>
  );
}
