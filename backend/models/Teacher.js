const mongoose = require("mongoose");
const Counter = require("./Counter");

const teacherSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: {
      type: Date,
      required: true,
      get: (dob) => dob.toISOString().split("T")[0],
    },
    contactDetails: { type: String, required: true, unique: true },
    salary: { type: Number, required: true },
    assignedClass: { type: String, ref: "Class" },
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

teacherSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: "Teacher" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    this._id = `TEACHER${counter.count.toString().padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Teacher", teacherSchema);
