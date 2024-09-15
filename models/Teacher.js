const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  contactDetails: { type: String, required: true },
  salary: { type: Number, required: true },
});

module.exports = mongoose.model('Teacher', teacherSchema);

