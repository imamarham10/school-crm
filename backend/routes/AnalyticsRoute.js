const express = require('express');
const router = express.Router();

const {getTeacherAnalytics} = require('../controllers/AnalyticsController');


router.get('/financial', getTeacherAnalytics);


module.exports = router;