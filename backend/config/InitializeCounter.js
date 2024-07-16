const Counter = require('../models/Counter'); // Adjust the path if necessary

const initializeCounters = async () => {
  const models = ['Class', 'Student', 'Teacher'];
  for (const model of models) {
    const existingCounter = await Counter.findOne({ model });
    if (!existingCounter) {
      await Counter.create({ model, count: 0 }); // Ensure count starts at 0
    }
  }
};

module.exports = initializeCounters;
