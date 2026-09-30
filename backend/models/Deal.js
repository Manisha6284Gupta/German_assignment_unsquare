import mongoose from 'mongoose';

const documentItemSchema = new mongoose.Schema(
  {
    documentId: {
      type: String,
      default: () => `DOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    title: {
      type: String,
      required: true,
    },
    germanTerm: {
      type: String,
      default: 'Kreditakte Dokument',
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'under_review', 'rejected'],
      default: 'verified',
    },
    ocrDetails: {
      type: String,
      default: 'Automated DATEV OCR verification passed in Frankfurt eu-central-1 datacenter.',
    },
    fileName: {
      type: String,
      default: 'document.pdf',
    },
    fileSize: {
      type: String,
      default: '2.4 MB',
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    storageKey: {
      type: String,
      default: () => `vault/mortgage/${Date.now()}-doc.pdf`,
    },
    sha256Hash: {
      type: String,
      default: () => 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    encryption: {
      type: String,
      default: 'AES-256 (GDPR / DSGVO & BaFin Compliant)',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const dealSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => `DEAL-${Math.floor(8000 + Math.random() * 1999)}`,
    },
    brokerageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brokerage',
      index: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientType: {
      type: String,
      enum: ['Expat (EU Blue Card)', 'German Resident', 'Non-EU Permanent', 'Freelancer / Self-Employed'],
      default: 'Expat (EU Blue Card)',
    },
    nationality: {
      type: String,
      default: 'International',
    },
    propertyCity: {
      type: String,
      default: 'Munich',
      trim: true,
    },
    propertyPrice: {
      type: Number,
      default: 650000,
    },
    loanAmount: {
      type: Number,
      default: 520000,
    },
    equityPercent: {
      type: Number,
      default: 20,
    },
    stage: {
      type: String,
      enum: ['new_lead', 'doc_verification', 'bank_matching', 'offer_issued', 'closed_won'],
      default: 'new_lead',
      index: true,
    },
    assignedBroker: {
      type: String,
      default: 'Maximilian Bauer',
    },
    assignedBrokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    avatar: {
      type: String,
      default: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
    },
    schufaScore: {
      type: Number,
      default: 98.5,
    },
    monthlyNetIncome: {
      type: Number,
      default: 8500,
    },
    targetBank: {
      type: String,
      default: 'ING-DiBa',
    },
    matchScore: {
      type: Number,
      default: 94,
    },
    docsReady: {
      type: Number,
      default: 1,
    },
    totalDocs: {
      type: Number,
      default: 5,
    },
    documents: [documentItemSchema],
    priority: {
      type: String,
      enum: ['urgent', 'high', 'medium'],
      default: 'high',
    },
  },
  {
    timestamps: true,
  }
);

export const Deal = mongoose.models.Deal || mongoose.model('Deal', dealSchema);
export default Deal;
