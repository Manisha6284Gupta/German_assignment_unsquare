import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  FileText, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Building2,
  Calendar,
  ExternalLink,
  DollarSign,
  LogOut
} from 'lucide-react';
import { AuthUser, Deal } from '../../types';
import { InteractivePipeline } from '../InteractivePipeline';

interface AdvisorDashboardProps {
  currentUser: AuthUser;
  deals: Deal[];
  onMoveStage: (dealId: string, nextStage: Deal['stage']) => void;
  onSelectDeal: (deal: Deal) => void;
  onAddDealModal: () => void;
  onOpenClientPortalAsUser: (deal: Deal) => void;
  onViewLandingPage?: () => void;
  onLogout?: () => void;
}

interface AdvisorTask {
  id: string;
  dealId: string;
  clientName: string;
  taskTitle: string;
  dueDate: string;
  isOverdue: boolean;
  priority: 'urgent' | 'high' | 'medium';
  completed: boolean;
}

const INITIAL_TASKS: AdvisorTask[] = [
  {
    id: 'TSK-101',
    dealId: 'DEAL-8491',
    clientName: 'Alexander Lindqvist',
    taskTitle: 'Request updated EU Blue Card scan (expires in 4 months)',
    dueDate: 'Today (17:00)',
    isOverdue: true,
    priority: 'urgent',
    completed: false
  },
  {
    id: 'TSK-102',
    dealId: 'DEAL-8492',
    clientName: 'Priya Narang',
    taskTitle: 'Submit pre-matched dossier to Commerzbank portal',
    dueDate: 'Tomorrow',
    isOverdue: false,
    priority: 'high',
    completed: false
  },
  {
    id: 'TSK-103',
    dealId: 'DEAL-8493',
    clientName: 'Dr. Florian Richter',
    taskTitle: 'Verify notarized Grundbuchauszug (Land Register extract)',
    dueDate: 'In 2 days',
    isOverdue: false,
    priority: 'medium',
    completed: false
  },
  {
    id: 'TSK-104',
    dealId: 'DEAL-8491',
    clientName: 'Alexander Lindqvist',
    taskTitle: 'Send Magic Link invitation to borrower document portal',
    dueDate: 'Completed',
    isOverdue: false,
    priority: 'medium',
    completed: true
  }
];

export const AdvisorDashboard: React.FC<AdvisorDashboardProps> = ({
  currentUser,
  deals,
  onMoveStage,
  onSelectDeal,
  onAddDealModal,
  onOpenClientPortalAsUser,
  onViewLandingPage,
  onLogout
}) => {
  const [tasks, setTasks] = useState<AdvisorTask[]>(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'my_deals'>('all');

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const advisorDeals = activeFilter === 'my_deals' 
    ? deals.filter(d => d.assignedBroker.toLowerCase().includes(currentUser.name.toLowerCase()) || d.assignedBroker.includes('Laura'))
    : deals;

  const totalLoanVolume = advisorDeals.reduce((sum, d) => sum + d.loanAmount, 0);
  const avgMatchScore = Math.round(advisorDeals.reduce((sum, d) => sum + d.matchScore, 0) / (advisorDeals.length || 1));
  const pendingDocsCount = advisorDeals.reduce((sum, d) => sum + (d.totalDocs - d.docsReady), 0);

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 font-sans pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight">Advisor Workspace</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Staff Advisor
              </span>
            </div>
            <p className="text-xs text-slate-400">{currentUser.brokerageName || 'Berlin Expat Lending Group'} • Live Mortgage Pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddDealModal}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 px-3.5 py-1.5 rounded-lg transition shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Expat Case
          </button>
          {onViewLandingPage && (
            <button
              onClick={onViewLandingPage}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition border border-slate-700/60 cursor-pointer"
            >
              Public Product View
            </button>
          )}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <img src={currentUser.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover" />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white">{currentUser.name}</div>
              <div className="text-[10px] text-cyan-400">{currentUser.roleTitle || 'Senior Mortgage Advisor'}</div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out"
                className="ml-2 p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer border border-slate-700/60"
                aria-label="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Advisor KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Pipeline Volume</span>
            <div className="text-2xl font-bold text-white mt-1">€{(totalLoanVolume / 1000000).toFixed(2)}M</div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">{advisorDeals.length} active borrower cases</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bank Match Score Avg</span>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{avgMatchScore}%</div>
            <div className="text-[11px] text-slate-400 mt-1">ING-DiBa, DKB & Commerzbank</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documents Pending OCR</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{pendingDocsCount} Files</div>
            <div className="text-[11px] text-amber-400/80 font-medium mt-1">DATEV OCR automated parsing</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. Advisor Commission</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">€{(totalLoanVolume * 0.007).toLocaleString()}</div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">70% advisor split on closed deals</div>
          </div>
        </div>

        {/* Assigned Daily Tasks & Quick Action Dossier Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Column */}
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Advisor Task Queue & Critical Deadlines
                </h3>
                <p className="text-xs text-slate-400">Time-sensitive document audits and bank submission milestones</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                {tasks.filter(t => !t.completed).length} Pending Actions
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                    task.completed
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-50'
                      : task.isOverdue
                      ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <div className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {task.taskTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-cyan-400 font-mono font-medium">{task.dealId}</span>
                        <span>•</span>
                        <span>{task.clientName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {task.isOverdue && !task.completed ? (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[10px] bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                        <AlertTriangle className="w-3 h-3" /> Overdue: {task.dueDate}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">{task.dueDate}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Case Dossier Launcher */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" /> Quick Dossier Inspector
              </div>
              <h3 className="font-bold text-white text-base mb-1">Active Kreditakten (Client Dossiers)</h3>
              <p className="text-xs text-slate-400 mb-4">Click to inspect complete borrower financials, Schufa scores, and invite to client vault</p>

              <div className="space-y-2">
                {deals.slice(0, 3).map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => onSelectDeal(deal)}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={deal.avatar} alt="deal" className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition">{deal.clientName}</div>
                        <div className="text-[10px] text-slate-400">{deal.propertyCity} • €{(deal.loanAmount / 1000).toFixed(0)}k</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectDeal(deals[0])}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Open Full Kreditakte Modal
            </button>
          </div>
        </div>

        {/* Live Interactive Kanban Pipeline */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Live 5-Stage Mortgage Kanban Pipeline
              </h2>
              <p className="text-xs text-slate-400">Drag or click to advance borrower cases from Lead to BaFin & Bank Approval</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${activeFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                All Agency Deals ({deals.length})
              </button>
              <button
                onClick={() => setActiveFilter('my_deals')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${activeFilter === 'my_deals' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                Assigned to Me
              </button>
            </div>
          </div>

          <InteractivePipeline
            deals={advisorDeals}
            onMoveStage={onMoveStage}
            onSelectDeal={onSelectDeal}
            onAddDealModal={onAddDealModal}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
