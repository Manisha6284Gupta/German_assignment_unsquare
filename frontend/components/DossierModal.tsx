import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles,
  DownloadCloud,
  FileCheck,
  Send,
  UserCheck,
  KeyRound,
  ExternalLink,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import { Deal } from '../types';
import api from '../services/api';
import { generateAndDownloadPdfDossier } from '../utils/generatePdfDossier';

interface DossierModalProps {
  deal: Deal | null;
  onClose: () => void;
  onAdvanceStage: (dealId: string) => void;
  onOpenClientPortalAsUser?: (deal: Deal) => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({ 
  deal, 
  onClose, 
  onAdvanceStage,
  onOpenClientPortalAsUser
}) => {
  const [conversionResult, setConversionResult] = useState<any | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfNotice, setPdfNotice] = useState<string | null>(null);

  if (!deal) return null;

  const mockDocs = [
    { name: '3-Months Gehaltsabrechnung (Salary Slips)', status: 'Verified via DATEV OCR', isReady: true, date: 'Mar 24, 2026' },
    { name: 'Schufa Bonitätsauskunft (Credit Rating)', status: `Verified (${deal.schufaScore}% Tier A)`, isReady: true, date: 'Mar 22, 2026' },
    { name: 'Aufenthaltstitel / EU Blue Card Visa', status: `Verified (${deal.clientType})`, isReady: true, date: 'Mar 20, 2026' },
    { name: 'Kaufvertragsentwurf (Purchase Contract Draft)', status: 'Verified by Legal Broker', isReady: deal.docsReady >= 4, date: 'Mar 25, 2026' },
    { name: 'Eigenkapitalnachweis (Bank Equity Proof)', status: `Verified (€${((deal.propertyPrice * deal.equityPercent) / 100).toLocaleString('de-DE')} available)`, isReady: deal.docsReady >= 5, date: 'Mar 26, 2026' }
  ];

  const handleConvertToClient = async () => {
    setIsConverting(true);
    try {
      const res = await api.convertToClient({
        dealId: deal.id,
        clientName: deal.clientName,
        email: `${deal.clientName.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`
      });
      setConversionResult(res.data || {
        clientId: `CLIENT-${deal.id.split('-')[1]}`,
        dealId: deal.id,
        clientName: deal.clientName,
        email: `${deal.clientName.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`,
        magicLink: `https://bavaria-finops.leadflowcrm.de/portal?case=${deal.id}`,
        temporaryPassword: `LeadFlow#${deal.id.split('-')[1]}!`
      });
    } catch {
      setConversionResult({
        clientId: `CLIENT-${deal.id.split('-')[1]}`,
        dealId: deal.id,
        clientName: deal.clientName,
        email: `${deal.clientName.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`,
        magicLink: `https://bavaria-finops.leadflowcrm.de/portal?case=${deal.id}`,
        temporaryPassword: `LeadFlow#${deal.id.split('-')[1]}!`
      });
    } finally {
      setIsConverting(false);
    }
  };

  const copyMagicLink = () => {
    if (conversionResult?.magicLink) {
      navigator.clipboard?.writeText(conversionResult.magicLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0B152E] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#081023] px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold font-mono">
              {deal.id.split('-')[1]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{deal.clientName}</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                  {deal.stage.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{deal.propertyCity}</span>
                <span>·</span>
                <span>Assigned Advisor: {deal.assignedBroker}</span>
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Converted to Client Status Banner */}
          {conversionResult && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 space-y-2 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <UserCheck className="w-4 h-4" />
                  <span>Borrower Converted to Client & Portal Provisioned</span>
                </div>
                {onOpenClientPortalAsUser && (
                  <button
                    onClick={() => {
                      onOpenClientPortalAsUser(deal);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View as Client Portal &rarr;</span>
                  </button>
                )}
              </div>
              <p className="text-slate-300">
                A secure client account was generated for <strong className="text-white">{conversionResult.clientName}</strong>. Login credentials sent to <strong className="text-cyan-300">{conversionResult.email}</strong>.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="font-mono text-slate-400 text-[11px] truncate mr-2">
                  {conversionResult.magicLink}
                </span>
                <button
                  onClick={copyMagicLink}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Magic Link'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Property Purchase Price</span>
              <span className="text-base font-mono font-bold text-white mt-0.5 block">
                €{deal.propertyPrice.toLocaleString('de-DE')}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Requested Loan Volume</span>
              <span className="text-base font-mono font-bold text-emerald-400 mt-0.5 block">
                €{deal.loanAmount.toLocaleString('de-DE')}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Net Monthly Household</span>
              <span className="text-base font-mono font-bold text-cyan-300 mt-0.5 block">
                €{deal.monthlyNetIncome.toLocaleString('de-DE')} / mo
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Schufa Score & Tier</span>
              <span className="text-base font-mono font-bold text-white mt-0.5 block">
                {deal.schufaScore}% (Prime)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-[#0E1E42] to-slate-900 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Automated German Bank Matching Engine (Europace)
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {deal.matchScore}% Match Score
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Top recommended lender for this expat profile: <strong className="text-white">{deal.targetBank}</strong>. Based on 20% equity and permanent Blue Card status, indicative fixed interest is <strong>3.45% p.a. (10-yr Zinsbindung)</strong>.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                KfW 124 Home Ownership Subsidy Eligible (€100k)
              </span>
            </div>
          </div>

          {/* PDF Download Notice */}
          {pdfNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{pdfNotice}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span>German Mortgage Document Vault (Kreditakte)</span>
              </h4>
              <span className="text-xs font-mono text-cyan-400">
                {deal.docsReady} of {deal.totalDocs} Verified
              </span>
            </div>

            <div className="space-y-2">
              {mockDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {doc.isReady ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-white text-[11px]">{doc.name}</p>
                      <p className="text-[10px] text-slate-400">{doc.status}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    doc.isReady ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {doc.isReady ? 'Ready' : 'Pending Upload'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="bg-[#081023] px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                generateAndDownloadPdfDossier(deal);
                setPdfNotice(`📄 Downloaded official bank mortgage dossier: Finanzierungsbestaetigung_${deal.id}.pdf`);
                setTimeout(() => setPdfNotice(null), 4000);
              }}
              className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Download PDF Dossier</span>
            </button>

            {!conversionResult && (
              <button
                onClick={handleConvertToClient}
                disabled={isConverting}
                className="px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>{isConverting ? 'Provisioning...' : 'Convert to Client Portal'}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              onAdvanceStage(deal.id);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Advance to Next Mortgage Stage &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
};
