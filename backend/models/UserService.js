const mongoose = require('mongoose');

const userServiceSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    icon:        { type: String, default: '' },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserService', userServiceSchema);
