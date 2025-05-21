import mongoose from 'mongoose';

export enum OfferStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COUNTERED = 'countered',
  EXPIRED = 'expired'
}

export interface IOffer extends mongoose.Document {
  investor: mongoose.Types.ObjectId;
  pitch: mongoose.Types.ObjectId;
  amount: number;
  equity: number;
  termsAndConditions: string;
  status: OfferStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new mongoose.Schema<IOffer>(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Investor is required'],
    },
    pitch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pitch',
      required: [true, 'Pitch is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Investment amount is required'],
      min: 0,
    },
    equity: {
      type: Number,
      required: [true, 'Equity percentage is required'],
      min: 0,
      max: 100,
    },
    termsAndConditions: {
      type: String,
      required: [true, 'Terms and conditions are required'],
    },
    status: {
      type: String,
      enum: Object.values(OfferStatus),
      default: OfferStatus.PENDING,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema); 