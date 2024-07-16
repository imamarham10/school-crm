const Class = require('../models/Class');
const Student = require('../models/Student');

const createClass = async (req, res) => {
  const newClass = new Class({
    name: req.body.name,
    year: req.body.year,
    teacher: req.body.teacher,
    studentFees: req.body.studentFees,
    students: req.body.students,
  });

  try {
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher students');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClassById = async (req, res) => {
  try {
    const classData = await Class.findOne({ customId: req.params.id }).populate('teacher students');
    if (!classData) return res.status(404).json({ message: 'Class not found' });
    res.json(classData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findOneAndUpdate(
      { customId: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    await Class.findOneAndDelete({ customId: req.params.id });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClassAnalytics = async (req, res) => {
  try {
    const classData = await Class.findOne({ _id: req.params.id }).populate('teacher students');
    if (!classData) return res.status(404).json({ message: 'Class not found' });

    const students = await Student.find({ _id: { $in: classData.students } });
    const maleCount = students.filter(student => student.gender === 'Male').length;
    const femaleCount = students.filter(student => student.gender === 'Female').length;

    res.json({
      class: classData,
      maleCount,
      femaleCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  getClassAnalytics
};
