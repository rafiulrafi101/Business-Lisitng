import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  label: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Category = mongoose.model('Category', categorySchema);
