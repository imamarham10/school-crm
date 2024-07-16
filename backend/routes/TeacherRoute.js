const express = require('express');
const router = express.Router();
const { getTeachers, createTeacher, getTeacherById, updateTeacher, deleteTeacher, getTeacherAnalytics, getDateRange } = require('../controllers/TeacherController');

router.get('/', getTeachers);
router.post('/', createTeacher);
router.get('/:id', getTeacherById);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);
router.get('/analytics/financial', getTeacherAnalytics);
module.exports = router;
