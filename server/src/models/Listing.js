import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
      index: 'text',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Haircut', 'Laundry', 'Electronics', 'Fashion', 'Market'],
      index: true,
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true,
      },
      area: {
        type: String,
        required: [true, 'Area is required'],
        trim: true,
        index: true,
      },
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    phone: {
      type: String,
      trim: true,
    },
    hours: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
listingSchema.index({ category: 1, 'location.city': 1 });
listingSchema.index({ isActive: 1, createdAt: -1 });

export const Listing = mongoose.model('Listing', listingSchema);
