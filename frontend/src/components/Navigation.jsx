import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles, 
  FileCheck2, 
  ShieldAlert, 
  Database, 
  FileText, 
  BarChart3, 
  Layers,
  ArrowRight,
  ExternalLink,
  Cpu,
  Bell,
  User,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  LogOut
} from 'lucide-react';
import PlannedBadge from './ui/PlannedBadge';
import Button from './ui/Button';
import { useClaim } from '../context/ClaimContext';

export const MENU_CONFIG = {
  CLAIMS: {
    label: 'CLAIMS',
    description: 'Claim validation pipeline & case reviews',
    items: [
      { name: 'All Claims & Analysis', path: '/claims/analysis', tag: 'LIVE', desc: 'Core pre-submission validation on synthetic claim SYN-0001' },
      { name: 'Create New Claim', path: '/claims/new', tag: 'PLANNED', desc: 'Pre-admission authorization and reimbursement claim intake' },
      { name: 'Pending Claims', path: '/claims/pending', tag: 'PLANNED', desc: 'Claims pending documentation or clinical clarification' },
      { name: 'Processed Claims', path: '/claims/processed', tag: 'PLANNED', desc: 'Historical claims validated and formatted for submission' },
      { name: 'Claims Awaiting Review', path: '/claims/review', tag: 'PLANNED', desc: 'Discrepant claims flagged for human medical auditor' },
    ]
  },
  DOCUMENTS: {
    label: 'DOCUMENTS',
    description: 'Clinical evidence & source text management',
    items: [
      { name: 'Source Documents', path: '/documents/sources', tag: 'LIVE', desc: 'Inspect bundled synthetic PDFs and full page plain text' },
      { name: 'Extracted Information', path: '/documents/extracted', tag: 'LIVE', desc: 'Field-level values, citations and confidence ratings' },
      { name: 'Evidence Traceability', path: '/documents/traceability', tag: 'LIVE', desc: 'Verbatim snippet tracking and signals validation' },
      { name: 'Upload Documents', path: '/documents/upload', tag: 'LIVE (Demo)', desc: 'Interactive drag-and-drop document intake and scanning simulator' },
      { name: 'Document Processing', path: '/documents/processing', tag: 'PLANNED', desc: 'Real-time text normalization and OCR extraction status' },
    ]
  },
  'AI INTELLIGENCE': {
    label: 'AI INTELLIGENCE',
    description: 'Extraction architecture & contradictory signal logic',
    items: [
      { name: 'Medical Data Extraction', path: '/intelligence/method', tag: 'LIVE', desc: 'Regex engine overview with future LLM agent roadmap' },
      { name: 'Contradiction Detection', path: '/intelligence/contradictions', tag: 'LIVE', desc: 'Automated cross-document date and value conflict alerts' },
      { name: 'AI Document Analysis', path: '/intelligence/llm-analysis', tag: 'LIVE (Demo)', desc: 'Inspection of multi-stage extraction and signal reasoning' },
      { name: 'AI Processing History', path: '/intelligence/history', tag: 'PLANNED', desc: 'Extraction confidence metrics and retry logs' },
    ]
  },
  VERIFICATION: {
    label: 'VERIFICATION',
    description: 'Deterministic rules & clinical code validation',
    items: [
      { name: 'Rule Validation', path: '/verification/rules', tag: 'SIMULATED', desc: 'Execution results for DOC-04, DATE-01, XDOC-01' },
      { name: 'ICD-10 Validity', path: '/verification/icd10', tag: 'SIMULATED', desc: 'Diagnosis code catalog lookup (ICD-01 simulated rule)' },
      { name: 'Policy Compliance', path: '/verification/policy', tag: 'LIVE (Demo)', desc: 'Inspection of hospital stay clauses and admission requirements' },
      { name: 'Human Review', path: '/verification/human-review', tag: 'LIVE (Audit)', desc: 'Medical auditor sign-off and reconciliation console' },
    ]
  },
  ANALYTICS: {
    label: 'ANALYTICS',
    description: 'Real-time statistics & validation telemetry',
    items: [
      { name: 'Claim Statistics', path: '/analytics/statistics', tag: 'LIVE', desc: 'Live computation of fields, rules, and confidence metrics' },
      { name: 'Processing Performance', path: '/analytics/performance', tag: 'PLANNED', desc: 'End-to-end extraction latency and throughput charts' },
      { name: 'Verification Reports', path: '/analytics/reports', tag: 'PLANNED', desc: 'Exportable pre-submission audit certificates' },
      { name: 'System Insights', path: '/analytics/insights', tag: 'PLANNED', desc: 'Error categorization and provider documentation trends' },
    ]
  }
};

export default function Navigation() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data } = useClaim();
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
    setSettingsOpen(false);
  }, [location.pathname]);

  // Handle outside click & Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
        setNotificationsOpen(false);
        setProfileOpen(false);
        setSettingsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileMenuOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleMenu = (key) => {
    setOpenMenu(openMenu === key ? null : key);
    setNotificationsOpen(false);
    setProfileOpen(false);
    setSettingsOpen(false);
  };

  // Derive notifications from active claim state
  const notifications = [
    {
      id: 1,
      title: 'Cross-Document Conflict Detected',
      message: 'Discharge date differs between discharge summary (08 March 2026) and claim form (09 March 2026).',
      type: 'conflict',
      time: 'Real-time',
      link: '/claims/analysis',
    },
    {
      id: 2,
      title: 'Documentation Gap: DOC-04 Missing',
      message: 'No admission note found in uploaded package. Upload required before claim submission.',
      type: 'missing',
      time: 'Real-time',
      link: '/verification/rules',
    },
    {
      id: 3,
      title: 'Diagnosis Code Verified',
      message: 'ICD-10 code K35.80 confirmed in sample reference catalog.',
      type: 'pass',
      time: 'Verified',
      link: '/verification/icd10',
    }
  ];

  return (
    <nav ref={navRef} className="relative z-40 bg-midnight/85 backdrop-blur-xl border-b border-electric/20 select-none">
      <div className="max-w-[1700px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LEFT: Futuristic Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-electric"
        >
          <div className="w-8 h-8 rounded-lg bg-deepblack border border-electric/40 flex items-center justify-center relative overflow-hidden group-hover:border-electric-glow transition-all shadow-glow-sm">
            <span className="w-2.5 h-2.5 bg-electric-glow rounded-sm rotate-45 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tr from-electric/20 to-transparent pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-heading font-black tracking-wider text-white group-hover:text-electric-glow transition-colors">
              CLAIM<span className="text-electric-light">PILOT</span>
            </span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-lavender-dim uppercase -mt-0.5">
              Medical Intelligence
            </span>
          </div>
        </NavLink>

        {/* CENTER: Horizontal Navigation Bar */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Direct link for OVERVIEW */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => `
              px-3.5 py-1.5 text-xs font-mono uppercase tracking-widest transition-all rounded-md flex items-center gap-1.5
              ${isActive ? 'text-white bg-electric/20 border border-electric/40 shadow-glow-sm' : 'text-lavender hover:text-white hover:bg-white/5'}
            `}
          >
            OVERVIEW
          </NavLink>

          {/* Dropdown triggers */}
          {Object.entries(MENU_CONFIG).map(([key, config]) => {
            const isOpen = openMenu === key;
            const isChildActive = config.items.some(item => location.pathname === item.path);

            return (
              <div key={key} className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu(key)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={`
                    px-3.5 py-1.5 text-xs font-mono uppercase tracking-widest transition-all rounded-md flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-electric
                    ${isOpen ? 'text-white bg-electric/25 border border-electric/50 shadow-glow-sm' : ''}
                    ${!isOpen && isChildActive ? 'text-electric-glow font-semibold border-b border-electric-light' : ''}
                    ${!isOpen && !isChildActive ? 'text-lavender hover:text-white hover:bg-white/5' : ''}
                  `}
                >
                  <span>{config.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 text-electric-light ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Notifications, Profile, Settings */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setOpenMenu(null);
                setProfileOpen(false);
                setSettingsOpen(false);
              }}
              className="p-2 rounded-lg bg-deepblack/70 border border-electric/30 hover:border-electric-light text-lavender hover:text-white transition relative focus:outline-none"
              title="Audit Notifications"
            >
              <Bell className="w-4 h-4 text-electric-light" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Notifications Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 glass-mega-menu rounded-2xl p-4 shadow-glow-md animate-fadeIn z-50">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-electric/20">
                  <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                    Pipeline Telemetry
                  </span>
                  <span className="text-[10px] font-mono text-electric-light px-1.5 py-0.5 rounded bg-electric/20">
                    2 Action Items
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        navigate(n.link);
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-deepblack/80 border border-white/5 hover:border-electric/40 cursor-pointer transition text-xs font-mono"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-[11px] ${
                          n.type === 'conflict' ? 'text-purple-300' :
                          n.type === 'missing' ? 'text-amber-300' : 'text-emerald-300'
                        }`}>
                          {n.title}
                        </span>
                        <span className="text-[9px] text-lavender-dim">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-lavender-dim line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setOpenMenu(null);
                setNotificationsOpen(false);
                setSettingsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-deepblack/70 border border-electric/30 hover:border-electric-light text-xs font-mono transition focus:outline-none"
            >
              <div className="w-5 h-5 rounded-full bg-electric/30 border border-electric-light flex items-center justify-center text-electric-glow">
                <User className="w-3 h-3" />
              </div>
              <span className="text-white font-semibold">Dr. Auditor</span>
              <ChevronDown className="w-3 h-3 text-lavender-dim" />
            </button>

            {/* Profile Dropdown Panel */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 glass-mega-menu rounded-2xl p-4 shadow-glow-md animate-fadeIn z-50 font-mono text-xs">
                <div className="pb-3 border-b border-electric/20 mb-3">
                  <span className="text-white font-bold block text-sm">Dr. A. Kumar</span>
                  <span className="text-[10px] text-electric-light uppercase tracking-wider block">
                    Chief Claims Adjudicator
                  </span>
                  <span className="text-[10px] text-lavender-dim mt-1 block">
                    Session: Synthetic PoW Environment
                  </span>
                </div>

                <div className="space-y-2 text-[11px] text-lavender">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-lavender-dim">Assigned Claim:</span>
                    <span className="text-white font-bold">SYN-0001</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-lavender-dim">Decision Authority:</span>
                    <span className="text-emerald-400 font-bold">Human Verified</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate('/verification/human-review');
                    setProfileOpen(false);
                  }}
                  className="w-full mt-3 py-1.5 rounded-lg bg-electric/20 hover:bg-electric/30 text-white text-[11px] font-bold border border-electric/40 transition"
                >
                  Open Auditor Queue &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <div className="relative">
            <button
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setOpenMenu(null);
                setNotificationsOpen(false);
                setProfileOpen(false);
              }}
              className="p-2 rounded-lg bg-deepblack/70 border border-electric/30 hover:border-electric-light text-lavender hover:text-white transition focus:outline-none"
              title="System Settings"
            >
              <Settings className="w-4 h-4 text-electric-light" />
            </button>

            {/* Settings Dropdown Panel */}
            {settingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 glass-mega-menu rounded-2xl p-4 shadow-glow-md animate-fadeIn z-50 font-mono text-xs">
                <div className="pb-2 border-b border-electric/20 mb-3 flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                    Console Settings
                  </span>
                  <Sliders className="w-3.5 h-3.5 text-electric-light" />
                </div>

                <div className="space-y-3 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-lavender">Holographic 3D:</span>
                    <span className="text-emerald-400 font-bold">WebGL Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lavender">Deterministic Rules:</span>
                    <span className="text-electric-glow font-bold">Enforced</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lavender">Backend Host:</span>
                    <span className="text-lavender-dim">127.0.0.1:8000</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-lavender hover:text-white hover:bg-white/5 border border-electric/30 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-electric-light" /> : <Menu className="w-5 h-5 text-electric-light" />}
          </button>
        </div>

      </div>

      {/* DROPDOWN / MEGA-MENU PANEL (Desktop) */}
      {openMenu && (
        <div className="hidden lg:block absolute top-full left-0 w-full glass-mega-menu animate-fadeIn">
          <div className="max-w-[1700px] mx-auto p-8 grid grid-cols-12 gap-8">
            
            {/* Left Context Column */}
            <div className="col-span-3 border-r border-electric/20 pr-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-electric-light font-bold block mb-1">
                SYSTEM MODULE
              </span>
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                {MENU_CONFIG[openMenu]?.label}
              </h3>
              <p className="text-xs text-lavender-dim leading-relaxed mb-6">
                {MENU_CONFIG[openMenu]?.description}
              </p>

              <div className="p-3 rounded-xl bg-deepblack/60 border border-electric/20 text-[11px] font-mono text-lavender-dim">
                <span className="text-electric-glow font-semibold block mb-1">PROTOTYPE CONTRACT</span>
                <span>Active demonstration dataset uses synthetic patient Ravi Kumar (SYN-0001).</span>
              </div>
            </div>

            {/* Right Items Grid */}
            <div className="col-span-9 grid grid-cols-2 gap-4">
              {MENU_CONFIG[openMenu]?.items.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => setOpenMenu(null)}
                  className={({ isActive }) => `
                    p-4 rounded-xl border transition-all duration-200 group flex flex-col justify-between
                    ${isActive 
                      ? 'bg-electric/20 border-electric-light shadow-glow-sm text-white' 
                      : 'bg-deepblack/50 border-white/5 hover:border-electric/50 hover:bg-electric/10'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-sm font-bold text-white group-hover:text-electric-glow transition-colors">
                      {item.name}
                    </span>
                    <PlannedBadge type={item.tag} />
                  </div>
                  <p className="text-xs text-lavender-dim group-hover:text-lavender-light/90 leading-relaxed transition-colors">
                    {item.desc}
                  </p>
                </NavLink>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* MOBILE FULL-SCREEN NAVIGATION PANEL */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-midnight/98 backdrop-blur-2xl p-6 overflow-y-auto border-t border-electric/20">
          <div className="flex flex-col gap-6">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-mono uppercase tracking-widest text-white py-2 border-b border-lavender-dim/10"
            >
              OVERVIEW
            </NavLink>

            {Object.entries(MENU_CONFIG).map(([key, config]) => (
              <div key={key} className="flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-electric-light font-bold">
                  {config.label}
                </span>
                <div className="flex flex-col gap-1.5 pl-2">
                  {config.items.map((item, idx) => (
                    <NavLink
                      key={idx}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 px-3 rounded-lg bg-deepblack/60 border border-white/5 flex items-center justify-between text-xs font-mono text-lavender hover:text-white"
                    >
                      <span>{item.name}</span>
                      <PlannedBadge type={item.tag} />
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Background Dim Backdrop when Mega Menu is Open */}
      {openMenu && (
        <div 
          onClick={() => setOpenMenu(null)}
          className="fixed inset-0 top-[88px] bg-black/60 backdrop-blur-[2px] z-[-1]" 
        />
      )}
    </nav>
  );
}
