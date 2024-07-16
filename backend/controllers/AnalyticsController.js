const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

const getTeacherAnalytics = async (req, res) => {
    const { view = 'yearly', year, month } = req.query;

  const { startDate, endDate } = getDateRange(view, year, month);  
 
  try {
    const teachers = await Teacher.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const totalSalaryExpenses = teachers.reduce((acc, teacher) => acc + teacher.salary, 0);

    console.log('Teachers found:', teachers.length);

    const classes = await Class.find().populate('students');
    let totalIncomeFromStudents = 0;
    classes.forEach((classData) => {
      classData.students.forEach((student) => {
        if (student.feesPaid && student.createdAt >= startDate && student.createdAt <= endDate) {
          totalIncomeFromStudents += classData.studentFees;
        }
      });
    });
    
    console.log('Classes found:', classes.length);

    res.json({
        totalSalaryExpenses,
        totalIncomeFromStudents,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
const getDateRange = (view, year, month) => {
    let startDate, endDate;
  
    if (view === 'monthly') {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else if (view === 'yearly') {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 12, 0, 23, 59, 59, 999);
    }
  
    return { startDate, endDate };
  };
  
module.exports = {
    getTeacherAnalytics
};
