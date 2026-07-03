const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserRole',
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
