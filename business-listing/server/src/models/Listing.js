const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    },
    location: {
      type: locationSchema,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    hours: {
      type: String,
    },
    imageUrl: {
      type: String,
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
listingSchema.index({ owner: 1 });

listingSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Listing', listingSchema);
