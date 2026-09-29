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
      default: 'Verified via DATEV OCR',
    },
    isReady: {
      type: Boolean,
      default: true,
    },
    verifiedDate: {
      type: Date,
      default: Date.now,
    },
    ocrConfidence: {
      type: Number,
      default: 99.4,
    },
  },
  {
    timestamps: true,
  }
);

export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);
export default Document;
