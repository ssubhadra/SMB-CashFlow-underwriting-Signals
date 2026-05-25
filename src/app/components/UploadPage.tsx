import { Link, useNavigate } from 'react-router';
import { FileUp, Home } from 'lucide-react';
import { useState } from 'react';
import { underwrite } from '../../lib/underwrite';
import { Button } from './ui/button';

type CsvRow = Record<string, string>;

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const headers = parseCsvLine(lines[0] ?? '');

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce<CsvRow>((row, header, index) => {
      row[header] = values[index] ?? '';
      return row;
    }, {});
  });
}

async function fileToPayload(file: File) {
  if (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')) {
    return JSON.parse(await file.text());
  }

  const rows = parseCsv(await file.text());
  const transactions = rows
    .map((row) => {
      const amount = Number(row.Amount);
      return {
        date: row.Date,
        description: row.Description,
        amount,
        type: amount > 0 ? 'credit' : 'debit',
        category: row.Category || 'uncategorized',
      };
    })
    .filter((tx) => tx.date && Number.isFinite(tx.amount));

  if (transactions.length === 0) {
    throw new Error('No valid transactions found. Use CSV columns: Date, Description, Amount, Category.');
  }

  return {
    business_name: 'User Upload',
    industry: 'Unknown',
    opening_balance: 0,
    analysis_period_months: 6,
    transactions,
  };
}

export function UploadPage() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const payload = await fileToPayload(file);
      const result = await underwrite(payload);
      navigate('/result', { state: { result, payload } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze this file.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <Home className="w-4 h-4" />
          Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl mb-3">Upload Your Data</h1>
          <p className="text-muted-foreground">
            Upload a JSON request body or a CSV export. The app will run it through the same live underwriting API.
          </p>
        </div>

        <label className="bg-card border border-dashed border-border rounded-lg p-10 text-center block hover:bg-accent transition-colors cursor-pointer">
          <FileUp className="w-10 h-10 mx-auto mb-4 text-primary" />
          <span className="block font-medium mb-2">{isUploading ? 'Running analysis...' : 'Choose CSV or JSON file'}</span>
          <span className="block text-sm text-muted-foreground">
            CSV columns: Date, Description, Amount, Category
          </span>
          <input
            type="file"
            accept=".csv,.json,application/json,text/csv"
            onChange={handleFile}
            disabled={isUploading}
            className="sr-only"
          />
        </label>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 mt-6 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link to="/demo">Try a demo company instead</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
