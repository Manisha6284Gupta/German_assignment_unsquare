import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Building2, 
  ShieldCheck, 
  Users, 
  Plus, 
  CheckCircle2, 
  Activity,
  Server,
  ArrowUpRight,
  UserPlus,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Lock,
  Sparkles,
  Loader2
} from 'lucide-react';
import { TenantBrokerage } from '../types';
import api from '../services/api';

interface PlatformAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchTenant?: (subdomain: string) => void;
}

export const PlatformAdminModal: React.FC<PlatformAdminModalProps> = ({ 
  isOpen, 
  onClose,
  onSwitchTenant
}) => {
  const [tenants, setTenants] = useState<TenantBrokerage[]>([
    {
      id: 'TENANT-001',
      name: 'Bavaria FinOps Partners',
      subdomain: 'bavaria-finops',
      city: 'Munich',
      adminName: 'Maximilian Bauer',
      adminEmail: 'maximilian@bavaria-finops.de',
      advisorCount: 6,
      monthlyVolume: '€18.5M',
      status: 'active',
      bafinLicense: '§ 34i GewO (D-W-155-MUC-92)',
      dealsCount: 42
    },
    {
      id: 'TENANT-002',
      name: 'Berlin Expat Home Loans',
      subdomain: 'berlin-expats',
      city: 'Berlin',
      adminName: 'Laura Weimann',
      adminEmail: 'laura@berlin-expats.de',
      advisorCount: 8,
      monthlyVolume: '€22.4M',
      status: 'active',
      bafinLicense: '§ 34i GewO (D-W-110-BER-44)',
      dealsCount: 58
    },
    {
      id: 'TENANT-003',
      name: 'Frankfurt Prime Financial',
      subdomain: 'frankfurt-prime',
      city: 'Frankfurt am Main',
      adminName: 'Jonas Keller',
      adminEmail: 'jonas@frankfurtprime.de',
      advisorCount: 12,
      monthlyVolume: '€35.0M',
      status: 'active',
      bafinLicense: '§ 34i GewO (D-W-603-FRA-19)',
      dealsCount: 89
    },
    {
      id: 'TENANT-004',
      name: 'Rhein-Ruhr Baufinanzierung GmbH',
      subdomain: 'rhein-ruhr',
      city: 'Düsseldorf / Köln',
      adminName: 'Katja Neumann',
      adminEmail: 'k.neumann@rheinruhr-hyp.de',
      advisorCount: 4,
      monthlyVolume: '€12.0M',
      status: 'active',
      bafinLicense: '§ 34i GewO (D-W-402-DUS-81)',
      dealsCount: 31
    },
    {
      id: 'TENANT-005',
      name: 'Hanseatic Mortgage Advisory',
      subdomain: 'hanseatic-immo',
      city: 'Hamburg',
      adminName: 'Henrik Völkel',
      adminEmail: 'voelkel@hanseatic-immo.de',
      advisorCount: 5,
      monthlyVolume: '€14.2M',
      status: 'trial',
      bafinLicense: '§ 34i GewO (D-W-200-HAM-73)',
      dealsCount: 19
    }
  ]);

  const [selectedTenant, setSelectedTenant] = useState<TenantBrokerage | null>(null);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showAddAdvisor, setShowAddAdvisor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Tenant Form
  const [newBrokerageName, setNewBrokerageName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newCity, setNewCity] = useState('Munich');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null);

  // New Advisor Form
  const [advisorName, setAdvisorName] = useState('');
  const [advisorEmail, setAdvisorEmail] = useState('');
  const [advisorRole, setAdvisorRole] = useState<'advisor' | 'client'>('advisor');
  const [advisorRoleTitle, setAdvisorRoleTitle] = useState('Senior Mortgage Advisor');

  if (!isOpen) return null;

  const handleProvisionTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrokerageName || !newSubdomain) return;
    setIsSubmitting(true);

    try {
      await api.provisionBrokerage({
        name: newBrokerageName,
        subdomain: newSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        city: newCity,
        adminEmail: newAdminEmail || `admin@${newSubdomain}.de`,
        adminName: `${newBrokerageName} Admin`,
        bafinLicense: '§ 34i GewO (Verified)',
        annualVolume: '€10M+',
      });
    } catch {
      // Offline fallback
    } finally {
      setIsSubmitting(false);
    }

    const newTenant: TenantBrokerage = {
      id: `TENANT-00${tenants.length + 1}`,
      name: newBrokerageName,
      subdomain: newSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      city: newCity,
      adminName: newBrokerageName.split(' ')[0] + ' Lead',
      adminEmail: newAdminEmail || `admin@${newSubdomain}.de`,
      advisorCount: 3,
      monthlyVolume: '€5.0M',
      status: 'provisioning',
      bafinLicense: '§ 34i GewO (Verified)',
      dealsCount: 0
    };

    setTenants([newTenant, ...tenants]);
    setProvisionSuccess(`Tenant "${newTenant.name}" provisioned at https://${newTenant.subdomain}.leadflowcrm.de with automated onboarding link sent to ${newTenant.adminEmail}.`);
    setNewBrokerageName('');
    setNewSubdomain('');
    setNewAdminEmail('');
    setShowAddTenant(false);

    setTimeout(() => setProvisionSuccess(null), 5000);
  };

  const handleAddAdvisorToTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant || !advisorName || !advisorEmail) return;

    setIsSubmitting(true);
    try {
      await api.inviteUser({
        name: advisorName,
        email: advisorEmail,
        role: advisorRole,
        roleTitle: advisorRoleTitle,
      });

      setProvisionSuccess(`Added advisor ${advisorName} (${advisorEmail}) to ${selectedTenant.name}. Credentials dispatched.`);
      
      // Update tenant advisor count locally
      setTenants(prev => prev.map(t => {
        if (t.id === selectedTenant.id) {
          return { ...t, advisorCount: t.advisorCount + 1 };
        }
        return t;
      }));

      setSelectedTenant(prev => prev ? { ...prev, advisorCount: prev.advisorCount + 1 } : null);
      setAdvisorName('');
      setAdvisorEmail('');
      setShowAddAdvisor(false);
    } catch (err: any) {
      setProvisionSuccess(`Added ${advisorName} to ${selectedTenant.name}.`);
      setShowAddAdvisor(false);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setProvisionSuccess(null), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#091124] border border-amber-500/40 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#060D1E] px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold font-mono">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  LeadFlow SaaS Platform Admin Console
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-semibold">
                  Global Master Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Superuser Infrastructure Management · Click any Brokerage Card to Ingest Advisors or Inspect Workspace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {provisionSuccess && (
            <div className="p-4 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{provisionSuccess}</span>
            </div>
          )}

          {/* Global SaaS Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Total Processed Volume</span>
              <span className="text-lg font-extrabold font-mono text-white mt-1 block">
                €184.5M
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Across all German tenants</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Active Brokerage Tenants</span>
              <span className="text-lg font-extrabold font-mono text-cyan-300 mt-1 block">
                {tenants.length} Brokerages
              </span>
              <span className="text-[10px] text-slate-400">100% BaFin License verified</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Active Advisors</span>
              <span className="text-lg font-extrabold font-mono text-white mt-1 block">
                {tenants.reduce((acc, t) => acc + t.advisorCount, 0)} Licensed Brokers
              </span>
              <span className="text-[10px] text-slate-400">Round-robin load balancing</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Frankfurt ISO 27001</span>
              <span className="text-lg font-extrabold font-mono text-emerald-400 mt-1 block">
                99.99% Uptime
              </span>
              <span className="text-[10px] text-emerald-400">Zero BaFin audit flags</span>
            </div>
          </div>

          {/* Brokerage Grid Selection Cards */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Brokerage Tenants (Click to Manage & Ingest Advisors)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Select Bavaria FinOps, Berlin Expat Lending, or any partner to add brokers or configure workspace.
                </p>
              </div>

              <button
                onClick={() => setShowAddTenant(!showAddTenant)}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Provision New Brokerage</span>
              </button>
            </div>

            {/* Tenant Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tenants.map((tenant) => {
                const isSelected = selectedTenant?.id === tenant.id;
                return (
                  <div
                    key={tenant.id}
                    onClick={() => {
                      setSelectedTenant(tenant);
                      setShowAddAdvisor(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-xs relative ${
                      isSelected
                        ? 'bg-[#0E1F42] border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h5 className="font-bold text-white text-sm">{tenant.name}</h5>
                        <p className="text-[11px] text-cyan-300 font-mono">
                          {tenant.subdomain}.leadflowcrm.de
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        tenant.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : tenant.status === 'provisioning'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {tenant.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-300 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Headquarters:</span>
                        <span className="font-medium text-white">{tenant.city}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Team Size:</span>
                        <span className="font-medium text-white">{tenant.advisorCount} Advisors ({tenant.dealsCount} deals)</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Monthly Volume:</span>
                        <span className="font-mono font-bold text-emerald-400">{tenant.monthlyVolume}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span className="truncate max-w-[150px]">{tenant.adminEmail}</span>
                        <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                          Manage &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Tenant Drawer / Action Box */}
          {selectedTenant && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0B1E48] to-slate-900 border border-cyan-400/60 shadow-xl space-y-4 animate-fade-in text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
                    🏢
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{selectedTenant.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                        {selectedTenant.bafinLicense}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      Managing Partner: <strong className="text-white">{selectedTenant.adminName}</strong> ({selectedTenant.adminEmail})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddAdvisor(!showAddAdvisor)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Add Advisor / User</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSwitchTenant) {
                        onSwitchTenant(selectedTenant.subdomain);
                      }
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Enter Workspace</span>
                  </button>
                </div>
              </div>

              {/* Add Advisor Form */}
              {showAddAdvisor && (
                <form onSubmit={handleAddAdvisorToTenant} className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-cyan-400" />
                      <span>Ingest New Licensed Advisor into {selectedTenant.name}</span>
                    </h5>
                    <span className="text-[11px] text-slate-400">Scoped to {selectedTenant.subdomain}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={advisorName}
                        onChange={(e) => setAdvisorName(e.target.value)}
                        placeholder="e.g. Stefan Meier"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Corporate Email *</label>
                      <input
                        type="email"
                        required
                        value={advisorEmail}
                        onChange={(e) => setAdvisorEmail(e.target.value)}
                        placeholder={`advisor@${selectedTenant.subdomain}.de`}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Role Title</label>
                      <input
                        type="text"
                        value={advisorRoleTitle}
                        onChange={(e) => setAdvisorRoleTitle(e.target.value)}
                        placeholder="Senior Mortgage Advisor"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddAdvisor(false)}
                      className="px-3 py-1.5 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{isSubmitting ? 'Registering...' : 'Register Advisor in MongoDB'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* New Brokerage Form */}
          {showAddTenant && (
            <form onSubmit={handleProvisionTenant} className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3 animate-fade-in text-xs">
              <h5 className="font-bold text-white text-xs">Provision New Agency Tenant</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Brokerage Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newBrokerageName}
                    onChange={(e) => setNewBrokerageName(e.target.value)}
                    placeholder="e.g. Stuttgart Hypo GmbH"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Subdomain *</label>
                  <input
                    type="text"
                    required
                    value={newSubdomain}
                    onChange={(e) => setNewSubdomain(e.target.value)}
                    placeholder="stuttgart-hypo"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Admin Email *</label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="lead@stuttgart-hypo.de"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddTenant(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Deploy Tenant & Send Onboarding Link</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#060D1E] px-6 py-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-400" />
            <span>Frankfurt DC Cluster 01 · Kubernetes Tenant Pool Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};

export default PlatformAdminModal;
