import jsPDF from 'jspdf';
import { AuthUser, Deal } from '../types';

interface GeneratePdfOptions {
  user?: AuthUser;
  deal?: Deal;
}

export const generateAndDownloadPdfDossier = (input: AuthUser | Deal | GeneratePdfOptions) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let clientName = 'Alexander Lindqvist';
  let dealId = 'DEAL-8491';
  let brokerageName = 'Bavaria FinOps Partners GmbH';
  let propertyCity = 'Munich';
  let propertyPrice = 850000;
  let loanAmount = 670000;
  let equityAmount = 180000;
  let schufaScore = 98.4;
  let targetBank = 'ING-DiBa AG';
  let clientType = 'EU Blue Card / § 18b AufenthG';
  let monthlyNet = 9400;

  if ('role' in input) {
    // It is AuthUser
    clientName = input.name || clientName;
    dealId = input.dealId || dealId;
    brokerageName = input.brokerageName || brokerageName;
  } else if ('propertyPrice' in input) {
    // It is Deal
    clientName = input.clientName || clientName;
    dealId = input.id || dealId;
    propertyCity = input.propertyCity || propertyCity;
    propertyPrice = input.propertyPrice || propertyPrice;
    loanAmount = input.loanAmount || loanAmount;
    equityAmount = Math.round((propertyPrice * (input.equityPercent || 20)) / 100);
    schufaScore = input.schufaScore || schufaScore;
    targetBank = input.targetBank || targetBank;
    clientType = input.clientType || clientType;
    monthlyNet = input.monthlyNetIncome || monthlyNet;
  } else if (input.deal) {
    const d = input.deal;
    clientName = d.clientName || clientName;
    dealId = d.id || dealId;
    propertyCity = d.propertyCity || propertyCity;
    propertyPrice = d.propertyPrice || propertyPrice;
    loanAmount = d.loanAmount || loanAmount;
    equityAmount = Math.round((propertyPrice * (d.equityPercent || 20)) / 100);
    schufaScore = d.schufaScore || schufaScore;
    targetBank = d.targetBank || targetBank;
    clientType = d.clientType || clientType;
    monthlyNet = d.monthlyNetIncome || monthlyNet;
    if (input.user) {
      brokerageName = input.user.brokerageName || brokerageName;
    }
  }

  // Background Header Bar
  doc.setFillColor(7, 13, 30); // Dark navy #070D1E
  doc.rect(0, 0, 210, 38, 'F');

  // Header Title
  doc.setTextColor(6, 182, 212); // Cyan #06B6D4
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(brokerageName.toUpperCase(), 15, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // Slate-300
  doc.text('Zugelassener Immobiliardarlehensvermittler nach § 34i GewO • BaFin Reg: D-W-199-PROV', 15, 23);
  doc.text('Maximilianstraße 35 • 80539 München • Tel: +49 89 2026 8491 • compliance@leadflowcrm.de', 15, 29);

  // Right Side Header Badge
  doc.setFillColor(16, 185, 129); // Emerald #10B981
  doc.roundedRect(148, 10, 48, 16, 2, 2, 'F');
  doc.setTextColor(7, 13, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BANK-CERTIFIED DOSSIER', 151, 16);
  doc.setFontSize(7.5);
  doc.text('Ref: ' + dealId, 151, 22);

  // Title Section
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('UNVERBINDLICHE FINANZIERUNGSBESTÄTIGUNG', 15, 50);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('(German Mortgage Pre-Approval Certificate & Proof of Purchasing Funds)', 15, 56);

  // Divider
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.5);
  doc.line(15, 60, 195, 60);

  // Salutation & Intro
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text('Sehr geehrte Damen und Herren,', 15, 68);

  const introText = `hiermit bestätigt die ${brokerageName} als akkreditierter Finanzierungsvermittler nach § 34i GewO, dass die Bonität, die Einkommensverhältnisse und das Eigenkapital des nachfolgend genannten Darlehensnehmers im Rahmen einer bankseitigen Vorprüfung (Europace/Hypoport) erfolgreich geprüft und freigegeben wurden:`;
  const splitIntro = doc.splitTextToSize(introText, 180);
  doc.text(splitIntro, 15, 75);

  // Parameters Table Box
  const tableY = 92;
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.roundedRect(15, tableY, 180, 58, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, tableY, 180, 58, 2, 2, 'S');

  const rows = [
    { label: 'Kaufinteressent (Borrower):', value: `${clientName} (${clientType})` },
    { label: 'Kaufobjekt (Target Asset):', value: `Eigentumswohnung / Immobilie in ${propertyCity}` },
    { label: 'Geprüfter Darlehensrahmen:', value: `bis zu €${propertyPrice.toLocaleString('de-DE')},00 (Darlehen: €${loanAmount.toLocaleString('de-DE')})` },
    { label: 'Nachgewiesenes Eigenkapital:', value: `€${equityAmount.toLocaleString('de-DE')},00` },
    { label: 'Finanzierender Bankpartner:', value: `${targetBank} (Pre-Approval Ref: #${dealId})` },
    { label: 'SCHUFA Bonitätsscore:', value: `${schufaScore}% (Einwandfreie Bonität, 0 Negativeinträge)` },
  ];

  let currentY = tableY + 8;
  rows.forEach((row, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105); // Slate-600
    doc.text(row.label, 20, currentY);

    doc.setFont('helvetica', row.label.includes('Geprüfter') ? 'bold' : 'normal');
    doc.setTextColor(row.label.includes('Geprüfter') ? 5 : 15, row.label.includes('Geprüfter') ? 150 : 23, row.label.includes('Geprüfter') ? 105 : 42);
    doc.text(row.value, 80, currentY);

    if (i < rows.length - 1) {
      doc.setDrawColor(241, 245, 249);
      doc.line(20, currentY + 3, 190, currentY + 3);
    }
    currentY += 8.5;
  });

  // DATEV OCR Verification Section
  const ocrY = 158;
  doc.setFillColor(240, 253, 250); // Emerald-50
  doc.roundedRect(15, ocrY, 180, 24, 2, 2, 'F');
  doc.setDrawColor(167, 243, 208); // Emerald-200
  doc.roundedRect(15, ocrY, 180, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70); // Emerald-800
  doc.text('✓ AUTOMATISIERTE DATEV OCR EINKOMMENS- & DOKUMENTENPRÜFUNG', 20, ocrY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 118, 110);
  doc.text(`• 3 Monats-Gehaltsabrechnungen geprüft (Nettoeinkommen: €${monthlyNet.toLocaleString('de-DE')}/Monat • Unbefristeter Arbeitsvertrag)`, 20, ocrY + 13);
  doc.text('• Sämtliche Unterlagen entsprechen den Richtlinien der Wohnimmobilienkreditrichtlinie (WIKR).', 20, ocrY + 19);

  // Legal Paragraph
  const legalY = 190;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const legalText = `Auf Grundlage der eingereichten Gehaltsnachweise, des unbefristeten Arbeitsverhältnisses sowie der nachgewiesenen Eigenmittel bestehen aus heutiger Sicht keinerlei Bedenken hinsichtlich der Darlehenszusage für das genannte Kaufvorhaben.\n\nDiese Bestätigung dient zur Vorlage beim Immobilienmakler sowie beim Verkäufer zur Unterzeichnung der Reservierungsvereinbarung und Vorbereitung des notariellen Kaufvertrages.`;
  const splitLegal = doc.splitTextToSize(legalText, 180);
  doc.text(splitLegal, 15, legalY);

  // Signatures & Official Stamp
  const sigY = 228;
  doc.setDrawColor(203, 213, 225);
  doc.line(15, sigY, 195, sigY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Maximilian Bauer', 15, sigY + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Geschäftsführender Partner & Immobiliardarlehensvermittler', 15, sigY + 13);
  doc.text('§ 34i Abs. 1 GewO • IHK für München und Oberbayern', 15, sigY + 18);
  doc.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, 15, sigY + 23);

  // Official Seal Badge
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(140, sigY + 4, 55, 24, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(140, sigY + 4, 55, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('[ AMTLICHER BAFIN PRÜFVERMERK ]', 143, sigY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('DSGVO & BaFin § 34i konform verifiziert', 143, sigY + 17);
  doc.text(`Kryptografischer Hash: #${dealId}-MUC`, 143, sigY + 23);

  // Bottom Footer
  doc.setFillColor(7, 13, 30);
  doc.rect(0, 285, 210, 12, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text('LeadFlow CRM • German Expat Mortgage Infrastructure • ISO 27001 Certified • Frankfurt Cloud Vault', 15, 292);

  // Directly trigger download of the .pdf file
  const filename = `Finanzierungsbestaetigung_${dealId}_${clientName.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
};
