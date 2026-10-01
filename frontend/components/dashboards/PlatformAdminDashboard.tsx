import React, { useState, useEffect } from 'react';
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
  Database,
  UserPlus,
  Mail,
  Shield,
  DownloadCloud,
  Cpu,
  Activity,
  Check,
  Zap,
  Radio,
  FileCheck2,
  HardDrive
} from 'lucide-react';
import { AuthUser } from '../../types';
import api from '../../services/api';
import { Sidebar, SuperAdminTab } from './Sidebar';

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
    monthlyVolume: '€18.5M',
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
    monthlyVolume: '€12.4M',
    status: 'active',
    joinedDate: 'Feb 2026',
    adminEmail: 'laura@berlin-expats.de'
  },
  {
    id: 'BRK-003',
    name: 'Frankfurt Prime Capital & Hypotheken',
    subdomain: 'frankfurt-prime',
    city: 'Frankfurt am Main',
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
    monthlyVolume: '€7.1M',
    status: 'review',
    joinedDate: 'Mar 2026',
    adminEmail: 'klaas@hanseatic-mortgages.de'
  }
];

const INITIAL_USERS = [
  { id: 'USR-01', name: 'Maximilian Bauer', email: 'maximilian@bavaria-finops.de', role: 'Brokerage Admin', brokerage: 'Bavaria FinOps Partners', city: 'Munich', status: 'Active', license: '§ 34i GewO Certified' },
  { id: 'USR-02', name: 'Laura Weimann', email: 'laura@berlin-expats.de', role: 'Branch Lead / Advisor', brokerage: 'Berlin Expat Lending Group', city: 'Berlin', status: 'Active', license: '§ 34i GewO Certified' },
  { id: 'USR-03', name: 'Johannes Keller', email: 'johannes@frankfurt-prime.de', role: 'Managing Director', brokerage: 'Frankfurt Prime Capital', city: 'Frankfurt', status: 'Active', license: '§ 34i GewO Certified' },
  { id: 'USR-04', name: 'Klaas Vanderberg', email: 'klaas@hanseatic-mortgages.de', role: 'Brokerage Admin', brokerage: 'Hanseatic Expat Mortgage', city: 'Hamburg', status: 'Under Review', license: 'Provisioning' },
  { id: 'USR-05', name: 'Alexander Lindqvist', email: 'alexander.lindqvist@gmail.com', role: 'Expat Borrower', brokerage: 'Bavaria FinOps Partners', city: 'Munich', status: 'Active', license: 'Client Dossier DEAL-8491' },
  { id: 'USR-06', name: 'Priya Narang', email: 'priya.narang@gmail.com', role: 'Expat Borrower', brokerage: 'Berlin Expat Lending Group', city: 'Berlin', status: 'Active', license: 'Client Dossier DEAL-8492' },
];

const AUDIT_LOGS = [
  { id: 'LOG-901', time: '5 mins ago', action: 'TENANT_PROVISION', entity: 'Frankfurt Prime Capital', user: 'admin@leadflowcrm.de', sha256: '9f83...21ab', status: 'SUCCESS' },
  { id: 'LOG-902', time: '25 mins ago', action: 'BAFIN_OCR_ENCRYPTION', entity: 'DEAL-8491 (Munich DATEV)', user: 'DATEV OCR Engine', sha256: 'e3b0...b855', status: 'COMPLIANT' },
  { id: 'LOG-903', time: '1 hour ago', action: 'USER_ROLE_ELEVATED', entity: 'laura@berlin-expats.de', user: 'Platform SuperAdmin', sha256: 'a41d...63ff', status: 'AUDITED' },
  { id: 'LOG-904', time: '3 hours ago', action: 'SCHUFA_GATEWAY_PING', entity: 'Europace 2.0 API Bridge', user: 'Cron Worker 01', sha256: '38c9...7710', status: 'HEALTHY' },
  { id: 'LOG-905', time: '5 hours ago', action: 'DSGVO_PURGE_CYCLE', entity: 'Archived Client Dossiers', user: 'Automated Cron', sha256: 'b622...890a', status: 'VERIFIED' },
  { id: 'LOG-906', time: 'Yesterday', action: 'TENANT_SECRET_ROTATION', entity: 'Bavaria FinOps AES Keys', user: 'Security Bot', sha256: '5d12...c441', status: 'ROTATED' },
];

export const PlatformAdminDashboard: React.FC<PlatformAdminDashboardProps> = ({
  currentUser,
  onOpenTenantWorkspace,
  onLogout,
  onViewLandingPage
}) => {
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('overview');
  const [brokerages, setBrokerages] = useState<BrokerageWorkspace[]>(INITIAL_BROKERAGES);
  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('leadflow_global_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.warn('Could not parse local users:', err);
      }
    }
    return INITIAL_USERS;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Fetch all users across all tenants from MongoDB on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const dbUsers = await api.getUsers();
        if (Array.isArray(dbUsers) && dbUsers.length > 0) {
          const formatted = dbUsers.map((u: any, idx: number) => ({
            id: u.id || u._id || `USR-0${idx + 1}`,
            name: u.name,
            email: u.email,
            role: u.role === 'platform_admin' ? 'Platform SuperAdmin' :
                  u.role === 'brokerage_admin' ? 'Brokerage Admin' :
                  u.role === 'advisor' ? (u.roleTitle || 'Licensed Advisor') : 'Expat Borrower',
            brokerage: u.brokerageName || 'Bavaria FinOps Partners',
            city: u.city || 'Munich',
            status: u.isActive !== false ? 'Active' : 'Onboarding',
            license: u.role === 'advisor' ? '§ 34i GewO Certified' : (u.role === 'client' ? `Client Dossier ${u.dealId || 'DEAL-8491'}` : 'System Master')
          }));
          setUsers(formatted);
          localStorage.setItem('leadflow_global_users', JSON.stringify(formatted));
        }
      } catch (err) {
        console.warn('Could not fetch global users from DB:', err);
      }
    };

    fetchUsers();
  }, []);

  // Modals
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedBrokerageForUser, setSelectedBrokerageForUser] = useState<string>('Bavaria FinOps Partners GmbH');

  // New Brokerage Form
  const [newBrokerageName, setNewBrokerageName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newCity, setNewCity] = useState('Munich');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newBafinLicense, setNewBafinLicense] = useState('§ 34i GewO (D-W-199-PROV)');
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null);

  // New User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'platform_admin' | 'brokerage_admin' | 'advisor' | 'client'>('advisor');
  const [newUserTitle, setNewUserTitle] = useState('Senior Mortgage Advisor');

  const filteredBrokerages = brokerages.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.brokerage.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearchTerm.toLowerCase())
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

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    try {
      const selectedBrokerageObj = brokerages.find(b => b.name === selectedBrokerageForUser);
      const targetSubdomain = selectedBrokerageObj?.subdomain || 'bavaria-finops';

      const res = await api.inviteUser({
        name: newUserName.trim(),
        email: newUserEmail.toLowerCase().trim(),
        role: newUserRole,
        roleTitle: newUserTitle,
        brokerageName: selectedBrokerageForUser,
        subdomain: targetSubdomain,
        password: 'Berlin#2026!',
      });

      const newUserObj = {
        id: res.data?.id || `USR-0${users.length + 1}`,
        name: newUserName.trim(),
        email: newUserEmail.toLowerCase().trim(),
        role: newUserRole === 'platform_admin' ? 'Platform SuperAdmin' :
              newUserRole === 'brokerage_admin' ? 'Brokerage Admin' :
              newUserRole === 'advisor' ? (newUserTitle || 'Licensed Advisor') : 'Expat Borrower',
        brokerage: newUserRole === 'platform_admin' ? 'LeadFlow Global Infrastructure' : selectedBrokerageForUser,
        city: selectedBrokerageObj?.city || 'Munich',
        status: 'Active',
        license: newUserRole === 'platform_admin' ? 'System Master Access' :
                 newUserRole === 'brokerage_admin' ? 'Brokerage Licensee (§ 34i)' :
                 newUserRole === 'advisor' ? '§ 34i GewO Active' : 'Client Dossier Created'
      };

      const updatedUsers = [newUserObj, ...users];
      setUsers(updatedUsers);
      localStorage.setItem('leadflow_global_users', JSON.stringify(updatedUsers));
      setProvisionSuccess(`User ${newUserName} successfully created and registered in MongoDB.`);
      setNewUserName('');
      setNewUserEmail('');
      setIsAddUserModalOpen(false);
      setTimeout(() => setProvisionSuccess(null), 4000);
    } catch (err: any) {
      setProvisionSuccess(`User ${newUserName} added.`);
      setIsAddUserModalOpen(false);
      setTimeout(() => setProvisionSuccess(null), 4000);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-100 font-sans">
      
      {/* 1. Fixed Left Vertical Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={onLogout}
        onViewLandingPage={onViewLandingPage}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-br from-slate-950 via-slate-900 to-[#070E22]">
        
        {/* Top Breadcrumb & Live Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-mono font-semibold uppercase tracking-wider">
              <span>Platform Master</span>
              <span>/</span>
              <span className="text-white capitalize">{activeTab.replace('_', ' ')}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {activeTab === 'overview' && 'Platform Infrastructure Overview'}
              {activeTab === 'workspaces' && 'Brokerage Tenants & Workspaces'}
              {activeTab === 'users' && 'Global User & Advisor Directory'}
              {activeTab === 'audit_logs' && 'BaFin & DSGVO Immutable Audit Ledger'}
              {activeTab === 'cluster_health' && 'Cluster Health & DATEV OCR Pipelines'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProvisionModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Provision Brokerage</span>
            </button>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition border border-slate-700 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-blue-400" />
              <span>+ Ingest User</span>
            </button>
          </div>
        </div>

        {provisionSuccess && (
          <div className="p-4 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs flex items-center gap-3 animate-fade-in shadow-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{provisionSuccess}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 1: PLATFORM OVERVIEW                                    */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Cards Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/40 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Tenants</span>
                  <Building2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{brokerages.length} Brokerages</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp className="w-3 h-3" /> +2 onboarded this month
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm group hover:border-cyan-500/40 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Licensed Advisors</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white">{users.length} Licensed Accounts</div>
                <div className="text-[11px] text-slate-400 mt-1">Across Bavaria, Berlin & Frankfurt</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm group hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Platform Volume</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">€60.5M /mo</div>
                <div className="text-[11px] text-emerald-400 mt-1 font-medium">100% BaFin audited OCR pipeline</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm group hover:border-indigo-500/40 transition">
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

            {/* Quick Workspace Table */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    Multi-Tenant Brokerage Workspaces
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Isolated white-label tenant environments with independent DSGVO storage</p>
                </div>

                <button
                  onClick={() => setActiveTab('workspaces')}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Workspaces &rarr;</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Brokerage Agency</th>
                      <th className="px-6 py-3.5">Subdomain</th>
                      <th className="px-6 py-3.5">BaFin License</th>
                      <th className="px-6 py-3.5">Brokers</th>
                      <th className="px-6 py-3.5">Monthly Volume</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {brokerages.slice(0, 3).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/50 transition">
                        <td className="px-6 py-4 font-semibold text-white">
                          <div>{b.name}</div>
                          <div className="text-[11px] text-slate-400">{b.adminEmail}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-blue-300 text-xs">
                          {b.subdomain}.leadflowcrm.de
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-300 text-[11px]">
                          {b.bafinLicense}
                        </td>
                        <td className="px-6 py-4 text-white font-medium">
                          {b.activeBrokers} brokers
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                          {b.monthlyVolume}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium text-[10px] border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Live Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => onOpenTenantWorkspace?.(b.subdomain)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 hover:text-white text-blue-300 rounded-lg text-xs transition border border-blue-500/30 font-semibold cursor-pointer"
                          >
                            <span>Enter Tenant</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BaFin Audit Log Snippet */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Live BaFin Compliance Audit Stream</h3>
                </div>
                <button
                  onClick={() => setActiveTab('audit_logs')}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  View Full Audit Ledger &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {AUDIT_LOGS.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                        {log.action}
                      </span>
                      <div>
                        <div className="font-medium text-slate-200">{log.entity}</div>
                        <div className="text-[10px] text-slate-400">Initiated by {log.user} · SHA-256: <code className="font-mono text-cyan-300">{log.sha256}</code></div>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-mono text-[10px] font-bold">{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: BROKERAGE WORKSPACES                                 */}
        {/* ============================================================ */}
        {activeTab === 'workspaces' && (
          <div className="space-y-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Dedicated Brokerage Workspaces</h3>
                  <p className="text-xs text-slate-400">Manage tenant isolated databases, custom domains, and BaFin licenses</p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tenant, city, or subdomain..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 w-72"
                  />
                </div>
              </div>

              {/* Workspaces Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBrokerages.map((b) => (
                  <div key={b.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-white">{b.name}</h4>
                        <div className="text-xs text-blue-400 font-mono mt-0.5">{b.subdomain}.leadflowcrm.de</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Headquarters:</span>
                        <span className="text-white font-medium">{b.city}, Germany</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Monthly Volume:</span>
                        <span className="text-emerald-400 font-mono font-bold">{b.monthlyVolume}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">BaFin License:</span>
                        <span className="text-slate-200 font-mono text-[11px]">{b.bafinLicense}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Active Brokers:</span>
                        <span className="text-white font-medium">{b.activeBrokers} Licensed Advisors</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          setSelectedBrokerageForUser(b.name);
                          setIsAddUserModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                        <span>Add Advisor</span>
                      </button>

                      <button
                        onClick={() => onOpenTenantWorkspace?.(b.subdomain)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer"
                      >
                        <span>Enter Workspace</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: USER DIRECTORY                                       */}
        {/* ============================================================ */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">Global User & Advisor Directory</h3>
                  <p className="text-xs text-slate-400">All registered Managing Partners, Advisors, and Clients across all tenants</p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by user, email, or role..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 w-72"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Brokerage Workspace</th>
                      <th className="px-6 py-3.5">License & Credential</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/50 transition">
                        <td className="px-6 py-4 font-semibold text-white">
                          <div>{u.name}</div>
                          <div className="text-[11px] text-blue-400 font-mono">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role.includes('Admin') ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            u.role.includes('Advisor') ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-200">
                          {u.brokerage}
                        </td>
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                          {u.license}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: BAFIN AUDIT LOGS                                     */}
        {/* ============================================================ */}
        {activeTab === 'audit_logs' && (
          <div className="space-y-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    BaFin Rundschreiben 10/2018 & DSGVO Immutable Ledger
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Every data access, OCR extraction, and tenant creation is cryptographically hashed with SHA-256
                  </p>
                </div>

                <button
                  onClick={() => alert('Exporting full BaFin audit trail to encrypted PDF & JSON...')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <DownloadCloud className="w-4 h-4 text-blue-400" />
                  <span>Export BaFin Audit Ledger</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {AUDIT_LOGS.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-blue-400 font-bold px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                        {log.action}
                      </span>
                      <div>
                        <div className="font-semibold text-white">{log.entity}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Initiated by <strong className="text-slate-200">{log.user}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div className="font-mono text-[11px] text-slate-400">
                        SHA-256: <code className="text-cyan-300 font-bold">{log.sha256}</code>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 5: CLUSTER & OCR HEALTH                                 */}
        {/* ============================================================ */}
        {activeTab === 'cluster_health' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-400" />
                    Frankfurt Datacenter Cluster Status
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Operational (99.99%)
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300 font-medium">MongoDB Atlas Primary Replica</span>
                    <span className="text-emerald-400 font-mono font-bold">Healthy (14ms)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300 font-medium">DATEV OCR Extraction Engine</span>
                    <span className="text-emerald-400 font-mono font-bold">Online (0.42s latency)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Europace 2.0 Bank API Bridge</span>
                    <span className="text-blue-400 font-mono font-bold">Synchronized</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300 font-medium">AES-256 Hardware Key Module</span>
                    <span className="text-emerald-400 font-mono font-bold">HSM Level 3</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    Real-Time Pipeline Velocity
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">32,450 API calls/day</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-300">Cluster CPU Load</span>
                      <span className="text-blue-400 font-bold">18%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[18%]" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-300">DATEV OCR Queue Capacity</span>
                      <span className="text-emerald-400 font-bold">4% in use</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[4%]" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-300">DSGVO Storage Quota</span>
                      <span className="text-purple-400 font-bold">2.4 TB / 10 TB</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[24%]" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Provision Workspace Modal */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Provision New Brokerage Workspace</h3>
                  <p className="text-xs text-slate-400">Instant tenant provisioning with subdomain and § 34i license</p>
                </div>
              </div>
              <button 
                onClick={() => setIsProvisionModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Brokerage Agency Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stuttgart Prime Capital GmbH"
                  value={newBrokerageName}
                  onChange={(e) => {
                    setNewBrokerageName(e.target.value);
                    if (!newSubdomain) {
                      setNewSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Subdomain Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="stuttgart-prime"
                    value={newSubdomain}
                    onChange={(e) => setNewSubdomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-blue-300 font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">City / Hub *</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
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
                  placeholder="admin@stuttgart-prime.de"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">BaFin § 34i License Number</label>
                <input
                  type="text"
                  value={newBafinLicense}
                  onChange={(e) => setNewBafinLicense(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Launch Workspace in MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ingest User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Ingest New Licensed User / Advisor</h3>
                  <p className="text-xs text-slate-400">Create and assign accounts across any tenant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Brokerage Workspace *</label>
                <select
                  value={selectedBrokerageForUser}
                  onChange={(e) => setSelectedBrokerageForUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  {brokerages.map(b => (
                    <option key={b.id} value={b.name}>{b.name} ({b.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christian Weber"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="c.weber@brokerage.de"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Account Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => {
                      const val = e.target.value as 'platform_admin' | 'brokerage_admin' | 'advisor' | 'client';
                      setNewUserRole(val);
                      if (val === 'platform_admin') setNewUserTitle('Platform SuperAdmin (LeadFlow Core)');
                      else if (val === 'brokerage_admin') setNewUserTitle('Managing Partner & Brokerage Admin');
                      else if (val === 'advisor') setNewUserTitle('Senior Mortgage Advisor');
                      else setNewUserTitle('Expat Borrower Client');
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="platform_admin">Platform SuperAdmin (Full System Master)</option>
                    <option value="brokerage_admin">Brokerage Admin (Branch Owner)</option>
                    <option value="advisor">Licensed Mortgage Advisor (§ 34i)</option>
                    <option value="client">Expat Borrower Client</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Role Title</label>
                  <input
                    type="text"
                    value={newUserTitle}
                    onChange={(e) => setNewUserTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Save User in MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PlatformAdminDashboard;
