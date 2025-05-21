import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  relatedPitch?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required'],
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedPitch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pitch',
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for conversation retrieval
MessageSchema.index({ sender: 1, receiver: 1 });
MessageSchema.index({ createdAt: -1 });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema); 