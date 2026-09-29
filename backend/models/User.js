import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Corporate or personal email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Hidden by default from queries
    },
    role: {
      type: String,
      enum: ['platform_admin', 'brokerage_admin', 'advisor', 'client'],
      default: 'advisor',
      required: true,
    },
    roleTitle: {
      type: String,
      default: 'Mortgage Loan Advisor',
    },
    brokerageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brokerage',
      default: null,
    },
    brokerageName: {
      type: String,
      default: 'Bavaria FinOps Partners',
    },
    subdomain: {
      type: String,
      default: 'bavaria-finops',
    },
    dealId: {
      type: String,
      default: null, // Used for client portal lookup e.g. 'DEAL-8491'
    },
    avatar: {
      type: String,
      default: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
    },
    department: {
      type: String,
      default: 'Mortgage Origination',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcryptjs before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare candidate password against hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
