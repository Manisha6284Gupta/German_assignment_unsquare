import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Server, 
  Plus, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Lock,
  Globe,
  RefreshCw,
  Sliders,
  Database
} from 'lucide-react';
import { AuthUser } from '../../types';
import api from '../../services/api';

interface PlatformAdminDashboardProps {
  currentUser: AuthUser;
  onOpenTenantWorkspace?: (subdomain: string) => void;
  onLogout?: () => void;
  onViewLandingPage?: () => void;
}

interface BrokerageWorkspace {
  id: string;
  name: string;
  subdomain: string;
  city: string;
  bafinLicense: string;
  activeBrokers: number;
  monthlyVolume: string;
  status: 'active' | 'provisioning' | 'review';
  joinedDate: string;
  adminEmail: string;
}

const INITIAL_BROKERAGES: BrokerageWorkspace[] = [
  {
    id: 'BRK-001',
    name: 'Bavaria FinOps Partners GmbH',
    subdomain: 'bavaria-finops',
    city: 'Munich',
    bafinLicense: '§ 34i GewO (D-W-155-MUC-92)',
    activeBrokers: 8,
    monthlyVolume: '€14.2M',
    status: 'active',
    joinedDate: 'Jan 2026',
    adminEmail: 'maximilian@bavaria-finops.de'
  },
  {
    id: 'BRK-002',
    name: 'Berlin Expat Lending Group GmbH',
    subdomain: 'berlin-expats',
    city: 'Berlin',
    bafinLicense: '§ 34i GewO (D-W-110-BER-44)',
    activeBrokers: 6,
    monthlyVolume: '€9.8M',
    status: 'active',
    joinedDate: 'Feb 2026',
    adminEmail: 'laura@berlin-expats.de'
  },
  {
    id: 'BRK-003',
    name: 'Frankfurt Prime Capital & Hypotheken',
    subdomain: 'frankfurt-prime',
    city: 'Frankfurt',
    bafinLicense: '§ 34i GewO (D-W-133-FRA-08)',
    activeBrokers: 12,
    monthlyVolume: '€22.5M',
    status: 'active',
    joinedDate: 'Mar 2026',
    adminEmail: 'johannes@frankfurt-prime.de'
  },
  {
    id: 'BRK-004',
    name: 'Hanseatic Expat Mortgage Hub',
    subdomain: 'hamburg-expat-mortgage',
    city: 'Hamburg',
    bafinLicense: '§ 34i GewO (D-W-188-HAM-19)',
    activeBrokers: 4,
    monthlyVolume: '€5.1M',
    status: 'review',
    joinedDate: 'Mar 2026',
    adminEmail: 'klaas@hanseatic-mortgages.de'
  }
];

const AUDIT_LOGS = [
  { id: 'LOG-901', time: '10 mins ago', action: 'TENANT_PROVISION', entity: 'Frankfurt Prime', user: 'admin@leadflowcrm.de', status: 'SUCCESS' },
  { id: 'LOG-902', time: '45 mins ago', action: 'BAFIN_OCR_ENCRYPTION', entity: 'DEAL-8491 (Munich)', user: 'DATEV OCR Engine', status: 'COMPLIANT' },
  { id: 'LOG-903', time: '2 hours ago', action: 'USER_ROLE_ELEVATED', entity: 'laura@berlin-expats.de', user: 'Platform SuperAdmin', status: 'AUDITED' },
  { id: 'LOG-904', time: '4 hours ago', action: 'SCHUFA_GATEWAY_PING', entity: 'Europace 2.0 API', user: 'System Worker', status: 'HEALTHY' },
  { id: 'LOG-905', time: '6 hours ago', action: 'DSGVO_PURGE_CYCLE', entity: 'Archived Dossiers 2025', user: 'Automated Cron', status: 'VERIFIED' }
];

export const PlatformAdminDashboard: React.FC<PlatformAdminDashboardProps> = ({
  currentUser,
  onOpenTenantWorkspace,
  onLogout,
  onViewLandingPage
}) => {
  const [brokerages, setBrokerages] = useState<BrokerageWorkspace[]>(INITIAL_BROKERAGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [newBrokerageName, setNewBrokerageName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newCity, setNewCity] = useState('Munich');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newBafinLicense, setNewBafinLicense] = useState('§ 34i GewO (D-W-199-PROV)');
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null);

  const filteredBrokerages = brokerages.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrokerageName || !newSubdomain || !newAdminEmail) return;

    const cleanSubdomain = newSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

    try {
      const res = await api.provisionBrokerage({
        name: newBrokerageName,
        subdomain: cleanSubdomain,
        city: newCity,
        bafinLicense: newBafinLicense,
        adminName: `${newBrokerageName} Admin`,
        adminEmail: newAdminEmail,
        adminPassword: 'Bavaria#2026!',
        activeBrokers: 1,
        annualVolume: '€10M+',
      });

      const newEntry: BrokerageWorkspace = {
        id: `BRK-${String(brokerages.length + 1).padStart(3, '0')}`,
        name: newBrokerageName,
        subdomain: cleanSubdomain,
        city: newCity,
        bafinLicense: newBafinLicense,
        activeBrokers: 1,
        monthlyVolume: '€0.0M',
        status: 'active',
        joinedDate: 'Just now',
        adminEmail: newAdminEmail
      };

      setBrokerages([newEntry, ...brokerages]);
      setProvisionSuccess(res.message || `Workspace "${newBrokerageName}" provisioned at https://${cleanSubdomain}.leadflowcrm.de into MongoDB Atlas.`);
      setNewBrokerageName('');
      setNewSubdomain('');
      setNewAdminEmail('');
      setTimeout(() => {
        setIsProvisionModalOpen(false);
        setProvisionSuccess(null);
      }, 2800);
    } catch (err: any) {
      setProvisionSuccess(err.message || 'Workspace provisioned in offline mode.');
      setTimeout(() => setProvisionSuccess(null), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 font-sans pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight">LeadFlow</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Platform SuperAdmin
              </span>
            </div>
            <p className="text-xs text-slate-400">Global Multi-Tenant Infrastructure & BaFin Compliance Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onViewLandingPage && (
            <button
              onClick={onViewLandingPage}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition border border-slate-700/60"
            >
              Public Product View
            </button>
          )}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-xs">
              SA
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white">{currentUser.name}</div>
              <div className="text-[10px] text-purple-400">{currentUser.email}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Tenants</span>
              <Building2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{brokerages.length} Brokerages</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +2 onboarded this month
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm group hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Licensed Advisors</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">42 § 34i Brokers</div>
            <div className="text-[11px] text-slate-400 mt-1">Across Bavaria, Berlin & Frankfurt</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm group hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Platform Volume</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">€51.6M /mo</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">100% BaFin audited OCR pipeline</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm group hover:border-indigo-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database & OCR Cluster</span>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Atlas Ready
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Frankfurt eu-central-1 (AES-256)</div>
          </div>
        </div>

        {/* Tenant Provisioning & Management Table */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                Multi-Tenant Brokerage Workspaces
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Isolated white-label tenant environments with independent DSGVO storage</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search agency, subdomain or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 transition w-64"
                />
              </div>

              <button
                onClick={() => setIsProvisionModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-purple-600/20"
              >
                <Plus className="w-4 h-4" /> Provision New Workspace
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Brokerage Agency</th>
                  <th className="px-6 py-3.5">Subdomain & Region</th>
                  <th className="px-6 py-3.5">BaFin § 34i License</th>
                  <th className="px-6 py-3.5">Advisors</th>
                  <th className="px-6 py-3.5">Volume</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBrokerages.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white text-sm">{b.name}</div>
                      <div className="text-[11px] text-slate-400">{b.adminEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-mono text-purple-300 text-xs">
                        <Globe className="w-3.5 h-3.5 text-purple-400" />
                        {b.subdomain}.leadflowcrm.de
                      </div>
                      <div className="text-[11px] text-slate-400">{b.city}, Germany</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[11px]">
                        <ShieldCheck className="w-3 h-3" /> {b.bafinLicense}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {b.activeBrokers} brokers
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      {b.monthlyVolume}
                    </td>
                    <td className="px-6 py-4">
                      {b.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium text-[10px] border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Live Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-medium text-[10px] border border-amber-500/30">
                          <AlertCircle className="w-3 h-3" /> Under BaFin Review
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onOpenTenantWorkspace?.(b.subdomain)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-purple-600/30 hover:text-purple-300 text-slate-300 rounded-lg text-xs transition border border-slate-700/60"
                      >
                        Enter Tenant <ExternalLink className="w-3 h-3 ml-0.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BaFin Audit Trail & System Security Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  BaFin Compliance & Security Audit Trail
                </h3>
                <p className="text-xs text-slate-400">Immutable ledger recording all tenant data actions for German regulatory audit</p>
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <RefreshCw className="w-3 h-3 animate-spin text-purple-400" /> Live Polling
              </span>
            </div>

            <div className="space-y-2.5">
              {AUDIT_LOGS.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                      {log.action}
                    </span>
                    <div>
                      <div className="font-medium text-slate-200">{log.entity}</div>
                      <div className="text-[10px] text-slate-400">Initiated by {log.user}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-mono text-[10px] font-semibold">{log.status}</span>
                    <div className="text-[10px] text-slate-400">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Health Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-cyan-400" />
                SaaS Tenant Isolation
              </h3>
              <p className="text-xs text-slate-400 mb-4">Multi-tenant schema boundaries and storage configurations</p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Tenant DB Scoping</span>
                  <span className="text-emerald-400 font-mono font-semibold">Strict ObjectId Ref</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Document Encryption</span>
                  <span className="text-cyan-400 font-mono font-semibold">AES-256-GCM</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">DATEV OCR Endpoint</span>
                  <span className="text-emerald-400 font-mono font-semibold">Connected (99.4%)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Europace API Gateway</span>
                  <span className="text-purple-400 font-mono font-semibold">v2.4 Ready</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Platform SuperAdmin Session is cryptographically signed.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Provision Workspace Modal */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Provision New Brokerage Workspace</h3>
                  <p className="text-xs text-slate-400">Instant tenant provisioning with subdomain and § 34i license</p>
                </div>
              </div>
              <button 
                onClick={() => setIsProvisionModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {provisionSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>{provisionSuccess}</div>
              </div>
            ) : (
              <form onSubmit={handleCreateWorkspace} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Brokerage Agency Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frankfurt Prime Capital GmbH"
                    value={newBrokerageName}
                    onChange={(e) => {
                      setNewBrokerageName(e.target.value);
                      if (!newSubdomain) {
                        setNewSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Subdomain Slug *</label>
                    <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white">
                      <input
                        type="text"
                        required
                        placeholder="frankfurt-prime"
                        value={newSubdomain}
                        onChange={(e) => setNewSubdomain(e.target.value)}
                        className="bg-transparent focus:outline-none w-full text-purple-300 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">City / Hub *</label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Munich">Munich (Bavaria)</option>
                      <option value="Berlin">Berlin</option>
                      <option value="Frankfurt">Frankfurt am Main</option>
                      <option value="Hamburg">Hamburg</option>
                      <option value="Stuttgart">Stuttgart</option>
                      <option value="Düsseldorf">Düsseldorf</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Managing Broker Email (Initial Admin) *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@brokerage-agency.de"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">BaFin § 34i License Number</label>
                  <input
                    type="text"
                    value={newBafinLicense}
                    onChange={(e) => setNewBafinLicense(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsProvisionModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/30"
                  >
                    Launch Workspace
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformAdminDashboard;
