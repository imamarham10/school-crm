const express = require('express');
const router = express.Router();
const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  getClassAnalytics
} = require('../controllers/ClassController');

router.post('/', createClass);

router.get('/', getClasses);

router.get('/:id', getClassById);

router.put('/:id', updateClass);

router.delete('/:id', deleteClass);

router.get('/:id/analytics', getClassAnalytics);


module.exports = router;
