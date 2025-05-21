import mongoose from 'mongoose';

// Define user types enum
export enum UserRole {
  ADMIN = 'admin',
  INVESTOR = 'investor',
  ENTREPRENEUR = 'entrepreneur'
}

export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  password: string; // Will be hashed
  role: UserRole;
  profilePicture?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.ENTREPRENEUR,
      required: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Don't overwrite if it already exists during hot reloading
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 