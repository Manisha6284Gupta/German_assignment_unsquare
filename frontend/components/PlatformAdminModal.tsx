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
  ArrowUpRight
} from 'lucide-react';
import { TenantBrokerage } from '../types';

interface PlatformAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlatformAdminModal: React.FC<PlatformAdminModalProps> = ({ isOpen, onClose }) => {
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

  const [showAddTenant, setShowAddTenant] = useState(false);
  const [newBrokerageName, setNewBrokerageName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newCity, setNewCity] = useState('Munich');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProvisionTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrokerageName || !newSubdomain) return;

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
                Superuser Infrastructure Management · Multi-Tenant Isolation & BaFin Sovereign Cluster
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

          {/* Tenant Provisioning Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Registered Brokerage Tenant Workspaces</span>
              </h4>
              <p className="text-xs text-slate-400">
                Each brokerage operates with isolated encrypted schemas, custom domain routing, and § 34i audit logging.
              </p>
            </div>

            <button
              onClick={() => setShowAddTenant(!showAddTenant)}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Tenant Workspace</span>
            </button>
          </div>

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
                  className="px-4 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Deploy Tenant & Send Onboarding Link
                </button>
              </div>
            </form>
          )}

          {/* Tenants Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060D1E] text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Brokerage Tenant</th>
                  <th className="p-3">Workspace URL</th>
                  <th className="p-3">Advisors</th>
                  <th className="p-3">Monthly Vol.</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">BaFin License</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-semibold text-white">
                      <div>{tenant.name}</div>
                      <div className="text-[10px] text-slate-400">{tenant.city} · {tenant.adminEmail}</div>
                    </td>
                    <td className="p-3 font-mono text-cyan-300 text-[11px]">
                      {tenant.subdomain}.leadflowcrm.de
                    </td>
                    <td className="p-3 text-slate-300">
                      {tenant.advisorCount} Brokers ({tenant.dealsCount} deals)
                    </td>
                    <td className="p-3 font-mono font-bold text-white">
                      {tenant.monthlyVolume}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        tenant.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : tenant.status === 'provisioning'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-400">
                      {tenant.bafinLicense}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
