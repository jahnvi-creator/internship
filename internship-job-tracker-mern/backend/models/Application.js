const mongoose = require('mongoose');
const STATUSES = ['Saved', 'Applied', 'Online Test', 'Interview', 'Offer', 'Rejected'];
const schema = new mongoose.Schema({
  rollNo: { type: String, required: true, uppercase: true, index: true },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  location: String, stipend: String, appliedOn: String, deadline: String,
  status: { type: String, enum: STATUSES, default: 'Saved' }, link: String, notes: String
}, { timestamps: true });
module.exports = { Application: mongoose.model('Application', schema), STATUSES };
