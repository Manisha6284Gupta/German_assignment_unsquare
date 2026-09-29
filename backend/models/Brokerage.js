import mongoose from 'mongoose';

const brokerageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brokerage agency name is required'],
      trim: true,
    },
    subdomain: {
      type: String,
      required: [true, 'Brokerage subdomain is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    city: {
      type: String,
      default: 'Frankfurt am Main',
      trim: true,
    },
    bafinLicense: {
      type: String,
      default: '§ 34i GewO (D-W-155-MUC-92)',
      trim: true,
    },
    bafinRegistered: {
      type: Boolean,
      default: true,
    },
    annualVolume: {
      type: String,
      default: '€50M+',
    },
    activeBrokers: {
      type: Number,
      default: 5,
    },
    settings: {
      whitelabel: { type: Boolean, default: true },
      primaryColor: { type: String, default: '#06B6D4' },
      allowedBanks: {
        type: [String],
        default: ['ING-DiBa', 'Commerzbank', 'DKB', 'Sparkasse', 'Volksbank', 'KfW Bankengruppe'],
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Brokerage = mongoose.models.Brokerage || mongoose.model('Brokerage', brokerageSchema);
export default Brokerage;
