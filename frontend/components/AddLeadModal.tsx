import React, { useState } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';
import { Deal } from '../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDeal: (deal: Deal) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onAddDeal }) => {
  const [clientName, setClientName] = useState('');
  const [clientType, setClientType] = useState<Deal['clientType']>('Expat (EU Blue Card)');
  const [propertyCity, setPropertyCity] = useState('Munich (Schwabing)');
  const [propertyPrice, setPropertyPrice] = useState(750000);
  const [loanAmount, setLoanAmount] = useState(600000);
  const [monthlyNetIncome, setMonthlyNetIncome] = useState(8500);
  const [targetBank, setTargetBank] = useState('ING-DiBa');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;

    const newDeal: Deal = {
      id: `DEAL-${Math.floor(8000 + Math.random() * 1999)}`,
      clientName,
      clientType,
      nationality: clientType.includes('Expat') ? 'International Expat' : 'Germany',
      propertyCity,
      propertyPrice: Number(propertyPrice),
      loanAmount: Number(loanAmount),
      equityPercent: Math.round(((propertyPrice - loanAmount) / propertyPrice) * 100),
      stage: 'new_lead',
      assignedBroker: 'Maximilian Bauer',
      avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
      schufaScore: 98.5,
      monthlyNetIncome: Number(monthlyNetIncome),
      targetBank,
      matchScore: 95,
      docsReady: 1,
      totalDocs: 5,
      createdAt: 'Just now',
      priority: 'high'
    };

    onAddDeal(newDeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0B152E] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7">
          <div className="mb-6 space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mortgage Pipeline Simulation</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Create New Borrower Inquiry
            </h3>
            <p className="text-xs text-slate-400">
              Add a mock expat or domestic borrower into your live pipeline board.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Borrower Name(s) *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Sravan & Ananya Kumar"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Residency / Visa Profile
                </label>
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as Deal['clientType'])}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Expat (EU Blue Card)">Expat (EU Blue Card)</option>
                  <option value="German Resident">German Resident</option>
                  <option value="Non-EU Permanent">Non-EU Permanent</option>
                  <option value="Freelancer / Self-Employed">Freelancer / Self-Employed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  German Property Location
                </label>
                <input
                  type="text"
                  required
                  value={propertyCity}
                  onChange={(e) => setPropertyCity(e.target.value)}
                  placeholder="Munich, Berlin, Frankfurt..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Purchase Price (€)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Loan Needed (€)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Net Income (€/mo)
                </label>
                <input
                  type="number"
                  step="500"
                  value={monthlyNetIncome}
                  onChange={(e) => setMonthlyNetIncome(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 text-xs sm:text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Borrower to Pipeline</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
