import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import api from '../services/api';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, defaultPlan }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    brokerageName: '',
    city: 'Munich',
    monthlyVolume: '€2M - €5M',
    teamSize: '3-5 Advisors'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.requestDemo(formData);
    } catch (err) {
      console.warn('Demo api request caught:', err);
    }
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B152E] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Demo Requested Successfully!</h3>
            <p className="text-sm text-slate-300">
              Vielen Dank! A German mortgage CRM specialist from our Frankfurt team will contact <strong className="text-cyan-300">{formData.email}</strong> within 2 business hours to schedule your personalized walkthrough of LeadFlow CRM.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-left text-slate-400 space-y-1">
              <p><strong className="text-white">Brokerage:</strong> {formData.brokerageName || 'Independent Brokerage'}</p>
              <p><strong className="text-white">Selected Hub:</strong> {formData.city}</p>
              <p><strong className="text-white">Volume Tier:</strong> {formData.monthlyVolume}</p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="w-full py-3 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Back to Landing Page
            </button>
          </div>
        ) : (
          <div className="p-7">
            <div className="mb-6 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-on-1 Personalized Product Walkthrough</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Request a Live LeadFlow Demo
              </h3>
              <p className="text-xs text-slate-400">
                See how top German brokerages accelerate expat mortgage approvals and eliminate manual document chase.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Maximilian Bauer"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Brokerage Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brokerageName}
                    onChange={(e) => setFormData({ ...formData, brokerageName: e.target.value })}
                    placeholder="Bavaria Hypotheken GmbH"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@brokerage.de"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 89 1234567"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Primary City
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Munich">Munich</option>
                    <option value="Berlin">Berlin</option>
                    <option value="Frankfurt">Frankfurt</option>
                    <option value="Hamburg">Hamburg</option>
                    <option value="Düsseldorf / Köln">Düsseldorf / Köln</option>
                    <option value="Stuttgart">Stuttgart</option>
                    <option value="Nationwide">Nationwide</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Team Size
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1 Solo Broker">1 Solo Broker</option>
                    <option value="2-5 Advisors">2-5 Advisors</option>
                    <option value="6-20 Advisors">6-20 Advisors</option>
                    <option value="20+ Enterprise">20+ Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Monthly Loan Volume
                  </label>
                  <select
                    value={formData.monthlyVolume}
                    onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="< €1M">&lt; €1M / mo</option>
                    <option value="€1M - €3M">€1M - €3M / mo</option>
                    <option value="€3M - €10M">€3M - €10M / mo</option>
                    <option value="€10M+ Enterprise">€10M+ Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md shadow-white/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Confirm Demo Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500">
                Zero spam. BaFin & DSGVO privacy protected. Servers located in Frankfurt am Main.
              </p>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
