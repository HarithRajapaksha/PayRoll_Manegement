const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisior', 'Waiter', 'Helper'],
  },
  barcode: {
    type: String,
    unique: true,
  },

  telephone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  basicSal: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
  },
  CorrectuserId: {
    type: String,
    required: true,
  },

  // ✅ Additional Fields
  dob: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  maritalStatus: {
    type: String,
    required: true,
    enum: ['Single', 'Married'],
  },
  dateOfJoin: {
    type: String,
    required: true,
  },
  empType: {
    type: String,
    required: true,
    enum: ['Permanent', 'Casual'],
  },
  bankName: {
    type: String,
    required: true,
  },
  bankBranch: {
    type: String,
    required: true,
  },
  accountNo: {
    type: String,
    required: true,
  },

  empId: {
    type: String, // Optional field from backend (EMP-xxxx)
  },
    image: {
    type: String, // Store filename or image path if needed
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
