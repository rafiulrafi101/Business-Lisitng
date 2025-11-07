import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one bookmark per user per listing
bookmarkSchema.index({ user: 1, listing: 1 }, { unique: true });

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
