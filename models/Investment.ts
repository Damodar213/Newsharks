import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amountInvested: {
    type: Number,
    required: true,
  },
  equityPercentage: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'profitable', 'completed'],
    default: 'active',
  },
  returnToDate: {
    type: Number,
    default: 0,
  },
  investedDate: {
    type: Date,
    default: Date.now,
  },
});

export const Investment = mongoose.models.Investment || mongoose.model('Investment', investmentSchema); 