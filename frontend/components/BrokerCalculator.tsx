import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  ArrowRight
} from 'lucide-react';

interface BrokerCalculatorProps {
  onRequestDemo: () => void;
}

export const BrokerCalculator: React.FC<BrokerCalculatorProps> = ({ onRequestDemo }) => {
  const [loanAmount, setLoanAmount] = useState<number>(650000);
  const [dealsPerMonth, setDealsPerMonth] = useState<number>(6);
  const [commissionRate, setCommissionRate] = useState<number>(1.0);

  const monthlyVolume = loanAmount * dealsPerMonth;
  const monthlyGrossCommission = monthlyVolume * (commissionRate / 100);
  const annualGrossCommission = monthlyGrossCommission * 12;

  const hoursSavedPerMonth = dealsPerMonth * 13;
  const hoursSavedPerYear = hoursSavedPerMonth * 12;

  const additionalDealsYear = Math.round(dealsPerMonth * 0.25 * 12);
  const additionalRevenueYear = additionalDealsYear * loanAmount * (commissionRate / 100);

  return (
    <section id="calculator" className="py-20 bg-[#070E22] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>German Mortgage Brokerage ROI Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Calculate Your Brokerage Revenue & Time Savings
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            See the quantifiable financial impact of automated expat lead intake and zero-friction German document verification.
          </p>
        </div>

        {/* Interactive Calculator Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Column (Left) */}
          <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-7 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Slider 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Average Loan Volume per Deal
                  </label>
                  <span className="text-sm font-mono font-bold text-cyan-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    €{loanAmount.toLocaleString('de-DE')}
                  </span>
                </div>
                <input
                  type="range"
                  min={250000}
                  max={1500000}
                  step={25000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>€250k (Regional Flat)</span>
                  <span>€650k (Berlin/Cologne)</span>
                  <span>€1.5M (Munich/Frankfurt)</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Deals Closed per Month
                  </label>
                  <span className="text-sm font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    {dealsPerMonth} Deals / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={dealsPerMonth}
                  onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>1 Solo Broker</span>
                  <span>6 Small Team</span>
                  <span>30+ Full Brokerage</span>
                </div>
              </div>

              {/* Slider 3 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Bank Commission Provision Rate
                  </label>
                  <span className="text-sm font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    {commissionRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>0.50% (Standard Base)</span>
                  <span>1.00% (German Avg)</span>
                  <span>1.50% (Premium/Subsidies)</span>
                </div>
              </div>

            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-400">
              <span className="text-slate-300 font-semibold">Benchmark data based on:</span> 18.5 hrs baseline manual file handling vs. 5.5 hrs automated with LeadFlow OCR & German bank API dispatch.
            </div>

          </div>

          {/* Results Column (Right) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#0B1736] via-slate-900 to-[#070D1E] rounded-2xl p-7 border border-cyan-500/30 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Projected Brokerage Impact
                </span>
                <span className="text-xs font-mono text-slate-400">
                  €{(monthlyVolume / 1000000).toFixed(2)}M monthly loan volume
                </span>
              </div>

              <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">
                  Current Projected Annual Broker Commission
                </span>
                <div className="text-3xl sm:text-4xl font-mono font-extrabold text-white">
                  €{Math.round(annualGrossCommission).toLocaleString('de-DE')}
                  <span className="text-sm font-sans font-normal text-slate-400 ml-2">/ year</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Based on €{Math.round(monthlyGrossCommission).toLocaleString('de-DE')} gross monthly provisions
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <Clock className="w-4 h-4" />
                    <span>Admin Hours Saved</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {hoursSavedPerYear.toLocaleString()} hrs
                  </div>
                  <p className="text-[11px] text-slate-400">
                    ≈ {Math.round(hoursSavedPerYear / 160)} full advisor working months saved
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>Expat Growth Upside</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-cyan-300">
                    +€{Math.round(additionalRevenueYear).toLocaleString('de-DE')}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    From +{additionalDealsYear} extra closed deals via lead automation
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                Ready to unlock this capacity for your brokerage?
              </div>
              <button
                onClick={onRequestDemo}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md shadow-white/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Request Custom ROI Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
