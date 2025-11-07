import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
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
});

// Ensure unique city+area combinations
locationSchema.index({ city: 1, area: 1 }, { unique: true });

export const Location = mongoose.model('Location', locationSchema);
