const mongoose = require('mongoose');

// Define the schema for the allowance
const allowanceSchema = new mongoose.Schema(
  {
    allowanceName: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Allowance model
const allowance = mongoose.model('allowance', allowanceSchema);
module.exports = allowance;
