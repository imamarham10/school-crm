const Student = require('../models/Student');

const createStudent = async (req, res) => {
  const dob = new Date(req.body.dob);
  dob.setHours(0,0,0,0);
  const newStudent = new Student({
    name: req.body.name,
    gender: req.body.gender,
    dob,
    contactDetails: req.body.contactDetails,
    feesPaid: req.body.feesPaid,
    class: req.body.class,
  });

  try {
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    if(err.code === 11000){
      res.status(400).json({message: `Contact details must be unique`})
    }else{
      res.status(400).json({ message: err.message });
    }
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('class');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ customId: req.params.id }).populate('class');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { customId: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await Student.findOneAndDelete({ customId: req.params.id });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
