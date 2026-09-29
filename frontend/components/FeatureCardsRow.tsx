import React from 'react';
import { 
  Globe2, 
  FileCheck2, 
  Users2, 
  LockKeyhole, 
  ArrowUpRight, 
  Check, 
  Sparkles
} from 'lucide-react';

export const FeatureCardsRow: React.FC = () => {
  const features = [
    {
      title: "Automated Lead Capture",
      subtitle: "Multi-Channel Ingestion & Multilingual Forms",
      description: "Directly capture and qualify expat and domestic leads from ImmoScout24, Immowelt, Meta Ads, and custom multilingual landing page widgets.",
      icon: Globe2,
      accentColor: "from-cyan-500 to-blue-600",
      highlights: [
        "Pre-qualifies expat visa status & equity ratio",
        "Auto-sync with Meta & Google Ad campaigns",
        "Instant WhatsApp & SMS confirmation triggers"
      ],
      statText: "3.4x Faster Lead Response"
    },
    {
      title: "Efficient Document Management",
      subtitle: "Automated German Bank Checklist & OCR",
      description: "Eliminate lost PDFs. Intelligent document requests for German Blue Cards, 3-months Gehaltsabrechnungen, Lohnsteuerbescheinigung, and Schufa reports.",
      icon: FileCheck2,
      accentColor: "from-emerald-500 to-teal-600",
      highlights: [
        "Automatic DATEV salary slip OCR extraction",
        "One-click bank submission package PDF generator",
        "Automated missing document reminder sequence"
      ],
      statText: "-65% Document Collection Time"
    },
    {
      title: "Collaborative Pipeline",
      subtitle: "Multi-Advisor Routing & Live Client Portal",
      description: "Keep your entire brokerage synchronized. Assign files dynamically, track bank communication milestones, and offer buyers a clean co-branded tracking portal.",
      icon: Users2,
      accentColor: "from-blue-600 to-indigo-600",
      highlights: [
        "Round-robin lead distribution across advisors",
        "Europace & Interhyp status timeline updates",
        "White-label client tracking dashboard"
      ],
      statText: "14.2 Days to Final Bank Offer"
    },
    {
      title: "Multi-tenant Security",
      subtitle: "Enterprise Isolation & BaFin Compliance",
      description: "Built strictly for the German financial sector. Every brokerage enjoys cryptographic tenant isolation, GDPR/DSGVO compliance, and Frankfurt hosting.",
      icon: LockKeyhole,
      accentColor: "from-slate-800 to-slate-950",
      highlights: [
        "Hosted in certified Frankfurt ISO 27001 centers",
        "Granular Role-Based Access Controls (RBAC)",
        "End-to-end 256-bit TLS/AES document encryption"
      ],
      statText: "100% BaFin & DSGVO Ready"
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-900/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built Specifically For German Mortgage Workflows</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Four Core Pillars Designed for Maximum Deal Velocity
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            From the initial foreign national inquiry to final notary deed approval, LeadFlow CRM eliminates manual administrative friction at every touchpoint.
          </p>
        </div>

        {/* 4 Distinct White Rounded Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white text-slate-900 rounded-2xl p-7 border border-slate-200 shadow-xl shadow-slate-950/20 hover:shadow-2xl hover:shadow-cyan-900/15 hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${feature.accentColor} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1 group-hover:text-cyan-700 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs font-semibold text-cyan-700 mb-3">
                    {feature.subtitle}
                  </p>

                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-5">
                    {feature.description}
                  </p>

                  <ul className="space-y-2 mb-6 pt-3 border-t border-slate-100">
                    {feature.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] font-mono font-bold text-slate-900">
                    {feature.statText}
                  </div>
                  <a
                    href="#interactive-pipeline"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View demo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
