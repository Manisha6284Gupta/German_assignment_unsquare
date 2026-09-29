import React from 'react';
import { 
  TrendingUp, 
  ArrowRight, 
  Mail, 
  MapPin, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface FooterProps {
  onRequestDemo: () => void;
  onLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRequestDemo, onLogin }) => {
  return (
    <footer className="bg-[#050A17] text-slate-400 border-t border-slate-800/80 relative">
      
      {/* Secondary Call-To-Action Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C1A3C] via-[#0F2252] to-[#0A1633] p-8 sm:p-12 border border-cyan-500/30 shadow-2xl shadow-cyan-950/50">
          
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>14-Day Free Brokerage Sandbox</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Ready to Accelerate Your German Mortgage Business?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Join forward-thinking German mortgage brokerages who process expat loans 3x faster with automated document OCR, BaFin compliance, and direct bank dispatch.
              </p>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Free data migration support
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Setup in &lt; 15 minutes
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5">
              <button
                onClick={onRequestDemo}
                className="px-7 py-4 text-sm sm:text-base font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group text-center"
              >
                <span>Request Custom Demo</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onLogin}
                className="px-6 py-3.5 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all cursor-pointer text-center"
              >
                Existing Broker Portal Login
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80 text-xs">
          
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                LeadFlow<span className="text-cyan-400 font-extrabold ml-0.5">CRM</span>
              </span>
            </a>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The modern B2B multi-tenant mortgage CRM platform tailored for German mortgage brokerages (§ 34i GewO), automating expat lead acquisition and bank document packaging.
            </p>

            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Taunusanlage 8, 60329 Frankfurt am Main, Germany</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>kontakt@leadflowcrm.de</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Product & Modules
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#features" className="hover:text-cyan-300 transition-colors">Automated Lead Capture</a></li>
              <li><a href="#features" className="hover:text-cyan-300 transition-colors">German Document OCR</a></li>
              <li><a href="#interactive-pipeline" className="hover:text-cyan-300 transition-colors">Kanban Pipeline Manager</a></li>
              <li><a href="#features" className="hover:text-cyan-300 transition-colors">Multi-tenant Security</a></li>
              <li><a href="#calculator" className="hover:text-cyan-300 transition-colors">Broker ROI Calculator</a></li>
              <li><a href="#pricing" className="hover:text-cyan-300 transition-colors">Pricing & Plans</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              German Compliance
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="text-slate-300">§ 34i GewO Guidelines</span></li>
              <li><span className="text-slate-300">BaFin Regulatory Audit</span></li>
              <li><span className="text-slate-300">DSGVO / EU GDPR Security</span></li>
              <li><span className="text-slate-300">Europace & eHyp Gateway</span></li>
              <li><span className="text-slate-300">ISO 27001 Data Centers</span></li>
              <li><span className="text-slate-300">Frankfurt Server Hosting</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Rechtliches / Legal
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Impressum (Legal Notice)</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Datenschutzerklärung (GDPR)</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Allgemeine Geschäftsbedingungen</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Auftragsverarbeitung (AVV)</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Security Whitepaper</a></li>
              <li><a href="#" className="hover:text-cyan-300 transition-colors">Status & System Health</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} LeadFlow CRM Technologies GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex items-center gap-6">
            <span>Hosted in Frankfurt (Germany)</span>
            <span>·</span>
            <span>256-bit TLS Bank Grade Encryption</span>
          </div>
        </div>

      </div>

    </footer>
  );
};
