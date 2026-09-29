import React, { useState } from 'react';
import { 
  Languages, 
  FileCheck, 
  Network, 
  ShieldCheck, 
  Check
} from 'lucide-react';

export const DeepDiveFeatures: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const deepDives = [
    {
      id: 'lead-capture',
      title: 'Multilingual Expat Lead Ingestion',
      category: 'Inbound Growth',
      description: 'Foreign professionals in Germany struggle with German-only banking terms (Grunderwerbsteuer, Zinsbindung, Eigenkapitalquote). LeadFlow provides customizable expat intake forms that auto-translate and pre-calculate financing eligibility.',
      icon: Languages,
      bullets: [
        'Available in English, German, French, Spanish, Hindi, and Mandarin',
        'Direct API webhooks for ImmoScout24, Immowelt, Meta Lead Ads, and Zapier',
        'Automatic residency permit check (EU Blue Card, Niederlassungserlaubnis, Freelance Visa)'
      ],
      previewSnippet: {
        title: 'Expat Eligibility Pre-Check',
        status: 'Qualified · 98% Match',
        items: [
          { label: 'Visa Type', val: 'EU Blue Card (Sec. 18b Abs. 2)' },
          { label: 'Time in Germany', val: '3.5 Years (Permanent Eligible)' },
          { label: 'Max Financing', val: '€780,000 (100% Kaufpreis + Nebenkosten)' }
        ]
      }
    },
    {
      id: 'ocr-vault',
      title: 'Smart DATEV & German Document OCR',
      category: 'Document Vault',
      description: 'Stop chasing missing payslips. LeadFlow reads German salary statements (Gehaltsabrechnung), tax assessments (Einkommensteuerbescheid), and Schufa PDFs, extracting net income, variable bonuses, and credit records automatically.',
      icon: FileCheck,
      bullets: [
        'Extracts Brutto/Netto salary and employer data with 99.8% precision',
        'Flagging missing pages or outdated Schufa reports before bank submission',
        'Generates one-click standardized German bank PDF dossiers (Kreditakte)'
      ],
      previewSnippet: {
        title: 'DATEV OCR Engine Output',
        status: 'Verified · BaFin Compliant',
        items: [
          { label: 'Net Monthly Income', val: '€9,450.00 / month' },
          { label: 'Schufa Score', val: '98.7% (Rating Tier A)' },
          { label: 'Document Completeness', val: '6 of 6 Verified' }
        ]
      }
    },
    {
      id: 'bank-bridge',
      title: 'Direct German Bank Dispatcher (Europace Bridge)',
      category: 'Bank Integration',
      description: 'Sync files seamlessly with major German mortgage platforms including Europace, eHyp, and direct bank interfaces (ING-DiBa, Commerzbank, DKB, Sparkassen, Volksbanken).',
      icon: Network,
      bullets: [
        'Instant multi-bank interest rate comparison & conditions check',
        'Automated status callbacks when bank underwriters issue loan contracts',
        'Integrated KfW subsidy calculation (KfW 124, 261, 300 programs)'
      ],
      previewSnippet: {
        title: 'Bank Conditions Matrix',
        status: '3 Offers Received',
        items: [
          { label: 'ING-DiBa (10 Yr Fixed)', val: '3.42% p.a. · Instant Pre-Approval' },
          { label: 'Commerzbank (15 Yr)', val: '3.58% p.a. · Best for Expats' },
          { label: 'KfW 300 Sustainable', val: '0.85% p.a. · €150k Subsidized' }
        ]
      }
    },
    {
      id: 'multi-tenant',
      title: 'True Multi-Tenant Security & Whitelabel Portals',
      category: 'Enterprise Governance',
      description: 'Provide your advisors and sub-brokers with dedicated tenant workspaces, while delivering a sleek white-label client portal bearing your brokerage brand, colors, and domain.',
      icon: ShieldCheck,
      bullets: [
        'Dedicated database schema isolation per brokerage',
        'Custom domain support (e.g. portal.yourbrokerage.de)',
        'Full immutable BaFin audit log for all document views and exports'
      ],
      previewSnippet: {
        title: 'Tenant Security Telemetry',
        status: 'ISO 27001 Certified',
        items: [
          { label: 'Data Center', val: 'AWS Frankfurt (eu-central-1)' },
          { label: 'Encryption', val: 'AES-256 At Rest / TLS 1.3' },
          { label: 'Tenant Isolation', val: 'Cryptographic Virtual Partition' }
        ]
      }
    }
  ];

  const current = deepDives[activeFeature];

  return (
    <section className="py-20 bg-[#070D1E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3 text-left">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Engineered For German Market Complexity
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Capabilities That Generic CRMs Simply Cannot Handle
          </h2>
        </div>

        {/* Feature Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {deepDives.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeFeature === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFeature(idx)}
                className={`p-4 rounded-xl text-left transition-all border cursor-pointer flex items-start gap-3 ${
                  isActive
                    ? 'bg-slate-850 border-cyan-500/60 shadow-lg shadow-cyan-950/30 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                    {item.category}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white block mt-0.5">
                    {item.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Feature Showcase Box */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Explanation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
                <span>Capability 0{activeFeature + 1}</span>
                <span>·</span>
                <span>{current.category}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {current.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-3 pt-2">
                {current.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </div>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Preview Snippet */}
            <div className="lg:col-span-5 bg-slate-950 rounded-xl p-6 border border-slate-800 space-y-4 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white">{current.previewSnippet.title}</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {current.previewSnippet.status}
                </span>
              </div>

              <div className="space-y-3">
                {current.previewSnippet.items.map((it, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">{it.label}</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300 mt-0.5 block">
                      {it.val}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-dashed border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Synchronized with German banking protocols & BaFin audit trails.</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
