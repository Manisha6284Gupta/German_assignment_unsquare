import React, { useState, useEffect } from 'react';
import { TrendingUp, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onRequestDemo: () => void;
  onLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestDemo, onLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#070D1E]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3.5'
          : 'bg-[#070D1E] border-b border-slate-800/40 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Single text element wordmark with logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20 group-hover:scale-105 group-hover:bg-emerald-500/25 transition-all">
              <TrendingUp className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                LeadFlow<span className="text-cyan-400 font-extrabold ml-1">CRM</span>
              </span>
            </div>
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#features"
              className="hover:text-cyan-300 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              Features
            </a>
            <a
              href="#for-brokers"
              className="hover:text-cyan-300 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              For Brokers
            </a>
            <a
              href="#interactive-pipeline"
              className="hover:text-cyan-300 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded flex items-center gap-1.5"
            >
              <span>Pipeline Demo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            </a>
            <a
              href="#calculator"
              className="hover:text-cyan-300 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              ROI Calculator
            </a>
            <a
              href="#pricing"
              className="hover:text-cyan-300 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              Pricing
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden sm:flex items-center gap-3.5">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={onRequestDemo}
              className="px-5 py-2.5 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all duration-150 shadow-md shadow-white/10 hover:shadow-white/20 active:scale-[0.98] whitespace-nowrap cursor-pointer flex items-center gap-1.5 group"
            >
              <span>Request Demo</span>
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onRequestDemo}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg shadow-sm"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#070D1E] px-4 pt-4 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/80 hover:text-white"
            >
              Features
            </a>
            <a
              href="#for-brokers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/80 hover:text-white"
            >
              For Brokers
            </a>
            <a
              href="#interactive-pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/80 hover:text-white"
            >
              Pipeline Demo
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/80 hover:text-white"
            >
              ROI Calculator
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/80 hover:text-white"
            >
              Pricing
            </a>
          </nav>
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogin();
              }}
              className="w-full py-2.5 text-center text-sm font-medium text-slate-300 bg-slate-800/60 rounded-lg hover:bg-slate-800"
            >
              Broker Portal Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestDemo();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-950 bg-white rounded-lg shadow-sm"
            >
              Request Custom Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
