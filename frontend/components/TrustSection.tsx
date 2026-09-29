import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Star
} from 'lucide-react';
import { TRUSTED_BROKERAGES, TESTIMONIALS } from '../data/mockData';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#060C1B] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="text-center mb-16 space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
            Trusted by Leading Mortgage Brokers in Germany
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 items-center justify-center">
            {TRUSTED_BROKERAGES.map((brokerage, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex flex-col items-center justify-center text-center group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 transition-colors">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 tracking-wider font-mono uppercase">
                  {brokerage.logoText}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {brokerage.location} · {brokerage.metrics}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Badges Ribbon */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2.5 p-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block text-[11px]">BaFin & § 34i GewO</span>
              <span className="text-[10px] text-slate-400">Strict regulatory compliance</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block text-[11px]">DSGVO / EU GDPR</span>
              <span className="text-[10px] text-slate-400">Full data privacy & encryption</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block text-[11px]">Frankfurt ISO 27001</span>
              <span className="text-[10px] text-slate-400">German sovereign hosting</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block text-[11px]">Europace Ready</span>
              <span className="text-[10px] text-slate-400">Seamless aggregator bridge</span>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 rounded-2xl p-6 sm:p-7 border border-slate-800 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.author}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.author}</h4>
                  <p className="text-[11px] text-cyan-300">{item.role}, {item.company}</p>
                  <p className="text-[10px] font-mono text-emerald-400 font-semibold">{item.volume}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
