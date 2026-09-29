import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      default: 'General',
    },
    entityId: {
      type: String,
    },
    details: {
      type: String,
    },
    performedBy: {
      type: String,
      default: 'System',
    },
    brokerageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brokerage',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

activityLogSchema.statics.logActivity = async function (action, entityType, entityId, details, performedBy) {
  try {
    return await this.create({ action, entityType, entityId, details, performedBy });
  } catch (err) {
    console.warn('Failed to log activity:', err.message);
    return null;
  }
};

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
