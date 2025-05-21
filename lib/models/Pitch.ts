import mongoose from 'mongoose';

export enum PitchStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  FUNDED = 'funded'
}

export interface IPitch extends mongoose.Document {
  entrepreneur: mongoose.Types.ObjectId;
  title: string;
  businessDescription: string;
  askAmount: number;
  equity: number;
  valuation: number;
  pitchDeck?: string; // URL to pitch deck
  status: PitchStatus;
  industry: string;
  targetMarket: string;
  currentRevenue: number;
  projectedRevenue: number;
  teamSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const PitchSchema = new mongoose.Schema<IPitch>(
  {
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Entrepreneur is required'],
    },
    title: {
      type: String,
      required: [true, 'Pitch title is required'],
      trim: true,
    },
    businessDescription: {
      type: String,
      required: [true, 'Business description is required'],
    },
    askAmount: {
      type: Number,
      required: [true, 'Ask amount is required'],
      min: 0,
    },
    equity: {
      type: Number,
      required: [true, 'Equity percentage is required'],
      min: 0,
      max: 100,
    },
    valuation: {
      type: Number,
      required: [true, 'Business valuation is required'],
      min: 0,
    },
    pitchDeck: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(PitchStatus),
      default: PitchStatus.DRAFT,
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
    },
    targetMarket: {
      type: String,
      required: [true, 'Target market is required'],
    },
    currentRevenue: {
      type: Number,
      default: 0,
    },
    projectedRevenue: {
      type: Number,
      required: [true, 'Projected revenue is required'],
    },
    teamSize: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Pitch || mongoose.model<IPitch>('Pitch', PitchSchema); 