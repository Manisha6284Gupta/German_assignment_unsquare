import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import { AuthUser } from '../../types';

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
    status: 'analyzing',
    uploadedDate: '10 mins ago',
    ocrScore: 94.2,
    extractedDetails: 'DATEV OCR reading 3-month DKB checking account...',
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
  const [documents, setDocuments] = useState<BorrowerDocument[]>(INITIAL_DOCUMENTS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);

  const categories = ['All', 'Income & Employment', 'Identity & Visa', 'Financial History', 'Property Dossier'];

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const progressPercent = Math.round((verifiedCount / documents.length) * 100);

  const handleSimulateUpload = (docId: string) => {
    setIsUploading(true);
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'analyzing',
          uploadedDate: 'Just now',
          fileSize: '3.2 MB',
          extractedDetails: 'DATEV OCR engine analyzing German metadata...'
        };
      }
      return d;
    }));

    setTimeout(() => {
      setDocuments(prev => prev.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            status: 'verified',
            ocrScore: 99.4,
            extractedDetails: 'OCR Verified: BaFin & DSGVO compliant document certificate matched.'
          };
        }
        return d;
      }));
      setIsUploading(false);
      setUploadSuccessNotice('Document successfully uploaded & verified with 99.4% OCR confidence!');
      setTimeout(() => setUploadSuccessNotice(null), 3500);
    }, 2000);
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
              { step: '1', name: 'Application Initialized', desc: 'Case DEAL-8491 opened', state: 'completed' },
              { step: '2', name: 'Document Vault (OCR)', desc: `${verifiedCount} of ${documents.length} verified`, state: 'current' },
              { step: '3', name: 'Bank Matching', desc: 'Pre-matched to ING-DiBa', state: 'upcoming' },
              { step: '4', name: 'Binding Bank Offer', desc: '3.42% interest rate locked', state: 'upcoming' },
              { step: '5', name: 'Notary Signing', desc: 'Kaufvertrag execution', state: 'upcoming' },
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

        {/* Notice Toast */}
        {uploadSuccessNotice && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>{uploadSuccessNotice}</div>
          </div>
        )}

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

            {/* Category Filter Pills */}
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
                  <div className="flex items-center gap-3 ml-auto sm:ml-0">
                    {isVerified && (
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> OCR Verified ({doc.ocrScore}%)
                        </span>
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
                        onClick={() => handleSimulateUpload(doc.id)}
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
    </div>
  );
};

export default ClientPortalDashboard;
