const express = require('express');
const router = express.Router();
const store = require('../store');

// Get all lesson topics
router.get('/', (req, res) => {
  res.json(store.lessonTopics);
});

// Get lesson topics by course
router.get('/course/:courseId', (req, res) => {
  const topicsList = store.lessonTopics.filter(t => t.courseId === req.params.courseId);
  res.json(topicsList);
});

// Add lesson topic
router.post('/', (req, res) => {
  const { courseId, topic, description, date, teacherId } = req.body;
  const entry = {
    id: store.uuidv4(),
    courseId: courseId || '',
    topic: topic || '',
    description: description || '',
    date: date || new Date().toISOString().split('T')[0],
    teacherId: teacherId || '',
    createdAt: Date.now()
  };
  store.lessonTopics.push(entry);
  store.save('lessonTopics');
  res.status(201).json(entry);
});

// Update lesson topic (admin can edit)
router.put('/:id', (req, res) => {
  const { courseId, topic, description, date, teacherId } = req.body;
  const lessonTopic = store.lessonTopics.find(t => t.id === req.params.id);
  if (!lessonTopic) return res.status(404).json({ message: 'Ders konusu bulunamadı.' });
  
  if (courseId) lessonTopic.courseId = courseId;
  if (topic) lessonTopic.topic = topic;
  if (description) lessonTopic.description = description;
  if (date) lessonTopic.date = date;
  if (teacherId) lessonTopic.teacherId = teacherId;
  
  store.save('lessonTopics');
  res.json(lessonTopic);
});

// Delete lesson topic
router.delete('/:id', (req, res) => {
  const idx = store.lessonTopics.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Ders konusu bulunamadı.' });
  store.lessonTopics.splice(idx, 1);
  store.save('lessonTopics');
  res.json({ message: 'Ders konusu silindi.' });
});

module.exports = router;
