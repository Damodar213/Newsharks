import mongoose from 'mongoose';
import { UserRole } from './User';

export interface IProject extends mongoose.Document {
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  equityOffering: number;
  timeline: string;
  businessPlan: string;
  entrepreneur: mongoose.Schema.Types.ObjectId;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'technology',
        'health',
        'sustainability',
        'education',
        'finance',
        'food',
        'retail',
        'agriculture',
        'other'
      ],
    },
    fundingGoal: {
      type: Number,
      required: [true, 'Funding goal is required'],
      min: 1000,
    },
    equityOffering: {
      type: Number,
      required: [true, 'Equity offering percentage is required'],
      min: 1,
      max: 49,
    },
    timeline: {
      type: String,
      default: '',
    },
    businessPlan: {
      type: String,
      default: '',
    },
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Entrepreneur reference is required'],
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Don't overwrite if it already exists during hot reloading
export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema); 