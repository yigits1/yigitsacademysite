const express = require('express');
const router = express.Router();
const store = require('../store');

router.get('/', (req, res) => {
  res.json(store.courses);
});

router.post('/', (req, res) => {
  const { name, description, level, duration, sessions } = req.body;
  const newCourse = {
    id: store.uuidv4(),
    name,
    description,
    level,
    duration: duration || '',
    sessions: sessions || '',
    image: 'general',
    instructorId: null
  };
  store.courses.push(newCourse);
  store.save('courses');
  res.status(201).json(newCourse);
});

router.put('/:id', (req, res) => {
  const idx = store.courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Kurs bulunamadı.' });
  store.courses[idx] = { ...store.courses[idx], ...req.body, id: req.params.id };
  store.save('courses');
  res.json(store.courses[idx]);
});

router.delete('/:id', (req, res) => {
  const idx = store.courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Kurs bulunamadı.' });
  store.courses.splice(idx, 1);
  store.save('courses');
  res.json({ message: 'Kurs silindi.' });
});

module.exports = router;
