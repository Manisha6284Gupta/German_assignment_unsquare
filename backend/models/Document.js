import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    dealId: {
      type: String,
      required: true,
      index: true,
    },
    brokerageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brokerage',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Income Proof',
    },
    status: {
      type: String,
      default: 'verified',
    },
    isReady: {
      type: Boolean,
      default: true,
    },
    ocrConfidence: {
      type: Number,
      default: 99.4,
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: String,
      default: '2.4 MB',
    },
    extractedDetails: {
      type: String,
    },
    sha256Hash: {
      type: String,
    },
    verifiedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);
export default Document;
