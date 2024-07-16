const mongoose = require("mongoose");
const Counter = require("./Counter");
const Class = require("./Class");
const { MAX_STUDENTS } = require("../config/config");

const studentSchema = new mongoose.Schema(
  {
    _id: { type: String }, 
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true, get: (dob) => dob.toISOString().split("T")[0] },
    contactDetails: { type: String, required: true, unique: true },
    feesPaid: { type: Boolean, required: true },
    class: { type: String, ref: "Class" },
  },
  { timestamps: true,  toJSON: { getters: true }, toObject: { getters: true } }
);

studentSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { model: "Student" },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      this._id = `STUDENT${counter.count.toString().padStart(4, "0")}`;

      const classDoc = await Class.findById(this.class);
      if (classDoc.students.length >= MAX_STUDENTS) {
        const error = new Error(
          `Cannot add student to class. Class size limit of ${MAX_STUDENTS} reached.`
        );
        return next(error);
      }

      classDoc.students.push(this._id);
      await classDoc.save();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Student", studentSchema);
