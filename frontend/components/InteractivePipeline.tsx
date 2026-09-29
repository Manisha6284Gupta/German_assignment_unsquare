import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  FileText, 
  Sparkles,
  MoveRight
} from 'lucide-react';
import { Deal } from '../types';

interface InteractivePipelineProps {
  deals: Deal[];
  onMoveStage: (dealId: string, nextStage: Deal['stage']) => void;
  onSelectDeal: (deal: Deal) => void;
  onAddDealModal: () => void;
}

export const InteractivePipeline: React.FC<InteractivePipelineProps> = ({
  deals,
  onMoveStage,
  onSelectDeal,
  onAddDealModal
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const stages: { key: Deal['stage']; title: string; color: string; border: string }[] = [
    { key: 'new_lead', title: '01. New Inbound Leads', color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/30' },
    { key: 'doc_verification', title: '02. Doc Verification', color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/30' },
    { key: 'bank_matching', title: '03. Bank Matching (Europace)', color: 'bg-cyan-500/10 text-cyan-400', border: 'border-cyan-500/30' },
    { key: 'offer_issued', title: '04. Bank Offer Issued', color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/30' },
    { key: 'closed_won', title: '05. Closed & Notary Done', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/30' }
  ];

  const filteredDeals = deals.filter(deal => {
    if (selectedCity !== 'all' && !deal.propertyCity.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    if (selectedType !== 'all' && deal.clientType !== selectedType) return false;
    if (searchQuery && !deal.clientName.toLowerCase().includes(searchQuery.toLowerCase()) && !deal.propertyCity.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalVolume = filteredDeals.reduce((sum, d) => sum + d.loanAmount, 0);
  const avgMatch = filteredDeals.length > 0 ? Math.round(filteredDeals.reduce((s, d) => s + d.matchScore, 0) / filteredDeals.length) : 0;

  const getNextStage = (current: Deal['stage']): Deal['stage'] | null => {
    const sequence: Deal['stage'][] = ['new_lead', 'doc_verification', 'bank_matching', 'offer_issued', 'closed_won'];
    const idx = sequence.indexOf(current);
    return idx < sequence.length - 1 ? sequence[idx + 1] : null;
  };

  return (
    <section id="interactive-pipeline" className="py-24 bg-[#060C1B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Live Sandbox</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test the LeadFlow Broker Pipeline in Real-Time
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Experience how your advisors manage mortgage applications, verify German salary slips, and dispatch bank-ready dossiers with single clicks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAddDealModal}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simulate New Expat Lead</span>
            </button>
          </div>
        </div>

        {/* Live Filter Bar & Metrics */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search borrower or city..."
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-56"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {['all', 'Munich', 'Berlin', 'Frankfurt', 'Hamburg'].map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-all cursor-pointer ${
                    selectedCity === city
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {city === 'all' ? 'All Hubs' : city}
                </button>
              ))}
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Buyer Profiles</option>
              <option value="Expat (EU Blue Card)">Expat (EU Blue Card)</option>
              <option value="German Resident">German Resident</option>
              <option value="Non-EU Permanent">Non-EU Permanent</option>
              <option value="Freelancer / Self-Employed">Freelancer / Self-Employed</option>
            </select>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
            <div>
              <span className="text-slate-500 block text-[11px]">Filtered Loan Volume</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                €{(totalVolume / 1000000).toFixed(2)}M
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Active Deals</span>
              <span className="text-sm font-mono font-bold text-white">
                {filteredDeals.length}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Avg Bank Match</span>
              <span className="text-sm font-mono font-bold text-cyan-400">
                {avgMatch}%
              </span>
            </div>
          </div>
        </div>

        {/* 5-Column Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map((col) => {
            const columnDeals = filteredDeals.filter(d => d.stage === col.key);
            const colVolume = columnDeals.reduce((acc, curr) => acc + curr.loanAmount, 0);

            return (
              <div
                key={col.key}
                className="bg-[#091226]/80 rounded-2xl p-3.5 border border-slate-800/90 flex flex-col min-w-[240px] shadow-lg"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight">
                      {col.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      €{(colVolume / 1000).toFixed(0)}k volume
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold ${col.color}`}>
                    {columnDeals.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {columnDeals.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                      No deals in this stage
                    </div>
                  ) : (
                    columnDeals.map((deal) => {
                      const nextStage = getNextStage(deal.stage);
                      return (
                        <div
                          key={deal.id}
                          className="bg-slate-900/90 hover:bg-slate-850 rounded-xl p-3.5 border border-slate-700/70 hover:border-cyan-500/60 transition-all duration-150 shadow-md group relative cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                            <span className="flex items-center gap-1 text-cyan-300 font-medium">
                              <MapPin className="w-3 h-3 text-cyan-400" />
                              <span className="truncate max-w-[120px]">{deal.propertyCity}</span>
                            </span>
                            <span className="font-mono text-emerald-400 font-bold">
                              €{(deal.loanAmount / 1000).toFixed(0)}k
                            </span>
                          </div>

                          <h4 
                            onClick={() => onSelectDeal(deal)}
                            className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-2"
                          >
                            {deal.clientName}
                          </h4>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 py-1.5 border-y border-slate-800/80 mb-2.5">
                            <span className="text-slate-300">
                              {deal.clientType}
                            </span>
                            <span className="font-mono text-cyan-300">
                              Schufa: {deal.schufaScore}%
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3">
                            <span className="text-slate-400 truncate max-w-[110px]">
                              {deal.targetBank}
                            </span>
                            <span className="font-mono font-medium text-emerald-400">
                              {deal.docsReady}/{deal.totalDocs} Docs
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <button
                              onClick={() => onSelectDeal(deal)}
                              className="text-[11px] font-medium text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3 h-3 text-cyan-400" />
                              <span>Dossier</span>
                            </button>

                            {nextStage && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMoveStage(deal.id, nextStage);
                                }}
                                className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                                title="Advance to next mortgage stage"
                              >
                                <span>Advance</span>
                                <MoveRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Click <strong>"Dossier"</strong> on any applicant card to inspect German salary slips, Schufa scores, and bank match probability.</span>
          </div>
          <button
            onClick={onAddDealModal}
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline cursor-pointer"
          >
            + Create a custom borrower lead
          </button>
        </div>

      </div>
    </section>
  );
};
