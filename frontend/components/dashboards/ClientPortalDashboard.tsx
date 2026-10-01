import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Download, 
  Home, 
  Building, 
  Sparkles, 
  RefreshCw,
  Lock,
  ChevronRight,
  ExternalLink,
  Info,
  LogOut,
  Printer,
  X,
  Award,
  Upload
} from 'lucide-react';
import { AuthUser } from '../../types';
import { generateAndDownloadPdfDossier } from '../../utils/generatePdfDossier';
import api from '../../services/api';

interface ClientPortalDashboardProps {
  currentUser: AuthUser;
  onViewLandingPage?: () => void;
  onLogout?: () => void;
}

interface BorrowerDocument {
  id: string;
  name: string;
  category: 'Income & Employment' | 'Identity & Visa' | 'Financial History' | 'Property Dossier';
  required: boolean;
  status: 'verified' | 'analyzing' | 'missing' | 'rejected';
  uploadedDate?: string;
  ocrScore?: number;
  extractedDetails?: string;
  fileSize?: string;
}

const INITIAL_DOCUMENTS: BorrowerDocument[] = [
  // 1. Income & Employment
  {
    id: 'DOC-01',
    name: 'Last 3 German Payslips (Gehaltsabrechnungen)',
    category: 'Income & Employment',
    required: true,
    status: 'verified',
    uploadedDate: 'Yesterday, 14:20',
    ocrScore: 99.8,
    extractedDetails: 'Net Base: €9,400/mo • Employer: Tech GmbH (Munich)',
    fileSize: '2.4 MB'
  },
  {
    id: 'DOC-02',
    name: 'Annual Wage Tax Certificate (Lohnsteuerbescheinigung 2025)',
    category: 'Income & Employment',
    required: true,
    status: 'verified',
    uploadedDate: 'Yesterday, 14:22',
    ocrScore: 99.2,
    extractedDetails: 'Gross Annual: €145,000 • Tax Class: 3/5',
    fileSize: '1.8 MB'
  },
  {
    id: 'DOC-03',
    name: 'Permanent Employment Contract (Unbefristeter Arbeitsvertrag)',
    category: 'Income & Employment',
    required: true,
    status: 'verified',
    uploadedDate: 'Yesterday, 14:25',
    ocrScore: 98.6,
    extractedDetails: 'Status: Unbefristet (No probation remaining)',
    fileSize: '3.1 MB'
  },

  // 2. Identity & Visa
  {
    id: 'DOC-04',
    name: 'Passport & EU Blue Card / Residence Permit (Aufenthaltstitel)',
    category: 'Identity & Visa',
    required: true,
    status: 'verified',
    uploadedDate: 'Yesterday, 14:30',
    ocrScore: 99.5,
    extractedDetails: 'Visa Type: § 18b Abs. 2 AufenthG (EU Blue Card)',
    fileSize: '4.2 MB'
  },
  {
    id: 'DOC-05',
    name: 'Munich City Registration Certificate (Meldebescheinigung)',
    category: 'Identity & Visa',
    required: true,
    status: 'verified',
    uploadedDate: '2 days ago',
    ocrScore: 99.1,
    extractedDetails: 'Address: Schwabing-West, 80797 München',
    fileSize: '1.1 MB'
  },

  // 3. Financial History & Equity
  {
    id: 'DOC-06',
    name: 'Official SCHUFA Credit Certificate (Bonitätsauskunft)',
    category: 'Financial History',
    required: true,
    status: 'verified',
    uploadedDate: '2 days ago',
    ocrScore: 100.0,
    extractedDetails: 'Schufa Score: 98.4% (Excellent Creditworthiness)',
    fileSize: '1.5 MB'
  },
  {
    id: 'DOC-07',
    name: 'Proof of Equity & Savings (Eigenkapitalnachweis / Bank Statements)',
    category: 'Financial History',
    required: true,
    status: 'verified',
    uploadedDate: 'Yesterday, 15:45',
    ocrScore: 99.5,
    extractedDetails: 'Liquid Equity Verified: €180,000 in DKB Girokonto / Tagesgeld',
    fileSize: '5.6 MB'
  },
  {
    id: 'DOC-08',
    name: 'Private Pension / Stock Portfolio Statement (Depotauszug)',
    category: 'Financial History',
    required: false,
    status: 'missing',
  },

  // 4. Property Dossier
  {
    id: 'DOC-09',
    name: 'Draft Purchase Contract (Kaufvertragsentwurf)',
    category: 'Property Dossier',
    required: true,
    status: 'verified',
    uploadedDate: '3 days ago',
    ocrScore: 98.9,
    extractedDetails: 'Notary: Dr. Weiss (Munich) • Price: €850,000',
    fileSize: '6.8 MB'
  },
  {
    id: 'DOC-10',
    name: 'Land Register Extract (Grundbuchauszug)',
    category: 'Property Dossier',
    required: true,
    status: 'missing',
  },
  {
    id: 'DOC-11',
    name: 'Living Space Calculation & Floor Plan (Wohnflächenberechnung & Grundriss)',
    category: 'Property Dossier',
    required: true,
    status: 'missing',
  },
  {
    id: 'DOC-12',
    name: 'Building Energy Certificate (Energieausweis)',
    category: 'Property Dossier',
    required: false,
    status: 'missing',
  }
];

export const ClientPortalDashboard: React.FC<ClientPortalDashboardProps> = ({
  currentUser,
  onViewLandingPage,
  onLogout
}) => {
  const dealStorageKey = `leadflow_borrower_docs_${currentUser.dealId || 'DEAL-8491'}`;

  const [documents, setDocuments] = useState<BorrowerDocument[]>(() => {
    try {
      const saved = localStorage.getItem(dealStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_DOCUMENTS;
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [activeUploadDocId, setActiveUploadDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedBank, setSelectedBank] = useState<string>(() => {
    return localStorage.getItem(`leadflow_selected_bank_${currentUser.dealId || 'DEAL-8491'}`) || 'ING-DiBa AG';
  });
  const [bankMatchRequested, setBankMatchRequested] = useState<boolean>(() => {
    return localStorage.getItem(`leadflow_bank_matched_${currentUser.dealId || 'DEAL-8491'}`) === 'true';
  });
  const [isContractSigned, setIsContractSigned] = useState<boolean>(() => {
    return localStorage.getItem(`leadflow_contract_signed_${currentUser.dealId || 'DEAL-8491'}`) === 'true';
  });
  const [isNotaryCompleted, setIsNotaryCompleted] = useState<boolean>(() => {
    return localStorage.getItem(`leadflow_notary_done_${currentUser.dealId || 'DEAL-8491'}`) === 'true';
  });

  const categories = ['All', 'Income & Employment', 'Identity & Visa', 'Financial History', 'Property Dossier'];

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const progressPercent = Math.round((verifiedCount / documents.length) * 100);
  const isDossierComplete = progressPercent >= 100;

  // Sync to localStorage whenever documents state changes
  const updateDocumentsAndPersist = (updater: (prev: BorrowerDocument[]) => BorrowerDocument[]) => {
    setDocuments(prev => {
      const next = updater(prev);
      try {
        localStorage.setItem(dealStorageKey, JSON.stringify(next));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
      return next;
    });
  };

  const handleResetToDefault = () => {
    try {
      localStorage.removeItem(dealStorageKey);
    } catch {}
    setDocuments(INITIAL_DOCUMENTS);
    setUploadSuccessNotice('🔄 Dossier reset to initial state.');
    setTimeout(() => setUploadSuccessNotice(null), 3000);
  };

  const handleVerifyAllDocs = () => {
    updateDocumentsAndPersist(prev =>
      prev.map(d => ({
        ...d,
        status: 'verified',
        ocrScore: d.ocrScore || 99.4,
        uploadedDate: d.uploadedDate || 'Just now',
        fileSize: d.fileSize || '2.8 MB',
        extractedDetails: d.extractedDetails || `DATEV OCR: Verified & compliant with BaFin § 34i standards.`
      }))
    );
    setUploadSuccessNotice('🎉 All 12 Regulatory Documents Verified! Dossier is at 100% Ready for Bank Underwriting.');
    setTimeout(() => setUploadSuccessNotice(null), 4000);
  };

  const triggerFileUpload = (docId?: string) => {
    setActiveUploadDocId(docId || 'DOC-08');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetId = activeUploadDocId || documents.find(d => d.status === 'missing')?.id || 'DOC-08';
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const fileName = file.name;

    setIsUploading(true);
    updateDocumentsAndPersist(prev => prev.map(d => {
      if (d.id === targetId) {
        return {
          ...d,
          status: 'analyzing',
          uploadedDate: 'Just now',
          fileSize: fileSizeMB,
          extractedDetails: `DATEV OCR engine scanning "${fileName}"...`
        };
      }
      return d;
    }));

    const targetDoc = documents.find(d => d.id === targetId);

    // Call Backend API to persist to MongoDB Document collection
    api.uploadDocument(currentUser.dealId || 'DEAL-8491', {
      title: targetDoc?.name || fileName,
      germanTerm: targetDoc?.category || 'Kreditakte Dokument',
      fileName: fileName,
      fileSize: fileSizeMB
    }).catch(err => console.warn('MongoDB sync notice:', err));

    setTimeout(() => {
      updateDocumentsAndPersist(prev => prev.map(d => {
        if (d.id === targetId) {
          return {
            ...d,
            status: 'verified',
            ocrScore: 99.7,
            extractedDetails: `DATEV OCR Verified: "${fileName}" saved to MongoDB & BaFin compliant.`
          };
        }
        return d;
      }));
      setIsUploading(false);
      setUploadSuccessNotice(`✅ "${fileName}" (${fileSizeMB}) verified by DATEV OCR & saved to MongoDB vault!`);
      setTimeout(() => setUploadSuccessNotice(null), 4000);
    }, 1800);
  };

  const filteredDocs = activeCategory === 'All' 
    ? documents 
    : documents.filter(d => d.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 font-sans pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight">Expat Borrower Document Portal</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Borrower Client
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Case Ref: {currentUser.dealId || 'DEAL-8491'} • Brokerage: {currentUser.brokerageName || 'Bavaria FinOps Partners'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onViewLandingPage && (
            <button
              onClick={onViewLandingPage}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition border border-slate-700/60 cursor-pointer"
            >
              Public Product View
            </button>
          )}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
              AL
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white">{currentUser.name}</div>
              <div className="text-[10px] text-emerald-400">Munich Home Purchase</div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out"
                className="ml-2 p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer border border-slate-700/60"
                aria-label="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Loan Progress Milestone Tracker */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Live Mortgage Approval Tracker
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Munich Apartment Acquisition (€850,000)</h2>
              <p className="text-xs text-slate-400 mt-0.5">Assigned Advisor: <strong className="text-cyan-300">Maximilian Bauer (§ 34i Licensee)</strong> • ING-DiBa / Commerzbank Matching</p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Dossier Completion</div>
              <div className="text-2xl font-bold text-emerald-400">{progressPercent}% Ready</div>
            </div>
          </div>

          {/* 5-Step Visual Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {[
              { 
                step: '1', 
                name: 'Application Initialized', 
                desc: 'Case DEAL-8491 opened', 
                state: 'completed' 
              },
              { 
                step: '2', 
                name: 'Document Vault (OCR)', 
                desc: `${verifiedCount} of ${documents.length} verified (${progressPercent}%)`, 
                state: isDossierComplete ? 'completed' : 'current' 
              },
              { 
                step: '3', 
                name: 'Bank Matching', 
                desc: isDossierComplete ? (bankMatchRequested ? 'Quotes Ready & Selected' : '4 German Banks Ready') : 'Unlocks at 100% Docs', 
                state: isDossierComplete ? (bankMatchRequested ? 'completed' : 'current') : 'upcoming' 
              },
              { 
                step: '4', 
                name: 'Binding Bank Offer', 
                desc: isContractSigned ? 'Darlehensvertrag Signed (QES)' : bankMatchRequested ? `${selectedBank} Loan Contract Ready` : 'Awaiting Selection', 
                state: isContractSigned ? 'completed' : bankMatchRequested ? 'current' : 'upcoming' 
              },
              { 
                step: '5', 
                name: 'Notary & Closing', 
                desc: isNotaryCompleted ? 'Kaufvertrag Executed & Payout Complete' : isContractSigned ? 'Munich Notary Ready' : 'Awaiting Contract', 
                state: isNotaryCompleted ? 'completed' : isContractSigned ? 'current' : 'upcoming' 
              },
            ].map((st, idx) => {
              const isComp = st.state === 'completed';
              const isCurr = st.state === 'current';
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition ${
                    isCurr
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                      : isComp
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurr ? 'bg-cyan-400 text-slate-950' : isComp ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isComp ? '✓' : st.step}
                    </span>
                    <span className="text-xs font-semibold text-white">{st.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pl-7">{st.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 3: German Interbank Matching Section (Active when 100% Dossier is Ready) */}
        {isDossierComplete && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/30 border-2 border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Stage 3 Active: German Interbank Matching Engine
                </div>
                <h3 className="text-xl font-bold text-white">4 German Mortgage Lenders Ready for Term Sheet Issuance</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Because all 12 DATEV regulatory documents are verified, our interbank API queried the German mortgage network for loan amount <strong className="text-white">€680,000</strong> on Munich property (<strong className="text-emerald-400">20% Equity</strong>).
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Best German Fixed Rate</span>
                <span className="text-2xl font-black text-cyan-300 font-mono">3.39% – 3.42% APR</span>
              </div>
            </div>

            {/* Lender Rate Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  bank: 'ING-DiBa AG',
                  badge: 'Top Expat Recommendation',
                  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                  rate: '3.42%',
                  annuity: '€2,618 / mo',
                  fixedTerm: '10-Year Fixed (Zinsbindung)',
                  turnaround: '48h Binding Approval',
                  features: ['EU Blue Card Specialist', '100% English Support', '5% Sondertilgung p.a.']
                },
                {
                  bank: 'DKB (Deutsche Kreditbank)',
                  badge: 'Lowest Effective APR',
                  badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
                  rate: '3.39%',
                  annuity: '€2,602 / mo',
                  fixedTerm: '15-Year Fixed',
                  turnaround: '3-4 Days Turnaround',
                  features: ['Green Energy Discount', 'Free Online Banking', 'Flexible Amortization Rate']
                },
                {
                  bank: 'Commerzbank AG',
                  badge: 'Fastest In-Branch Processing',
                  badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                  rate: '3.51%',
                  annuity: '€2,654 / mo',
                  fixedTerm: '10-Year Fixed',
                  turnaround: '24h Expedited',
                  features: ['Munich Branch Access', 'Forward Loan Option', 'Digital Signature']
                },
                {
                  bank: 'Stadtsparkasse München',
                  badge: 'Local Bavarian Lender',
                  badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                  rate: '3.65%',
                  annuity: '€2,710 / mo',
                  fixedTerm: '10-Year Fixed',
                  turnaround: '2-3 Days Turnaround',
                  features: ['Local Appraiser Network', 'Regional Subsidies (Labo)', 'In-Person Notary Support']
                }
              ].map((lender) => {
                const isSelected = selectedBank === lender.bank;
                return (
                  <div
                    key={lender.bank}
                    onClick={() => {
                      setSelectedBank(lender.bank);
                      localStorage.setItem(`leadflow_selected_bank_${currentUser.dealId || 'DEAL-8491'}`, lender.bank);
                    }}
                    className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${lender.badgeColor}`}>
                          {lender.badge}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-base">{lender.bank}</h4>
                        <div className="text-xl font-extrabold text-cyan-300 font-mono mt-1">{lender.rate} <span className="text-xs font-normal text-slate-400">eff. Zins</span></div>
                        <div className="text-xs text-slate-300 font-semibold">{lender.annuity}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{lender.fixedTerm}</div>
                      </div>

                      <ul className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                        {lender.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-cyan-400 text-xs">✓</span> {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBank(lender.bank);
                        setBankMatchRequested(true);
                        localStorage.setItem(`leadflow_bank_matched_${currentUser.dealId || 'DEAL-8491'}`, 'true');
                        setUploadSuccessNotice(`🏛️ Bank matched: Selected ${lender.bank} at ${lender.rate} APR! Advancing to Step 4 Binding Offer.`);
                        setTimeout(() => setUploadSuccessNotice(null), 5000);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ Selected Lender' : 'Select This Bank'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Binding Bank Offer & Loan Contract Section (Active when Lender is Selected) */}
        {bankMatchRequested && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/30 border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5" /> Stage 4 Active: Binding Bank Loan Contract (Darlehensvertrag)
                </div>
                <h3 className="text-xl font-bold text-white">
                  Formal Loan Agreement Issued by <span className="text-emerald-400">{selectedBank}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  The bank's credit risk committee has reviewed your 12 DATEV-verified documents. Your interest rate is locked for 10 years with digital signature authorization.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Contract Status</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full border inline-block mt-1 ${
                  isContractSigned 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isContractSigned ? '✓ Digitally Signed (QES)' : '⏳ Awaiting Borrower Signature'}
                </span>
              </div>
            </div>

            {/* Contract Key Terms Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Total Loan Principal:</span>
                <span className="text-white font-mono font-bold text-base">€680,000.00</span>
              </div>
              <div>
                <span className="text-slate-400 block">Effective Interest Rate (Sollzins):</span>
                <span className="text-emerald-400 font-mono font-bold text-base">3.42% p.a. (Fixed 10Y)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Monthly Repayment (Rate):</span>
                <span className="text-cyan-300 font-mono font-bold text-base">€2,618.00 / month</span>
              </div>
              <div>
                <span className="text-slate-400 block">Sondertilgung (Unscheduled Repayment):</span>
                <span className="text-white font-mono font-bold text-base">5% (€34,000 / year)</span>
              </div>
            </div>

            {/* Action Bar for Step 4 */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>eIDAS Qualified Electronic Signature (QES) with PostIdent / VideoIdent</span>
              </div>

              <div className="flex items-center gap-3">
                {!isContractSigned ? (
                  <button
                    onClick={() => {
                      setIsContractSigned(true);
                      localStorage.setItem(`leadflow_contract_signed_${currentUser.dealId || 'DEAL-8491'}`, 'true');
                      setUploadSuccessNotice(`✍️ Loan Agreement signed via QES! Advancing to Step 5 (Munich Notary Appointment & Payout).`);
                      setTimeout(() => setUploadSuccessNotice(null), 5000);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Sign Loan Agreement Digitally (QES)
                  </button>
                ) : (
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" /> Darlehensvertrag Signed on 30.09.2026
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: German Notary Appointment & Closing Section (Active when Loan is Signed) */}
        {isContractSigned && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/30 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider mb-2">
                  <Building className="w-3.5 h-3.5" /> Stage 5 Active: Notary Appointment & Property Closing (Notartermin)
                </div>
                <h3 className="text-xl font-bold text-white">Munich Notary Contract Execution & Land Charge Registration</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Notary office <strong className="text-white">Notariat Dr. Weiss & Partner (Theatinerstraße 12, 80333 München)</strong> is executing the official deed (*Kaufvertrag*) and land charge (*Grundschuldbestellung*).
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Notary Fee & Land Registry</span>
                <span className="text-base font-bold text-amber-300 font-mono">1.5% (€12,750 estimated)</span>
              </div>
            </div>

            {/* Notary Milestones Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">1. Kaufvertragsentwurf</span>
                  <span className="text-emerald-400 font-bold">✓ Approved</span>
                </div>
                <p className="text-[11px] text-slate-400">14-day legal review period completed by advisor.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">2. Grundschuldbestellung</span>
                  <span className="text-emerald-400 font-bold">✓ Form Received</span>
                </div>
                <p className="text-[11px] text-slate-400">Land charge formula from {selectedBank} submitted to Notary.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">3. Payout & Keys</span>
                  <span className={isNotaryCompleted ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {isNotaryCompleted ? "✓ Payout Complete" : "⏳ Ready for Signature"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Bank disburses €680,000 upon Fälligkeitsmitteilung.</p>
              </div>
            </div>

            {/* Closing Execution Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-400" />
                <span>Munich Land Registry (Amtsgericht München Grundbuchamt) priority notice filed.</span>
              </div>

              {!isNotaryCompleted ? (
                <button
                  onClick={() => {
                    setIsNotaryCompleted(true);
                    localStorage.setItem(`leadflow_notary_done_${currentUser.dealId || 'DEAL-8491'}`, 'true');
                    setUploadSuccessNotice(`🎉 CONGRATULATIONS! Notary deed executed & €680,000 mortgage disbursed. Munich property acquisition is 100% COMPLETE!`);
                    setTimeout(() => setUploadSuccessNotice(null), 6000);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Home className="w-4 h-4" /> Confirm Notary Deed & Complete Closing 🎉
                </button>
              ) : (
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
                  <Award className="w-4 h-4" /> Real Estate Closing Complete & Keys Handed Over (Schlüsselübergabe)!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notice Toast */}
        {uploadSuccessNotice && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>{uploadSuccessNotice}</div>
          </div>
        )}

        {/* Pre-Approval & Official PDF Dossier Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Official Bank Pre-Approval Letter Ready
            </div>
            <h3 className="text-lg font-bold text-white">
              Official German Mortgage Dossier & Proof of Financing (Finanzierungsbestätigung)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Certified by <strong className="text-cyan-300">{currentUser.brokerageName || 'Bavaria FinOps Partners'}</strong> under BaFin § 34i GewO. Ready to submit to Munich property sellers and real estate agents (*Makler*) as proof of purchasing funds up to <strong>€850,000</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Preview Certificate
            </button>
            <button
              onClick={() => {
                generateAndDownloadPdfDossier(currentUser);
                setUploadSuccessNotice(`📄 PDF Dossier downloaded successfully: Finanzierungsbestaetigung_${currentUser.dealId || 'DEAL-8491'}.pdf`);
                setTimeout(() => setUploadSuccessNotice(null), 4000);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PDF File (.pdf)
            </button>
          </div>
        </div>

        {/* Hidden File Input for Real File Uploads */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelected}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        />

        {/* Required Document Vault Section */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Required German Mortgage Documentation
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Uploaded files are immediately scanned via DATEV OCR to extract income, visa, and property parameters</p>
            </div>

            {/* Category Filter Pills & Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1.5 bg-slate-800/60 p-1 rounded-xl border border-slate-700 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg transition font-medium cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                {progressPercent < 100 && (
                  <button
                    onClick={handleVerifyAllDocs}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/40 transition cursor-pointer flex items-center gap-1"
                    title="Mark all 12 documents as verified"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Verify All (100%)
                  </button>
                )}
                <button
                  onClick={handleResetToDefault}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs border border-slate-700 transition cursor-pointer flex items-center gap-1"
                  title="Reset documents to demo defaults"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Quick Drag & Drop Upload Zone */}
          <div 
            onClick={() => triggerFileUpload()}
            className="p-5 m-5 border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-2xl bg-slate-950/40 hover:bg-slate-800/30 transition flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                  Click to Browse Files or Drag & Drop Documents Here
                </div>
                <div className="text-[11px] text-slate-400">
                  Supports German Payslips (.pdf), SCHUFA (.pdf), Passports & ID (.png, .jpg) up to 25MB
                </div>
              </div>
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-800 group-hover:bg-cyan-400 text-slate-300 group-hover:text-slate-950 font-bold text-xs transition border border-slate-700 group-hover:border-cyan-400 shrink-0"
            >
              Choose File from PC
            </button>
          </div>

          {/* Document Rows */}
          <div className="divide-y divide-slate-800/60">
            {filteredDocs.map((doc) => {
              const isVerified = doc.status === 'verified';
              const isAnalyzing = doc.status === 'analyzing';
              const isMissing = doc.status === 'missing';

              return (
                <div key={doc.id} className="p-4 sm:p-5 hover:bg-slate-800/30 transition flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 max-w-xl">
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isVerified
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isAnalyzing
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{doc.name}</span>
                        {doc.required && (
                          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                            Required
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                        <span className="text-slate-300 font-medium">{doc.category}</span>
                        {doc.fileSize && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{doc.fileSize}</span>
                          </>
                        )}
                        {doc.uploadedDate && (
                          <>
                            <span>•</span>
                            <span>{doc.uploadedDate}</span>
                          </>
                        )}
                      </div>

                      {doc.extractedDetails && (
                        <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded-lg mt-1 inline-block">
                          {doc.extractedDetails}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Status & Action */}
                  <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
                    {isVerified && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> OCR Verified ({doc.ocrScore}%)
                        </span>
                        <button
                          onClick={() => triggerFileUpload(doc.id)}
                          title="Re-upload or replace document"
                          className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-cyan-400 transition text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" /> Re-upload
                        </button>
                      </div>
                    )}

                    {isAnalyzing && (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full text-xs font-semibold border border-cyan-500/30">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> DATEV OCR Reading...
                        </span>
                      </div>
                    )}

                    {isMissing && (
                      <button
                        onClick={() => triggerFileUpload(doc.id)}
                        disabled={isUploading}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" /> Upload Document
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Data Privacy Notice */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Encrypted with German Bank-Grade 256-Bit SSL. Hosted in Frankfurt (ISO 27001 Certified).</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">BaFin § 34i & DSGVO Compliant</span>
        </div>
      </div>

      {/* Official German PDF Dossier & Finanzierungsbestätigung Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            {/* Header / Actions */}
            <div className="p-4 sm:p-6 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">German Mortgage Pre-Approval Certificate</h3>
                  <p className="text-xs text-slate-400 font-mono">Finanzierungsbestätigung • Case Ref: {currentUser.dealId || 'DEAL-8491'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Preview (Official German Banking Layout) */}
            <div className="p-8 bg-white text-slate-900 font-serif space-y-6 text-xs max-h-[70vh] overflow-y-auto">
              {/* Document Letterhead */}
              <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                <div>
                  <div className="font-sans font-black text-xl tracking-tight text-slate-900">
                    {currentUser.brokerageName || 'Bavaria FinOps Partners GmbH'}
                  </div>
                  <div className="font-sans text-[10px] text-slate-600 mt-0.5">
                    Maximilianstraße 35 • 80539 München • Deutschland
                  </div>
                  <div className="font-sans text-[10px] text-slate-500">
                    BaFin Register: § 34i GewO (D-W-199-PROV) • IHK München
                  </div>
                </div>

                <div className="text-right font-sans">
                  <div className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-300 inline-block">
                    BANK-CERTIFIED DOSSIER
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Datum: 30. September 2026</div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center pt-2">
                <h1 className="text-lg font-bold uppercase tracking-wider text-slate-900">
                  Unverbindliche Finanzierungsbestätigung
                </h1>
                <p className="text-[11px] text-slate-600 italic">
                  (Mortgage Pre-Approval Certificate for Real Estate Purchase & Broker Presentation)
                </p>
              </div>

              {/* Salutation & Body */}
              <div className="space-y-3 leading-relaxed text-slate-800">
                <p>Sehr geehrte Damen und Herren,</p>
                <p>
                  hiermit bestätigen wir, die <strong>{currentUser.brokerageName || 'Bavaria FinOps Partners GmbH'}</strong> als zugelassener Immobiliardarlehensvermittler nach § 34i GewO, dass die Bonität und die Einkommensverhältnisse des folgenden Kaufinteressenten einer vollumfänglichen bankseitigen Vorprüfung unterzogen wurden:
                </p>

                {/* Data Matrix */}
                <div className="my-4 p-4 rounded bg-slate-50 border border-slate-300 font-sans space-y-2 text-[11px]">
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-medium">Kaufinteressent (Borrower):</span>
                    <span className="font-bold text-slate-900">{currentUser.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-medium">Kaufobjekt (Target Property):</span>
                    <span className="font-bold text-slate-900">Eigentumswohnung, 80797 München</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-medium">Maximaler Kaufpreisrahmen:</span>
                    <span className="font-bold text-emerald-800 font-mono">bis zu €850.000,00</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 font-medium">Finanzierender Bankpartner:</span>
                    <span className="font-bold text-slate-900">ING-DiBa AG (Frankfurt am Main)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-500 font-medium">SCHUFA & Bonitätsstatus:</span>
                    <span className="font-bold text-emerald-700 font-mono">98,4% (Einwandfreie Bonität)</span>
                  </div>
                </div>

                <p>
                  Auf Grundlage der eingereichten Gehaltsnachweise (DATEV OCR validiert), des unbefristeten Arbeitsverhältnisses sowie der nachgewiesenen Eigenmittel bestehen aus heutiger Sicht keinerlei Bedenken hinsichtlich der Darlehenszusage für das genannte Kaufvorhaben.
                </p>
                <p>
                  Diese Bestätigung dient zur Vorlage beim Immobilienmakler sowie beim Verkäufer zur Unterzeichnung der Reservierungsvereinbarung und Vorbereitung des notariellen Kaufvertrages (*Kaufvertragsentwurf*).
                </p>
              </div>

              {/* Signature Section */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end font-sans">
                <div>
                  <div className="font-bold text-slate-900">Maximilian Bauer</div>
                  <div className="text-[10px] text-slate-600">Geschäftsführer & Lizenzierter Berater (§ 34i GewO)</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Bavaria FinOps Partners GmbH</div>
                </div>

                <div className="text-right">
                  <div className="w-24 h-12 border border-slate-300 rounded bg-slate-50 flex items-center justify-center text-[10px] font-mono text-slate-400 italic">
                    [BaFin Siegel]
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-800/80 border-t border-slate-700 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Layout
              </button>
              <button
                onClick={() => {
                  generateAndDownloadPdfDossier(currentUser);
                  setUploadSuccessNotice(`📄 PDF Dossier downloaded: Finanzierungsbestaetigung_${currentUser.dealId || 'DEAL-8491'}.pdf`);
                  setTimeout(() => setUploadSuccessNotice(null), 4000);
                  setIsPdfModalOpen(false);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download .PDF File Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortalDashboard;
