const mongoose = require('mongoose');
const Counter = require('./Counter');
const { MAX_STUDENTS } = require('../config/config');

const classSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  year: { type: Number, required: true },
  teacher: { type: String, ref: 'Teacher', required: true },
  studentFees: { type: Number, required: true },
  students: [{ type: String, ref: 'Student' }],
}, { timestamps: true }
);

classSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { model: 'Class' },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      this._id = `CLASS${counter.count.toString().padStart(4, '0')}`;
    } catch (err) {
      return next(err);
    }
  }

  if (this.students.length > MAX_STUDENTS) {
    const error = new Error(`Class cannot have more than ${MAX_STUDENTS} students.`);
    return next(error);
  }

  next();
});

module.exports = mongoose.model('Class', classSchema);
