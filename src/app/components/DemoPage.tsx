import { Link, useNavigate } from 'react-router';
import { ArrowRight, Building2, Home } from 'lucide-react';
import { useState } from 'react';
import { underwrite } from '../../lib/underwrite';
import { Button } from './ui/button';

const demos = [
  { name: 'Riverside Coffee Roasters', type: 'Cafe', file: '/cafe.json' },
  { name: 'Bright Chair Salon', type: 'Salon', file: '/salon.json' },
  { name: 'Northstar Online Goods', type: 'E-Commerce', file: '/ecommerce.json' },
];

export function DemoPage() {
  const navigate = useNavigate();
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickDemo = async (path: string) => {
    setLoadingFile(path);
    setError(null);

    try {
      const payload = await fetch(path).then((response) => {
        if (!response.ok) throw new Error('Unable to load demo file.');
        return response.json();
      });
      const result = await underwrite(payload);
      navigate('/result', { state: { result, payload } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to run this demo.');
    } finally {
      setLoadingFile(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <Home className="w-4 h-4" />
          Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl mb-3">Try Demo Companies</h1>
          <p className="text-muted-foreground">
            Pick a sample SMB. The app will send its transaction file to the live underwriting API and open the results dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {demos.map((demo) => (
            <button
              type="button"
              key={demo.file}
              onClick={() => pickDemo(demo.file)}
              disabled={loadingFile !== null}
              className="bg-card border border-border rounded-lg p-6 text-left hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-4">
                <span className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </span>
                <span>
                  <span className="block font-medium">{demo.name}</span>
                  <span className="block text-sm text-muted-foreground">{demo.type} demo JSON</span>
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-primary">
                {loadingFile === demo.file ? 'Running...' : 'Analyze'}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link to="/upload">Upload CSV or JSON instead</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
