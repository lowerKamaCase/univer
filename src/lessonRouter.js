const express = require('express');
const lessonModel = require('./lessonModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const lessons = await lessonModel.getLessons(filters);
    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/lessons', async (req, res) => {
  try {
    const { teacherIds, title, days, firstDate, lessonsCount, lastDate } = req.body;
    const lessonIds = await lessonModel.createLessons({
      teacherIds,
      title,
      days,
      firstDate,
      lessonsCount,
      lastDate,
    });
    res.status(201).json({ lessonIds });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

module.exports = router;
