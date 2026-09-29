import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PRICING_PLANS } from '../data/mockData';

interface PricingProps {
  onSelectPlan: (planId: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  return (
    <section id="pricing" className="py-24 bg-[#070D1E] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Broker Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Predictable Plans That Scale With Your Mortgage Volume
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            No per-loan hidden fees. Full access to our German OCR engine, expat portals, and compliance infrastructure.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-medium ${!isAnnual ? 'text-white font-bold' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-13 h-7 rounded-full bg-slate-800 p-1 transition-colors border border-slate-700 relative cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full bg-cyan-400 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-medium flex items-center gap-1.5 ${isAnnual ? 'text-white font-bold' : 'text-slate-400'}`}>
              <span>Annual Billing</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-[#0F1C3E] to-slate-900 border-2 border-cyan-500 shadow-2xl shadow-cyan-950/40 lg:-translate-y-2'
                    : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular for Teams
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                  </div>

                  <div className="py-5 my-4 border-y border-slate-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                        €{price}
                      </span>
                      <span className="text-xs text-slate-400 font-sans">
                        / month {isAnnual ? '(billed annually)' : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Excl. VAT / German MwSt. · 14-day free sandbox
                    </p>
                  </div>

                  <ul className="space-y-3 my-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/25'
                      : 'bg-white hover:bg-slate-100 text-slate-950 shadow-md'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-xs text-slate-400 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>No credit card required for 14-day sandbox</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cancel anytime with 1-click export of client dossiers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dedicated § 34i compliance documentation included</span>
          </div>
        </div>

      </div>
    </section>
  );
};
