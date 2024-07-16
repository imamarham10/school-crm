const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const classRoutes = require('./routes/ClassRoute');
const teacherRoutes = require('./routes/TeacherRoute');
const studentRoutes = require('./routes/StudentRoute');
const analyticsRoutes = require('./routes/AnalyticsRoute');
const initializeCounters = require('./config/InitializeCounter');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');

  await initializeCounters();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error(err));

app.use('/api/classes', classRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});
