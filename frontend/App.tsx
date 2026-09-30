import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureCardsRow } from './components/FeatureCardsRow';
import { InteractivePipeline } from './components/InteractivePipeline';
import { BrokerCalculator } from './components/BrokerCalculator';
import { DeepDiveFeatures } from './components/DeepDiveFeatures';
import { ForBrokers } from './components/ForBrokers';
import { TrustSection } from './components/TrustSection';
import { Pricing } from './components/Pricing';
import { DemoModal } from './components/DemoModal';
import { LoginModal } from './components/LoginModal';
import { DossierModal } from './components/DossierModal';
import { AddLeadModal } from './components/AddLeadModal';
import { ClientPortalModal } from './components/ClientPortalModal';
import { PlatformAdminModal } from './components/PlatformAdminModal';
import { Footer } from './components/Footer';

// 4 Distinct Role-Based Production Dashboards
import { PlatformAdminDashboard } from './components/dashboards/PlatformAdminDashboard';
import { BrokerageAdminDashboard } from './components/dashboards/BrokerageAdminDashboard';
import { AdvisorDashboard } from './components/dashboards/AdvisorDashboard';
import { ClientPortalDashboard } from './components/dashboards/ClientPortalDashboard';

import { INITIAL_DEALS } from './data/mockData';
import { Deal, AuthUser } from './types';
import { CheckCircle, LayoutDashboard, Compass } from 'lucide-react';

export default function App() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  
  // Persistent Authenticated User Session & Token
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('leadflow_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.warn('Could not parse stored auth user:', err);
      }
    }
    // Default initial session for immediate demonstration
    return {
      id: 'USR-BROKER-01',
      name: 'Maximilian Bauer',
      email: 'maximilian@bavaria-finops.de',
      role: 'brokerage_admin',
      roleTitle: 'Managing Partner & Licensee',
      brokerageName: 'Bavaria FinOps Partners',
      subdomain: 'bavaria-finops',
      avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg'
    };
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('leadflow_auth_token') || 'jwt_session_USR-BROKER-01';
  });

  // State to toggle public marketing view when logged in
  const [showPublicSite, setShowPublicSite] = useState(false);

  // Modals & Overlay States
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [isPlatformAdminOpen, setIsPlatformAdminOpen] = useState(false);
  const [selectedDealForDossier, setSelectedDealForDossier] = useState<Deal | null>(null);
  const [selectedPlanForDemo, setSelectedPlanForDemo] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync session state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('leadflow_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('leadflow_auth_user');
      localStorage.removeItem('leadflow_auth_token');
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Secure Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setShowPublicSite(true);
    localStorage.removeItem('leadflow_auth_user');
    localStorage.removeItem('leadflow_auth_token');
    showToast('Securely signed out of session.');
  };

  // Login Success Handler with JWT and Role Redirection
  const handleLoginSuccess = (user: AuthUser, token?: string) => {
    setCurrentUser(user);
    setShowPublicSite(false);
    
    if (token) {
      setAuthToken(token);
      localStorage.setItem('leadflow_auth_token', token);
    }

    if (user.role === 'platform_admin') {
      showToast(`SuperAdmin authenticated. Redirected to Platform Infrastructure Dashboard.`);
    } else if (user.role === 'brokerage_admin') {
      showToast(`Welcome back, ${user.name}! Redirected to Agency Executive Dashboard.`);
    } else if (user.role === 'advisor') {
      showToast(`Welcome back, ${user.name}! Redirected to Advisor Mortgage Pipeline.`);
    } else if (user.role === 'client') {
      showToast(`Welcome, ${user.name}! Redirected to Expat Borrower Document Vault.`);
    }
  };

  const handleMoveStage = (dealId: string, nextStage: Deal['stage']) => {
    setDeals(prevDeals => 
      prevDeals.map(d => {
        if (d.id === dealId) {
          const updated = { ...d, stage: nextStage };
          showToast(`Moved "${d.clientName}" to ${nextStage.replace('_', ' ').toUpperCase()}`);
          return updated;
        }
        return d;
      })
    );
  };

  const handleAdvanceFromDossier = (dealId: string) => {
    const sequence: Deal['stage'][] = ['new_lead', 'doc_verification', 'bank_matching', 'offer_issued', 'closed_won'];
    const currentDeal = deals.find(d => d.id === dealId);
    if (currentDeal) {
      const currentIdx = sequence.indexOf(currentDeal.stage);
      if (currentIdx < sequence.length - 1) {
        handleMoveStage(dealId, sequence[currentIdx + 1]);
      }
    }
  };

  const handleAddDeal = (newDeal: Deal) => {
    setDeals(prev => [newDeal, ...prev]);
    showToast(`Added new expat lead: ${newDeal.clientName} (€${(newDeal.loanAmount / 1000).toFixed(0)}k in ${newDeal.propertyCity})`);
  };

  const handleOpenDemoForPlan = (planId: string) => {
    setSelectedPlanForDemo(planId);
    setIsDemoModalOpen(true);
  };

  const handleOpenClientPortalForDeal = (deal: Deal) => {
    const clientUser: AuthUser = {
      id: `USR-CLIENT-${deal.id}`,
      name: deal.clientName,
      email: `${deal.clientName.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`,
      role: 'client',
      roleTitle: `Borrower (${deal.propertyCity})`,
      dealId: deal.id,
      brokerageName: 'Bavaria FinOps Partners',
      subdomain: 'bavaria-finops',
      avatar: deal.avatar
    };
    setCurrentUser(clientUser);
    setShowPublicSite(false);
    showToast(`Switched session to borrower ${deal.clientName} for case ${deal.id}`);
  };

  const [impersonatingSuperAdmin, setImpersonatingSuperAdmin] = useState(false);

  const handleEnterTenant = (subdomain: string) => {
    setImpersonatingSuperAdmin(true);
    if (subdomain === 'berlin-expats') {
      setCurrentUser({
        id: 'USR-ADVISOR-02',
        name: 'Laura Weimann',
        email: 'laura@berlin-expats.de',
        role: 'brokerage_admin',
        roleTitle: 'Branch Lead & Senior Advisor',
        brokerageName: 'Berlin Expat Lending Group GmbH',
        subdomain: 'berlin-expats',
        avatar: '/frontend/assets/images/avatar_product_manager_1790659859501.jpg'
      });
      showToast(`Entered tenant workspace: Berlin Expat Lending (berlin-expats.leadflowcrm.de)`);
    } else if (subdomain === 'frankfurt-prime') {
      setCurrentUser({
        id: 'USR-FRANKFURT-01',
        name: 'Johannes Keller',
        email: 'johannes@frankfurt-prime.de',
        role: 'brokerage_admin',
        roleTitle: 'Managing Director',
        brokerageName: 'Frankfurt Prime Capital & Hypotheken',
        subdomain: 'frankfurt-prime',
        avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg'
      });
      showToast(`Entered tenant workspace: Frankfurt Prime (frankfurt-prime.leadflowcrm.de)`);
    } else {
      setCurrentUser({
        id: 'USR-BROKER-01',
        name: 'Maximilian Bauer',
        email: 'maximilian@bavaria-finops.de',
        role: 'brokerage_admin',
        roleTitle: 'Managing Partner & Licensee',
        brokerageName: 'Bavaria FinOps Partners',
        subdomain: 'bavaria-finops',
        avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg'
      });
      showToast(`Entered tenant workspace: Bavaria FinOps (bavaria-finops.leadflowcrm.de)`);
    }
    setShowPublicSite(false);
  };

  const handleReturnToSuperAdmin = () => {
    setImpersonatingSuperAdmin(false);
    setCurrentUser({
      id: 'USR-SUPERADMIN-01',
      name: 'Platform SuperAdmin',
      email: 'admin@leadflowcrm.de',
      role: 'platform_admin',
      roleTitle: 'Global Infrastructure Root',
      brokerageName: 'LeadFlow CRM Cloud Master',
      subdomain: 'platform-master',
      avatar: '/frontend/assets/images/avatar_platform_engineer_1790659873099.jpg'
    });
    showToast('Returned to Global SuperAdmin Platform Cockpit.');
  };

  const scrollToPipeline = () => {
    setShowPublicSite(true);
    setTimeout(() => {
      const el = document.getElementById('interactive-pipeline');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* SuperAdmin Impersonation Banner */}
      {impersonatingSuperAdmin && currentUser && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between text-xs backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold">
              SuperAdmin Tenant Impersonation Mode:
            </span>
            <span className="text-slate-200">
              Active in <strong className="text-white">{currentUser.brokerageName}</strong> (<code className="text-cyan-300">{currentUser.subdomain}.leadflowcrm.de</code>)
            </span>
          </div>

          <button
            onClick={handleReturnToSuperAdmin}
            className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
          >
            <span>&larr; Exit to Platform SuperAdmin Cockpit</span>
          </button>
        </div>
      )}

      {/* Floating View Switcher (For Authenticated Users) */}
      {currentUser && (
        <div className="fixed bottom-6 left-6 z-40 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md flex items-center gap-1">
          <button
            onClick={() => setShowPublicSite(false)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              !showPublicSite
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="capitalize">{currentUser.role.replace('_', ' ')} Dashboard</span>
          </button>
          <button
            onClick={() => setShowPublicSite(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              showPublicSite
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Public Site & Simulator</span>
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. AUTHENTICATED ROLE-BASED DASHBOARD ROUTING               */}
      {/* ============================================================ */}
      {currentUser && !showPublicSite ? (
        <div>
          {/* Platform SuperAdmin Route */}
          {currentUser.role === 'platform_admin' && (
            <PlatformAdminDashboard
              currentUser={currentUser}
              onOpenTenantWorkspace={handleEnterTenant}
              onViewLandingPage={() => setShowPublicSite(true)}
              onLogout={handleLogout}
            />
          )}

          {/* Brokerage Admin (Agency Owner) Route */}
          {currentUser.role === 'brokerage_admin' && (
            <BrokerageAdminDashboard
              currentUser={currentUser}
              onOpenPipeline={() => {
                showToast('Viewing agency pipeline.');
              }}
              onViewLandingPage={() => setShowPublicSite(true)}
              onLogout={handleLogout}
            />
          )}

          {/* Staff Mortgage Advisor Route */}
          {currentUser.role === 'advisor' && (
            <AdvisorDashboard
              currentUser={currentUser}
              deals={deals}
              onMoveStage={handleMoveStage}
              onSelectDeal={(deal) => setSelectedDealForDossier(deal)}
              onAddDealModal={() => setIsAddLeadModalOpen(true)}
              onOpenClientPortalAsUser={handleOpenClientPortalForDeal}
              onViewLandingPage={() => setShowPublicSite(true)}
              onLogout={handleLogout}
            />
          )}

          {/* Expat Borrower Client Route */}
          {currentUser.role === 'client' && (
            <ClientPortalDashboard
              currentUser={currentUser}
              onViewLandingPage={() => setShowPublicSite(true)}
              onLogout={handleLogout}
            />
          )}
        </div>
      ) : (
        /* ============================================================ */
        /* 2. PUBLIC MARKETING & PRODUCT LANDING PAGE                   */
        /* ============================================================ */
        <div>
          {/* Top Bar Navigation */}
          <Navbar
            onRequestDemo={() => setIsDemoModalOpen(true)}
            onLogin={() => setIsLoginModalOpen(true)}
          />

          <main>
            {/* 1. Hero Section */}
            <Hero
              onGetStarted={() => setIsDemoModalOpen(true)}
              onExplorePipeline={scrollToPipeline}
              onSelectDeal={(deal) => setSelectedDealForDossier(deal)}
              sampleDeals={deals}
            />

            {/* 2. Feature Cards Row */}
            <FeatureCardsRow />

            {/* 3. Interactive Live Pipeline Board & Deal Simulator */}
            <InteractivePipeline
              deals={deals}
              onMoveStage={handleMoveStage}
              onSelectDeal={(deal) => setSelectedDealForDossier(deal)}
              onAddDealModal={() => setIsAddLeadModalOpen(true)}
            />

            {/* 4. German Broker Commission & ROI Calculator */}
            <BrokerCalculator
              onRequestDemo={() => setIsDemoModalOpen(true)}
            />

            {/* 5. Deep Dive Capabilities */}
            <DeepDiveFeatures />

            {/* 6. For Brokers Comparison Table */}
            <ForBrokers
              onRequestDemo={() => setIsDemoModalOpen(true)}
            />

            {/* 7. Trust & Brokerage Logos + Testimonials */}
            <TrustSection />

            {/* 8. Pricing & Plans */}
            <Pricing
              onSelectPlan={handleOpenDemoForPlan}
            />
          </main>

          {/* 9. Secondary CTA & Professional Footer */}
          <Footer
            onRequestDemo={() => setIsDemoModalOpen(true)}
            onLogin={() => setIsLoginModalOpen(true)}
          />
        </div>
      )}

      {/* Modals & Portals */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        defaultPlan={selectedPlanForDemo}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ClientPortalModal
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        currentUser={currentUser}
      />

      <PlatformAdminModal
        isOpen={isPlatformAdminOpen}
        onClose={() => setIsPlatformAdminOpen(false)}
        onSwitchTenant={handleEnterTenant}
      />

      <DossierModal
        deal={selectedDealForDossier}
        onClose={() => setSelectedDealForDossier(null)}
        onAdvanceStage={handleAdvanceFromDossier}
        onOpenClientPortalAsUser={handleOpenClientPortalForDeal}
      />

      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onAddDeal={handleAddDeal}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
