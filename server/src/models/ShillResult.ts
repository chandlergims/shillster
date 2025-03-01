import mongoose, { Document, Schema } from 'mongoose';

export interface IShillResult extends Document {
  shill: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  result: 'profit' | 'loss';
  createdAt: Date;
}

const ShillResultSchema: Schema = new Schema({
  shill: {
    type: Schema.Types.ObjectId,
    ref: 'Shill',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  result: {
    type: String,
    enum: ['profit', 'loss'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
ShillResultSchema.index({ shill: 1, user: 1 }, { unique: true }); // One vote per user per shill
ShillResultSchema.index({ shill: 1, result: 1 }); // For counting profits/losses

export default mongoose.model<IShillResult>('ShillResult', ShillResultSchema);
