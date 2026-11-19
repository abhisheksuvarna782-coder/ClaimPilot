import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import PlannedBadge from './ui/PlannedBadge';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const NAVIGATION_CONFIG = {
  CLAIMS: {
    label: 'CLAIMS',
    description: 'Claim validation pipeline & case reviews',
    items: [
      { name: 'Claim Analysis', path: '/claims/analysis', tag: 'LIVE', desc: 'Main analysis page showing fields, rule results and conflicts for the sample claim' },
      { name: 'Create New Claim', path: '/claims/new', tag: 'PLANNED', desc: 'Pre-admission authorization and reimbursement claim intake' },
      { name: 'Pending Claims', path: '/claims/pending', tag: 'PLANNED', desc: 'Claims pending documentation or clinical clarification' },
      { name: 'Processed Claims', path: '/claims/processed', tag: 'PLANNED', desc: 'Historical claims validated and formatted for submission' },
      { name: 'Claims Awaiting Review', path: '/claims/review', tag: 'PLANNED', desc: 'Flagged claims requiring medical staff reconciliation' },
    ]
  },
  DOCUMENTS: {
    label: 'DOCUMENTS',
    description: 'Clinical evidence & source text management',
    items: [
      { name: 'Source Documents', path: '/documents/sources', tag: 'LIVE', desc: 'The two synthetic documents with a page-text viewer' },
      { name: 'Extracted Information', path: '/documents/extracted', tag: 'LIVE', desc: 'The extracted-fields table view' },
      { name: 'Evidence Traceability', path: '/documents/traceability', tag: 'LIVE', desc: 'Field, source document, page, snippet, and confidence signals' },
      { name: 'Upload Documents', path: '/documents/upload', tag: 'PLANNED', desc: 'Automated multi-document intake and multi-modal OCR ingestion' },
      { name: 'Document Processing', path: '/documents/processing', tag: 'PLANNED', desc: 'Real-time text normalization and parsing pipelines' },
    ]
  },
  'AI INTELLIGENCE': {
    label: 'AI INTELLIGENCE',
    description: 'Extraction architecture & contradictory signal logic',
    items: [
      { name: 'Extraction Method', path: '/intelligence/method', tag: 'LIVE', desc: 'Pipeline stages and regex extraction overview with LLM roadmap' },
      { name: 'Contradiction Detection', path: '/intelligence/contradictions', tag: 'LIVE', desc: 'Conflict cards evaluated directly from the real conflicts array' },
      { name: 'LLM Document Analysis', path: '/intelligence/llm-analysis', tag: 'PLANNED', desc: 'Context-aware generative clinical record extraction' },
      { name: 'AI Processing History', path: '/intelligence/history', tag: 'PLANNED', desc: 'Model inference telemetry and audit logs' },
    ]
  },
  VERIFICATION: {
    label: 'VERIFICATION',
    description: 'Deterministic rules & clinical code validation',
    items: [
      { name: 'Rule Validation', path: '/verification/rules', tag: 'SIMULATED', desc: 'Deterministic evaluation results for the four prototype rules' },
      { name: 'ICD-10 Validity', path: '/verification/icd10', tag: 'SIMULATED', desc: 'The ICD-01 result referencing a small prototype sample list' },
      { name: 'Policy Compliance', path: '/verification/policy', tag: 'PLANNED', desc: 'Official insurer statutory clauses and clause verification' },
      { name: 'Human Review', path: '/verification/human-review', tag: 'PLANNED', desc: 'View-only preview; approval and rejection workflows' },
    ]
  },
  ANALYTICS: {
    label: 'ANALYTICS',
    description: 'Real-time statistics & validation telemetry',
    items: [
      { name: 'Claim Statistics', path: '/analytics/statistics', tag: 'LIVE', desc: 'Computed strictly from active /analyze response data' },
      { name: 'Processing Performance', path: '/analytics/performance', tag: 'PLANNED', desc: 'End-to-end extraction latency and clearinghouse throughput' },
      { name: 'Verification Reports', path: '/analytics/reports', tag: 'PLANNED', desc: 'Exportable pre-submission audit certificates' },
      { name: 'System Insights', path: '/analytics/insights', tag: 'PLANNED', desc: 'Provider documentation gap trends and recurring issues' },
    ]
  }
};

export default function Navigation() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); // 'live', 'offline', 'checking'
  
  const navRef = useRef(null);
  const menuRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Health check ping for real API status
  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const res = await fetch(`${API_BASE}/`, { method: 'GET' });
        if (isMounted) {
          setApiStatus(res.ok ? 'live' : 'offline');
        }
      } catch {
        if (isMounted) {
          setApiStatus('offline');
        }
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 2. Close menus on route change
  useEffect(() => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // 3. Outside click dismissal
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4. Keyboard Navigation (Escape to close, Arrow keys to navigate)
  const handleKeyDown = (e, key) => {
    if (e.key === 'Escape') {
      setOpenMenu(null);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpenMenu(key);
      const firstItem = menuRefs.current[`${key}-0`];
      if (firstItem) firstItem.focus();
    }
  };

  const handleItemKeyDown = (e, key, index, total) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % total;
      menuRefs.current[`${key}-${nextIndex}`]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + total) % total;
      menuRefs.current[`${key}-${prevIndex}`]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpenMenu(null);
      document.getElementById(`nav-btn-${key}`)?.focus();
    }
  };

  const toggleMenu = (key) => {
    setOpenMenu(prev => prev === key ? null : key);
  };

  return (
    <nav 
      ref={navRef}
      aria-label="Main Navigation"
      className="sticky top-[33px] z-40 bg-midnight/90 backdrop-blur-md border-b border-lavender-border font-body"
    >
      <div className="max-w-[1700px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-1.5 text-lavender-muted hover:text-lavender-highlight border border-lavender-border rounded-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <NavLink 
            to="/" 
            className="flex items-center gap-2 group focus:outline-none"
          >
            <span className="font-display font-bold text-base tracking-wider text-electric group-hover:text-electric transition-colors">
              CLAIM<span className="text-lavender-highlight">PILOT</span>
            </span>
          </NavLink>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          
          {/* OVERVIEW (Direct Link — No Dropdown) */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => `
              px-3.5 py-2 text-xs font-display font-medium uppercase tracking-[0.15em] transition-colors rounded-sm
              ${isActive 
                ? 'text-lavender-highlight border-b-2 border-electric' 
                : 'text-lavender-muted hover:text-lavender-highlight'}
            `}
          >
            OVERVIEW
          </NavLink>

          {/* Categorized Dropdown Menus */}
          {Object.entries(NAVIGATION_CONFIG).map(([key, config]) => {
            const isOpen = openMenu === key;
            const isCategoryActive = config.items.some(item => location.pathname === item.path);

            return (
              <div key={key} className="relative">
                <button
                  id={`nav-btn-${key}`}
                  onClick={() => toggleMenu(key)}
                  onKeyDown={(e) => handleKeyDown(e, key)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={`
                    px-3 py-2 text-xs font-display font-medium uppercase tracking-[0.15em] flex items-center gap-1.5 transition-colors rounded-sm focus:outline-none focus:ring-1 focus:ring-electric
                    ${isOpen || isCategoryActive
                      ? 'text-lavender-highlight' 
                      : 'text-lavender-muted hover:text-lavender-highlight'}
                  `}
                >
                  <span>{config.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-electric' : 'text-lavender-muted'}`} />
                </button>

                {/* Dropdown Panel */}
                {isOpen && (
                  <div
                    role="menu"
                    aria-label={`${config.label} menu`}
                    className="absolute left-0 top-full mt-2 w-84 sm:w-96 glass-dropdown rounded-sm p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="px-3 py-2 mb-2 border-b border-lavender-border">
                      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-lavender-muted">
                        {config.label}
                      </div>
                      <div className="text-[11px] text-lavender-muted font-body">
                        {config.description}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {config.items.map((item, idx) => {
                        const isItemActive = location.pathname === item.path;

                        return (
                          <button
                            key={item.path}
                            ref={el => menuRefs.current[`${key}-${idx}`] = el}
                            role="menuitem"
                            onClick={() => {
                              navigate(item.path);
                              setOpenMenu(null);
                            }}
                            onKeyDown={(e) => handleItemKeyDown(e, key, idx, config.items.length)}
                            className={`
                              w-full text-left p-2.5 rounded-sm flex items-start justify-between gap-3 transition-colors duration-150 group focus:outline-none focus:bg-lavender-faint
                              ${isItemActive 
                                ? 'bg-lavender-faint border-l-2 border-electric' 
                                : 'hover:bg-lavender-faint'}
                            `}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-display text-xs font-medium text-lavender-highlight group-hover:text-lavender-highlight transition-colors truncate">
                                  {item.name}
                                </span>
                              </div>
                              <p className="text-[11px] text-lavender-muted leading-tight font-body line-clamp-1">
                                {item.desc}
                              </p>
                            </div>

                            <PlannedBadge type={item.tag} className="shrink-0 mt-0.5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Real Backend Health Check Indicator */}
        <div className="flex items-center gap-3">
          <div 
            title={apiStatus === 'live' ? 'FastAPI Backend Online (200 OK)' : 'FastAPI Backend Unreachable'}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-sm border font-mono text-[11px] tracking-wider transition-colors ${
              apiStatus === 'live'
                ? 'bg-status-pass-bg text-status-pass-text border-status-pass-border'
                : 'bg-status-fail-bg text-status-fail-text border-status-fail-border'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'live' ? 'bg-status-pass-text' : 'bg-status-fail-text'}`} />
            <span>{apiStatus === 'live' ? 'API LIVE' : 'API OFFLINE'}</span>
          </div>
        </div>

      </div>

      {/* Mobile Drawer Navigation (<=1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-midnight border-b border-lavender-border p-6 space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-display font-bold uppercase tracking-wider text-lavender-highlight border-b border-lavender-border"
          >
            OVERVIEW
          </NavLink>

          {Object.entries(NAVIGATION_CONFIG).map(([key, config]) => {
            const isAccordionOpen = mobileAccordion === key;

            return (
              <div key={key} className="border-b border-lavender-border pb-3">
                <button
                  onClick={() => setMobileAccordion(prev => prev === key ? null : key)}
                  className="w-full flex items-center justify-between py-2 text-xs font-display font-semibold uppercase tracking-wider text-lavender-muted hover:text-lavender-highlight"
                >
                  <span>{config.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isAccordionOpen ? 'rotate-180 text-electric' : ''}`} />
                </button>

                {isAccordionOpen && (
                  <div className="pl-3 pt-2 space-y-2">
                    {config.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-1.5 text-xs text-lavender hover:text-lavender-highlight"
                      >
                        <span className="font-body">{item.name}</span>
                        <PlannedBadge type={item.tag} />
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
