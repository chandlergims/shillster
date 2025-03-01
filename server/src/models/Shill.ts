import mongoose, { Document, Schema } from 'mongoose';

export interface IShill extends Document {
  creator: mongoose.Types.ObjectId;
  tokenAddress: string;
  reason: string;
  createdAt: Date;
  active: boolean;
  status: 'pending' | 'accepted' | 'declined';
  profitCount: number;
  lossCount: number;
}

const ShillSchema: Schema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenAddress: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 140
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  profitCount: {
    type: Number,
    default: 0
  },
  lossCount: {
    type: Number,
    default: 0
  }
});

// Create index for faster queries
ShillSchema.index({ creator: 1, active: 1 });
ShillSchema.index({ createdAt: -1 });

export default mongoose.model<IShill>('Shill', ShillSchema);
