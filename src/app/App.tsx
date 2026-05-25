import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { ConnectPage } from './components/ConnectPage';
import { Dashboard } from './components/Dashboard';
import { DemoPage } from './components/DemoPage';
import { UploadPage } from './components/UploadPage';
import { ApiDocs } from './components/ApiDocs';
import { Report } from './components/Report';
import { BarChart3 } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) return null;

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BarChart3 className="w-6 h-6" />
          <span className="font-medium">SMB Credit Signal</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/demo"
            className="text-sm hover:text-foreground transition-colors text-muted-foreground"
          >
            Demo Companies
          </Link>
          <Link
            to="/upload"
            className="text-sm hover:text-foreground transition-colors text-muted-foreground"
          >
            Upload Data
          </Link>
          <Link
            to="/api-docs"
            className="text-sm hover:text-foreground transition-colors text-muted-foreground"
          >
            API Docs
          </Link>
          <Link
            to="/report"
            className="text-sm hover:text-foreground transition-colors text-muted-foreground"
          >
            Report
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="size-full flex flex-col bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/result" element={<Dashboard />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
