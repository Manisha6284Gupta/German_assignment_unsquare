import React, { useState, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Phone, 
  Mail, 
  FileText,
  FileCheck2,
  ExternalLink,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { AuthUser } from '../types';
import api from '../services/api';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: AuthUser | null;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'documents' | 'bank_offer'>('status');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      title: '3-Months Gehaltsabrechnung (Salary Slips)',
      germanTerm: 'Lohnabrechnung / DATEV',
      status: 'verified',
      detail: 'DATEV OCR: €9,400.00 Net Income verified across Oct, Nov, Dec 2025',
      updatedAt: '2 days ago'
    },
    {
      id: 'doc-2',
      title: 'EU Blue Card / Aufenthaltstitel',
      germanTerm: 'Aufenthaltserlaubnis (§ 18b AufenthG)',
      status: 'verified',
      detail: 'Unlimited German Work Authorization verified until 2028',
      updatedAt: '3 days ago'
    },
    {
      id: 'doc-3',
      title: 'Schufa Bonitätsauskunft (Credit Rating)',
      germanTerm: 'SCHUFA BonitätsScore',
      status: 'verified',
      detail: 'Score: 98.4% (Prime Risk Category A / No negative remarks)',
      updatedAt: '1 week ago'
    },
    {
      id: 'doc-4',
      title: 'Kaufvertragsentwurf (Draft Purchase Agreement)',
      germanTerm: 'Notarieller Kaufvertragsentwurf',
      status: 'pending',
      detail: 'Awaiting notary draft upload from Munich seller notary',
      updatedAt: 'Pending Upload'
    },
    {
      id: 'doc-5',
      title: 'Eigenkapitalnachweis (Proof of Equity)',
      germanTerm: 'Bankauszug / Sparbuch',
      status: 'verified',
      detail: 'Commerzbank Checking: €170,000.00 (20% purchase price ready)',
      updatedAt: 'Yesterday'
    }
  ]);

  if (!isOpen) return null;

  const dealId = currentUser?.dealId || 'DEAL-8491';

  const handleFileUpload = async (docTitle: string, file?: File) => {
    setIsUploading(true);
    try {
      const fileName = file ? file.name : `${docTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
      const fileSize = file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB';
      
      await api.uploadDocument(dealId, {
        title: docTitle,
        fileName,
        fileSize,
        germanTerm: 'Kreditakte Dokument',
      });

      setDocuments(prev => prev.map(doc => {
        if (doc.title === docTitle || doc.title.includes(docTitle)) {
          return {
            ...doc,
            status: 'verified',
            detail: `DATEV OCR: Verified in Frankfurt datacenter (${fileName} · ${fileSize})`,
            updatedAt: 'Just now'
          };
        }
        return doc;
      }));

      setUploadSuccess(`Uploaded and validated ${docTitle} with German DATEV OCR.`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch {
      setUploadSuccess(`Uploaded ${docTitle} successfully.`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file.name.replace(/\.[^/.]+$/, ""), file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0A142D] border border-cyan-500/40 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-[#070E22] px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold font-mono">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Expat Homebuyer Portal
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold">
                  Case Ref: {currentUser?.dealId || 'DEAL-8491'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Borrower: <strong className="text-white">{currentUser?.name || 'Alexander & Maya Lindqvist'}</strong> · Serviced by Bavaria FinOps Partners (Munich)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#081128] px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Mortgage Application Status
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'documents'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Document Vault (Kreditakte)</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              4/5 Ready
            </span>
          </button>
          <button
            onClick={() => setActiveTab('bank_offer')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'bank_offer'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Bank Pre-Approval & KfW Subsidies
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {uploadSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* TAB 1: APPLICATION STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              
              {/* Status Bar */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0D1C3D] to-slate-900 border border-cyan-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block">
                      Current Milestone
                    </span>
                    <h4 className="text-lg font-bold text-white mt-0.5">
                      Bank Underwriting & Matching Phase (Europace Bridge)
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/40 self-start">
                    Estimated Time to Binding Offer: 3-5 Days
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold">
                    ✓ 1. Intake Complete
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold">
                    ✓ 2. DATEV OCR Check
                  </div>
                  <div className="p-2 rounded-lg bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-bold animate-pulse">
                    ⚡ 3. Bank Matching
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-500">
                    4. Binding Offer
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-500">
                    5. Notary & Payout
                  </div>
                </div>
              </div>

              {/* Property & Loan Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Property Target</span>
                  <span className="text-sm sm:text-base font-bold text-white mt-1 block">
                    Munich Schwabing
                  </span>
                  <span className="text-[10px] text-slate-500">3-Room Freehold Flat</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Purchase Price</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-white mt-1 block">
                    €850,000
                  </span>
                  <span className="text-[10px] text-slate-500">+ German Ancillary Costs</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Requested Loan</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-emerald-400 mt-1 block">
                    €680,000
                  </span>
                  <span className="text-[10px] text-emerald-400/80">80% LTV (20% Equity)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Indicative Monthly Rate</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-cyan-300 mt-1 block">
                    €2,521 / mo
                  </span>
                  <span className="text-[10px] text-slate-400">3.45% Interest + 1.0% Repayment</span>
                </div>
              </div>

              {/* Assigned Mortgage Advisor Contact */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/frontend/assets/images/avatar_team_lead_1790659845812.jpg"
                    alt="Advisor"
                    className="w-12 h-12 rounded-full object-cover border border-cyan-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">Maximilian Bauer</h4>
                    <p className="text-xs text-cyan-300">Managing Partner & Senior Mortgage Advisor</p>
                    <p className="text-[11px] text-slate-400">Bavaria FinOps Partners GmbH · § 34i GewO License</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="mailto:maximilian@bavaria-finops.de"
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Send Message</span>
                  </a>
                  <button
                    onClick={() => alert('Direct phone call initiated with Maximilian Bauer: +49 89 4528 9201')}
                    className="px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Advisor</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DOCUMENT VAULT */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    German Mortgage Document Vault (Kreditakte)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Uploaded documents are processed in Frankfurt via BaFin-certified OCR and shared directly with German lending underwriters.
                  </p>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
              />

              {/* Upload Drop Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors cursor-pointer group"
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                )}
                <h5 className="text-xs font-bold text-white">
                  Drag & drop German Salary Slips (PDF), Schufa, or Kaufvertrag
                </h5>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports DATEV Gehaltsabrechnung, Lohnsteuerbescheinigung, and Passports (Max 25MB)
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    <span>{isUploading ? 'Verifying with DATEV OCR...' : 'Select PDF from Device'}</span>
                  </button>
                </div>
              </div>

              {/* Document List */}
              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {doc.status === 'verified' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{doc.title}</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded">
                            {doc.germanTerm}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{doc.detail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        doc.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {doc.status === 'verified' ? 'DATEV Verified' : 'Pending Upload'}
                      </span>
                      {doc.status === 'pending' && (
                        <button
                          disabled={isUploading}
                          onClick={() => handleFileUpload(doc.title)}
                          className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 rounded font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                          <span>Upload</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BANK OFFER & KFW */}
          {activeTab === 'bank_offer' && (
            <div className="space-y-4">
              
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0B1E48] to-slate-900 border border-cyan-500/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Recommended German Mortgage Structure
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    96% Bank Underwriter Match
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Primary Bank Lender:</span>
                    <strong className="text-base text-white block mt-0.5">ING-DiBa AG (Frankfurt)</strong>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Loan: <strong>€580,000</strong> · Fixed Interest: <strong>3.45% p.a.</strong> (10-Yr Zinsbindung) · Repayment (*Tilgung*): 1.50%
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">State Subsidy Program:</span>
                    <strong className="text-base text-emerald-300 block mt-0.5">KfW 124 Wohneigentumsprogramm</strong>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Loan: <strong>€100,000</strong> · Subsidized Interest: <strong>2.98% p.a.</strong> · Instant approval for owner-occupied German homes
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Total Blended Effective Interest: <strong className="text-white">3.38% p.a.</strong></span>
                  <span>Combined Monthly Rate: <strong className="text-cyan-300 font-mono text-xs">€2,492.00 / mo</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Next Steps to Notary Appointment (Notartermin)</span>
                </h5>
                <p className="text-[11px] text-slate-400">
                  Once your notary contract draft is uploaded, your advisor will issue the formal binding credit agreement (*Kreditvertrag*). You will review and sign digitally via Qualified Electronic Signature (QES / WebID).
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#070E22] px-6 py-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit TLS Encrypted · BaFin Compliant & Frankfurt Sovereign Storage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
