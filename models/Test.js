const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  value: { type: Number, required: true },
});

module.exports = mongoose.model('Test', TestSchema);
