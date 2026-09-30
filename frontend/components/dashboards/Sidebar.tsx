import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ShieldCheck, 
  Server, 
  LogOut, 
  Compass, 
  KeyRound, 
  Activity,
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react';
import { AuthUser } from '../../types';

export type SuperAdminTab = 'overview' | 'workspaces' | 'users' | 'audit_logs' | 'cluster_health';

interface SidebarProps {
  activeTab: SuperAdminTab;
  setActiveTab: (tab: SuperAdminTab) => void;
  currentUser: AuthUser;
  onLogout?: () => void;
  onViewLandingPage?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onViewLandingPage,
}) => {
  const navigationItems: { id: SuperAdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'workspaces', label: 'Brokerage Workspaces', icon: Building2, badge: '4' },
    { id: 'users', label: 'User Directory', icon: Users, badge: '42' },
    { id: 'audit_logs', label: 'BaFin Audit Logs', icon: ShieldCheck },
    { id: 'cluster_health', label: 'Cluster & OCR Health', icon: Server },
  ];

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-slate-950 border-r border-slate-800 flex flex-col justify-between z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">LeadFlow</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                SuperAdmin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Multi-Tenant Cloud Master</p>
          </div>
        </div>

        {/* Cluster Status Badge */}
        <div className="mt-3.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Frankfurt Cluster
          </span>
          <span className="font-mono text-emerald-400 font-bold text-[10px]">99.99%</span>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="p-3 flex-1 overflow-y-auto space-y-1.5">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Infrastructure Controls
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Public Landing Link */}
        {onViewLandingPage && (
          <div className="pt-3 border-t border-slate-800/80 mt-3">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Shortcuts
            </div>
            <button
              onClick={onViewLandingPage}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/80 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Public Product View</span>
            </button>
          </div>
        )}
      </div>

      {/* User Info & Pinned Sign Out */}
      <div className="p-3 border-t border-slate-800/90 bg-slate-950/90 space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-xs shrink-0">
              SA
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-blue-400 font-mono truncate">{currentUser.email}</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active Session" />
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-all shadow-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Secure Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
