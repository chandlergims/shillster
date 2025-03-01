import mongoose, { Document, Schema } from 'mongoose';

export interface ICompletedShill extends Document {
  user: mongoose.Types.ObjectId;
  shill: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CompletedShillSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shill: {
    type: Schema.Types.ObjectId,
    ref: 'Shill',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can only complete a shill once
CompletedShillSchema.index({ user: 1, shill: 1 }, { unique: true });

export default mongoose.model<ICompletedShill>('CompletedShill', CompletedShillSchema);
