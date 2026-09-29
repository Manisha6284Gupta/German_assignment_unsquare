import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  ChevronRight,
  FileCheck
} from 'lucide-react';
import { Deal } from '../types';

interface HeroProps {
  onGetStarted: () => void;
  onExplorePipeline: () => void;
  onSelectDeal: (deal: Deal) => void;
  sampleDeals: Deal[];
}

export const Hero: React.FC<HeroProps> = ({ 
  onGetStarted, 
  onExplorePipeline,
  onSelectDeal,
  sampleDeals 
}) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'docs'>('kanban');
  const previewDeals = sampleDeals.slice(0, 3);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#070D1E] via-[#0A1329] to-[#081024]">
      {/* Background ambient radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[400px] h-[350px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-6 space-y-7 text-left">
            {/* Context tag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-medium text-cyan-300 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Next-Gen German Mortgage Infrastructure</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300 font-semibold">BaFin & DSGVO Compliant</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Streamline Your Mortgage Business: <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                From Expat Lead to Homeowner, Faster.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              The All-in-One CRM for German Mortgage Brokers. Automate leads, manage pipelines, and securely handle client documents in one compliant platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onGetStarted}
                className="px-7 py-3.5 text-base font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all duration-150 shadow-lg shadow-white/10 hover:shadow-white/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5 text-slate-900 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExplorePipeline}
                className="px-6 py-3.5 text-base font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center gap-2.5 backdrop-blur-sm"
              >
                <span>Interactive Pipeline Demo</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Multi-lingual Expat Lead Forms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automated Schufa & Tax OCR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Frankfurt ISO 27001 Hosting</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual - Vector UI Kanban Pipeline Dashboard Preview */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto rounded-2xl p-1 bg-gradient-to-b from-cyan-500/20 via-slate-700/30 to-slate-900/80 shadow-2xl shadow-cyan-950/40">
              
              {/* Inner Dashboard Container */}
              <div className="bg-[#0B152E] rounded-[14px] border border-slate-800 overflow-hidden shadow-2xl">
                
                {/* Top Window Chrome */}
                <div className="bg-[#081023] px-4 py-3 border-b border-slate-800/90 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 ml-2 font-mono flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>bavaria-finops.leadflowcrm.de</span>
                    </span>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-[11px]">
                    <button 
                      onClick={() => setActiveTab('kanban')}
                      className={`px-2.5 py-1 rounded font-medium transition-all ${
                        activeTab === 'kanban' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Kanban Pipeline
                    </button>
                    <button 
                      onClick={() => setActiveTab('docs')}
                      className={`px-2.5 py-1 rounded font-medium transition-all ${
                        activeTab === 'docs' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      OCR Vault
                    </button>
                  </div>
                </div>

                {/* Dashboard Summary Ribbon */}
                <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#091228]/80 border-b border-slate-800/80 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Active Pipeline</span>
                    <span className="text-sm font-bold text-white font-mono">€4.84M</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Avg. Bank Decision</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">6.4 Days</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Expat Approval</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono">96.8%</span>
                  </div>
                </div>

                {/* Kanban Columns View */}
                {activeTab === 'kanban' && (
                  <div className="p-3.5 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Column 1: Document Verification */}
                      <div className="bg-[#070D1E]/70 rounded-xl p-2.5 border border-slate-800/90">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            <span className="text-xs font-semibold text-slate-200">Doc Verification</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">3 deals</span>
                        </div>

                        {/* Deal Card 1 */}
                        {previewDeals[0] && (
                          <div 
                            onClick={() => onSelectDeal(previewDeals[0])}
                            className="p-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm group"
                          >
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                              <span className="text-cyan-300 font-medium">Munich (Schwabing)</span>
                              <span className="font-mono text-emerald-400 font-semibold">€680k</span>
                            </div>
                            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {previewDeals[0].clientName}
                            </h4>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                              <span className="flex items-center gap-1 text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                EU Blue Card
                              </span>
                              <span className="font-mono text-cyan-400 font-medium">4/5 Docs</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Column 2: Bank Matching & Approval */}
                      <div className="bg-[#070D1E]/70 rounded-xl p-2.5 border border-slate-800/90">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            <span className="text-xs font-semibold text-slate-200">Bank Matching</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">5 deals</span>
                        </div>

                        {/* Deal Card 2 */}
                        {previewDeals[1] && (
                          <div 
                            onClick={() => onSelectDeal(previewDeals[1])}
                            className="p-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm group"
                          >
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                              <span className="text-cyan-300 font-medium">Berlin (Prenzlau)</span>
                              <span className="font-mono text-emerald-400 font-semibold">€520k</span>
                            </div>
                            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {previewDeals[1].clientName}
                            </h4>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                              <span className="flex items-center gap-1 text-emerald-300 font-medium">
                                ING-DiBa · 94% Match
                              </span>
                              <span className="font-mono text-emerald-400 font-medium">Ready</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Status bar */}
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-[11px] text-emerald-300">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ready for Bank Dispatch via Europace Bridge</span>
                      </div>
                      <button 
                        onClick={onExplorePipeline}
                        className="text-xs font-semibold text-white underline hover:text-cyan-200 cursor-pointer"
                      >
                        Open Full Board &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* Docs OCR View Tab */}
                {activeTab === 'docs' && (
                  <div className="p-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300 mb-1">
                      <span className="font-semibold text-white">Automated German Document Audit</span>
                      <span className="text-[11px] text-emerald-400 font-mono">100% OCR Passed</span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="font-medium text-white text-[11px]">Gehaltsabrechnung (Nov-Jan)</p>
                            <p className="text-[10px] text-slate-400">Net: €9,400 / mo · Verified via DATEV OCR</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Verified</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="font-medium text-white text-[11px]">Schufa Bonitätsauskunft</p>
                            <p className="text-[10px] text-slate-400">Score: 98.4% · Prime Tier Rating</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Verified</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="font-medium text-white text-[11px]">Aufenthaltstitel (EU Blue Card)</p>
                            <p className="text-[10px] text-slate-400">Valid until 2028 · Section 18b Abs. 2 AufenthG</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Verified</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Floating Trust Indicator Pill */}
            <div className="hidden sm:flex items-center gap-2.5 absolute -bottom-5 -left-4 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Multi-Tenant Isolation</p>
                <p className="text-[10px] text-slate-400">German BaFin & DSGVO Compliant</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
