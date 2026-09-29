import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Building2, 
  UserCheck, 
  KeyRound, 
  Sparkles,
  Home,
  Eye,
  EyeOff
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import api from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser, token?: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  // Tabs: 'broker' | 'client' | 'platform'
  const [activeTab, setActiveTab] = useState<'broker' | 'client' | 'platform'>('broker');
  
  // Password Visibility Toggle State
  const [showPassword, setShowPassword] = useState(false);
  
  // Broker credentials
  const [tenantSubdomain, setTenantSubdomain] = useState('bavaria-finops');
  const [brokerEmail, setBrokerEmail] = useState('maximilian@bavaria-finops.de');
  const [brokerPassword, setBrokerPassword] = useState('Bavaria#2026!');
  const [brokerRoleType, setBrokerRoleType] = useState<'brokerage_admin' | 'advisor'>('brokerage_admin');

  // Client credentials
  const [clientEmail, setClientEmail] = useState('alexander.lindqvist@gmail.com');
  const [caseReference, setCaseReference] = useState('DEAL-8491');

  // Platform Admin credentials
  const [platformEmail, setPlatformEmail] = useState('admin@leadflowcrm.de');
  const [masterKey, setMasterKey] = useState('SuperAdmin#2026!');

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authResponse, setAuthResponse] = useState<AuthUser | null>(null);
  const [issuedToken, setIssuedToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBrokerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await api.login({
        email: brokerEmail,
        password: brokerPassword,
        subdomain: tenantSubdomain,
        role: brokerRoleType
      });
      setAuthResponse(res.data);
      setIssuedToken(res.token || `jwt_session_${res.data.id}_${Date.now()}`);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await api.login({
        email: clientEmail,
        dealId: caseReference,
        role: 'client'
      });
      setAuthResponse(res.data);
      setIssuedToken(res.token || `client_session_${caseReference || 'DEAL-8491'}_${Date.now()}`);
    } catch (err: any) {
      setLoginError(err.message || 'Borrower access failed. Please verify case reference.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePlatformLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await api.login({
        email: platformEmail,
        password: masterKey,
        isPlatformMaster: true,
        role: 'platform_admin'
      });
      setAuthResponse(res.data);
      setIssuedToken(res.token || `master_token_leadflow_${Date.now()}`);
    } catch (err: any) {
      setLoginError(err.message || 'Master validation failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const selectPreset = (role: UserRole) => {
    setLoginError(null);
    if (role === 'brokerage_admin') {
      setActiveTab('broker');
      setBrokerRoleType('brokerage_admin');
      setTenantSubdomain('bavaria-finops');
      setBrokerEmail('maximilian@bavaria-finops.de');
      setBrokerPassword('Bavaria#2026!');
    } else if (role === 'advisor') {
      setActiveTab('broker');
      setBrokerRoleType('advisor');
      setTenantSubdomain('berlin-expats');
      setBrokerEmail('laura@berlin-expats.de');
      setBrokerPassword('Berlin#2026!');
    } else if (role === 'client') {
      setActiveTab('client');
      setClientEmail('alexander.lindqvist@gmail.com');
      setCaseReference('DEAL-8491');
    } else if (role === 'platform_admin') {
      setActiveTab('platform');
      setPlatformEmail('admin@leadflowcrm.de');
      setMasterKey('SuperAdmin#2026!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B152E] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {authResponse ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-semibold uppercase">
                {authResponse.role.replace('_', ' ')}
              </div>
              <h4 className="text-2xl font-bold text-white">Authenticated as {authResponse.name}</h4>
              <p className="text-xs text-slate-300">
                {authResponse.roleTitle} · {authResponse.brokerageName}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-left text-slate-300 space-y-1.5">
              <p className="flex justify-between">
                <span className="text-slate-400">Authenticated Scope:</span>
                <span className="font-mono text-cyan-300 font-semibold">{authResponse.subdomain}.leadflowcrm.de</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400">DSGVO Isolation:</span>
                <span className="text-emerald-400 font-mono">100% Sovereign Active</span>
              </p>
              {authResponse.dealId && (
                <p className="flex justify-between">
                  <span className="text-slate-400">Borrower Case Ref:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{authResponse.dealId}</span>
                </p>
              )}
            </div>

            <button
              onClick={() => {
                onLoginSuccess(authResponse, issuedToken || undefined);
                setAuthResponse(null);
                onClose();
              }}
              className="w-full py-3 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Enter {authResponse.role === 'client' ? 'Client Document Portal' : authResponse.role === 'platform_admin' ? 'Platform Admin Console' : 'Brokerage Pipeline Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-7">
            {/* Header */}
            <div className="mb-5 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Multi-Role German Mortgage Access</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Sign In to LeadFlow
              </h3>
              <p className="text-xs text-slate-400">
                Select your role to access your dedicated pipeline, team dashboard, or borrower portal.
              </p>
            </div>

            {/* Error Notice */}
            {loginError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {loginError}
              </div>
            )}

            {/* Quick Persona Fast-Switch Presets */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 mb-5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Persona Presets (1-Click Test):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => selectPreset('brokerage_admin')}
                  className={`p-1.5 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                    activeTab === 'broker' && brokerRoleType === 'brokerage_admin'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  🏢 Agency Owner
                </button>
                <button
                  type="button"
                  onClick={() => selectPreset('advisor')}
                  className={`p-1.5 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                    activeTab === 'broker' && brokerRoleType === 'advisor'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  💼 Staff Advisor
                </button>
                <button
                  type="button"
                  onClick={() => selectPreset('client')}
                  className={`p-1.5 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                    activeTab === 'client'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  🏡 Expat Client
                </button>
                <button
                  type="button"
                  onClick={() => selectPreset('platform_admin')}
                  className={`p-1.5 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                    activeTab === 'platform'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  ⚙️ SaaS SuperAdmin
                </button>
              </div>
            </div>

            {/* Main Tabs */}
            <div className="flex border-b border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab('broker')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'broker'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Broker / Advisor Login</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('client')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'client'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Client Portal Login</span>
              </button>
            </div>

            {/* TAB 1: BROKER / ADVISOR LOGIN */}
            {activeTab === 'broker' && (
              <form onSubmit={handleBrokerLogin} className="space-y-3.5">
                <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px] px-2 font-medium">Role:</span>
                  <button
                    type="button"
                    onClick={() => setBrokerRoleType('brokerage_admin')}
                    className={`flex-1 py-1 rounded text-center text-xs font-semibold cursor-pointer ${
                      brokerRoleType === 'brokerage_admin' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                    }`}
                  >
                    Brokerage Admin (Owner)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrokerRoleType('advisor')}
                    className={`flex-1 py-1 rounded text-center text-xs font-semibold cursor-pointer ${
                      brokerRoleType === 'advisor' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                    }`}
                  >
                    Staff Advisor (Broker)
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Brokerage Subdomain
                  </label>
                  <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden focus-within:border-cyan-400">
                    <input
                      type="text"
                      required
                      value={tenantSubdomain}
                      onChange={(e) => setTenantSubdomain(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent text-xs text-white focus:outline-none"
                      placeholder="bavaria-finops"
                    />
                    <span className="px-3 text-xs font-mono text-slate-400 border-l border-slate-800 bg-slate-950">
                      .leadflowcrm.de
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Corporate Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={brokerEmail}
                    onChange={(e) => setBrokerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <a href="#" className="text-[11px] text-cyan-400 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  
                  {/* Interactive Eye Icon Toggle Password Input */}
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={brokerPassword}
                      onChange={(e) => setBrokerPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-3 py-2 pr-10 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded-md transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 text-xs sm:text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <span>Authenticating Workspace...</span>
                    ) : (
                      <>
                        <span>Sign In as {brokerRoleType === 'brokerage_admin' ? 'Brokerage Admin' : 'Loan Advisor'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: CLIENT / HOMEBUYER PORTAL LOGIN */}
            {activeTab === 'client' && (
              <form onSubmit={handleClientLogin} className="space-y-3.5">
                <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Expat homebuyers receive their login credentials or magic links directly from their assigned German mortgage advisor.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Client Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="alexander.lindqvist@gmail.com"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mortgage Case Reference (or Temporary Password)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={caseReference}
                      onChange={(e) => setCaseReference(e.target.value)}
                      placeholder="DEAL-8491 or password"
                      className="w-full px-3 py-2 pr-10 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded-md transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide case reference' : 'Show case reference'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 text-xs sm:text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <span>Opening Borrower Vault...</span>
                    ) : (
                      <>
                        <span>Access Expat Document Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: PLATFORM ADMIN (SaaS Super User) */}
            {activeTab === 'platform' && (
              <form onSubmit={handlePlatformLogin} className="space-y-3.5">
                <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Platform Super User Access:</strong> Global management of all German brokerage tenants, BaFin logs, and cloud infrastructure.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Platform Master Email
                  </label>
                  <input
                    type="email"
                    required
                    value={platformEmail}
                    onChange={(e) => setPlatformEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Master Infrastructure Key
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={masterKey}
                      onChange={(e) => setMasterKey(e.target.value)}
                      className="w-full px-3 py-2 pr-10 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 font-mono transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded-md transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide master key' : 'Show master key'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <span>Validating Global Key...</span>
                    ) : (
                      <>
                        <span>Enter Platform Admin Console</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Footer Notice */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>2FA / SAML SSO</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab(activeTab === 'platform' ? 'broker' : 'platform');
                  setShowPassword(false);
                }}
                className="text-slate-400 hover:text-amber-300 transition-colors underline cursor-pointer"
              >
                {activeTab === 'platform' ? '← Back to Standard Login' : 'Platform SuperAdmin Login'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default LoginModal;
