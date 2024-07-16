const Teacher = require("../models/Teacher");
const Class = require("../models/Class");

const createTeacher = async (req, res) => {
  const dob = new Date(req.body.dob);
  dob.setHours(0,0,0,0);
  const newTeacher = new Teacher({
    ...req.body,
    dob
  });
  try {
    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (err) {
    if(err.code === 11000){
      res.status(400).json({message: `Contact details must be unique`})
    }else{
      res.status(400).json({ message: err.message });
    }
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("assignedClass");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate(
      "assignedClass"
    );
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDateRange = (view, year, month) => {
  if (view === "monthly") {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return { startDate, endDate };
  } else if (view === "yearly") {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    return { startDate, endDate };
  }
  return {};
};
const getTeacherAnalytics = async (req, res) => {
  const { view = "yearly", year, month } = req.query;

  const { startDate, endDate } = getDateRange(view, year, month);

  try {
    const teachers = await Teacher.find({
      createdAt: { $gte: startDate, $lt: endDate },
    });
    const totalSalaryExpenses = teachers.reduce(
      (acc, teacher) => acc + teacher.salary,
      0
    );

    const classes = await Class.find().populate("students");
    const totalIncomeFromStudents = classes.reduce((acc, classData) => {
      const classIncome = classData.students.reduce((acc, student) => {
        if (
          student.feesPaid &&
          student.createdAt >= startDate &&
          student.createdAt < endDate
        ) {
          return acc + classData.studentFees;
        }
        return acc;
      }, 0);
      return acc + classIncome;
    }, 0);

    res.json({
      totalSalaryExpenses,
      totalIncomeFromStudents,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherAnalytics,
  getDateRange
};
