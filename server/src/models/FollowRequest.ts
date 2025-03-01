import mongoose, { Document, Schema } from 'mongoose';

export interface IFollowRequest extends Document {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

const followRequestSchema = new Schema<IFollowRequest>(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure uniqueness of requester-recipient pairs
followRequestSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const FollowRequest = mongoose.model<IFollowRequest>('FollowRequest', followRequestSchema);

export default FollowRequest;
