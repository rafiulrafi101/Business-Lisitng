const mongoose = require('mongoose');

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
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Haircut', 'Laundry', 'Electronics', 'Fashion', 'Market'],
      required: true,
      index: true,
    },
    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      area: {
        type: String,
        required: true,
        trim: true,
      },
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    hours: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

listingSchema.index({ name: 'text', shortDescription: 'text', description: 'text' });
listingSchema.index({ category: 1, 'location.city': 1, 'location.area': 1 });

module.exports = mongoose.model('Listing', listingSchema);
