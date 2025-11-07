const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
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
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

locationSchema.index({ city: 1, area: 1 }, { unique: true });

module.exports = mongoose.model('Location', locationSchema);
