const mongoose = require('mongoose');
module.exports = mongoose.model('Student', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNo: { type: String, required: true, unique: true, uppercase: true, trim: true }
}, { timestamps: true }));
