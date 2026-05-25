import { Link } from 'react-router';
import { Building2, Upload, Sparkles, ArrowRight } from 'lucide-react';

export function ConnectPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Connect your data</h1>
          <p className="text-xl text-muted-foreground">
            Choose how you'd like to access the underwriting platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Demo Company Option */}
          <Link
            to="/demo"
            className="bg-card border-2 border-primary rounded-xl p-8 hover:shadow-lg transition-all group"
          >
            <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h3 className="mb-2">Use demo company</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore a pre-loaded analysis of a sample SMB with 12 months of transaction data
            </p>
            <div className="bg-primary/5 px-3 py-1 rounded-full text-xs inline-block">
              Recommended
            </div>
            <div className="mt-6 flex items-center gap-2 text-primary text-sm">
              View dashboard
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Connect Bank Account Option */}
          <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all opacity-75">
            <div className="bg-secondary w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="mb-2">Connect bank account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Link a real business bank account via secure API integration
            </p>
            <div className="bg-muted px-3 py-1 rounded-full text-xs inline-block">
              Sandbox mode
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              Available in production
            </div>
          </div>

          {/* Upload Transactions Option */}
          <Link
            to="/upload"
            className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all group"
          >
            <div className="bg-secondary w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="mb-2">Upload sample transactions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import transaction data from CSV or Excel file format
            </p>
            <div className="bg-primary/5 px-3 py-1 rounded-full text-xs inline-block">
              CSV or JSON
            </div>
            <div className="mt-6 flex items-center gap-2 text-primary text-sm">
              Upload file
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        <div className="mt-12 bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Sandbox Mode:</strong> This demo environment uses simulated data for demonstration purposes.
            In production, you can connect real bank accounts or upload actual transaction files.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
