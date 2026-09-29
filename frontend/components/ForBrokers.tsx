import React from 'react';
import { 
  Check, 
  X, 
  Building, 
  ArrowRight 
} from 'lucide-react';

interface ForBrokersProps {
  onRequestDemo: () => void;
}

export const ForBrokers: React.FC<ForBrokersProps> = ({ onRequestDemo }) => {
  const comparisons = [
    {
      feature: "German Expat Visa & Residency Verification",
      genericCrm: "Manual custom fields, no validation",
      leadFlow: "Built-in EU Blue Card, Niederlassungserlaubnis & Permanent residency logic",
      isAdvantage: true
    },
    {
      feature: "DATEV & German Salary Slip OCR",
      genericCrm: "None / expensive 3rd-party plugins",
      leadFlow: "Native German OCR for Gehaltsabrechnung & Lohnsteuerbescheinigung",
      isAdvantage: true
    },
    {
      feature: "Europace & German Bank Pipeline Bridge",
      genericCrm: "Requires months of custom API dev",
      leadFlow: "Direct sync with major German lending aggregators & bank underwriters",
      isAdvantage: true
    },
    {
      feature: "Multilingual Expat Intake (English + German)",
      genericCrm: "Single language or complex routing",
      leadFlow: "Instant bi-lingual borrower portal with German real estate terms explained",
      isAdvantage: true
    },
    {
      feature: "BaFin & DSGVO Compliance Architecture",
      genericCrm: "Generic US cloud storage risks",
      leadFlow: "100% Frankfurt ISO 27001 data isolation with BaFin audit trail",
      isAdvantage: true
    },
    {
      feature: "KfW Subsidy & Energy Efficiency Calculator",
      genericCrm: "Manual spreadsheets",
      leadFlow: "Integrated KfW 124/261/300 loan programs with instant interest reduction check",
      isAdvantage: true
    }
  ];

  return (
    <section id="for-brokers" className="py-20 bg-slate-900/50 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" />
            <span>Why German Mortgage Brokers Switch to LeadFlow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for German Mortgage Realities, Not Generic Sales Funnels
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Generic SaaS CRMs were designed for software sales. LeadFlow CRM is purposefully architected for § 34i GewO mortgage intermediaries in Germany.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-[#091228] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl mb-12">
          <div className="grid grid-cols-12 bg-[#060D1E] p-4 sm:p-5 border-b border-slate-800 text-xs sm:text-sm font-bold">
            <div className="col-span-5 text-slate-300">
              German Mortgage Capability
            </div>
            <div className="col-span-3 text-slate-400 hidden sm:block">
              Generic CRMs (Salesforce / HubSpot)
            </div>
            <div className="col-span-7 sm:col-span-4 text-cyan-300 font-extrabold flex items-center gap-1.5">
              <span>LeadFlow CRM</span>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Native</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {comparisons.map((row, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-slate-850/50 transition-colors text-xs sm:text-sm"
              >
                <div className="col-span-5 font-medium text-white pr-2">
                  {row.feature}
                </div>

                <div className="col-span-3 text-slate-400 hidden sm:flex items-center gap-2 pr-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-xs">{row.genericCrm}</span>
                </div>

                <div className="col-span-7 sm:col-span-4 text-slate-200 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-xs font-medium text-cyan-100">{row.leadFlow}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Broker Callout Card */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0C1A38] to-slate-900 rounded-2xl p-7 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h3 className="text-lg font-bold text-white">
              Migrate your existing deals from HubSpot, Excel, or Pipedrive in &lt; 24 hours.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Our German onboarding team provides automated CSV & database import with custom field mapping.
            </p>
          </div>
          <button
            onClick={onRequestDemo}
            className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all whitespace-nowrap shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>Book a Broker Walkthrough</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
