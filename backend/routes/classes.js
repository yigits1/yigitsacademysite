const express = require('express');
const router = express.Router();
const store = require('../store');

// List all classes/groups
router.get('/', (req, res) => {
  res.json(store.classes);
});

// Create a new class/group
router.post('/', (req, res) => {
  const {
    title,
    courseId,
    teacherId,
    teacherName,
    startDate,
    endDate,
    times,
    description
  } = req.body;

  const entry = {
    id: store.uuidv4(),
    title: title || '',
    courseId: courseId || null,
    teacherId: teacherId || null,
    teacherName: teacherName || '',
    startDate: startDate || '',
    endDate: endDate || '',
    times: times || '',
    description: description || ''
  };

  store.classes.push(entry);
  store.save('classes');
  res.status(201).json(entry);
});

// Update an existing class
router.put('/:id', (req, res) => {
  const idx = store.classes.findIndex(c => c.id === req.params.id);
  if (idx === -1)
    return res.status(404).json({ message: 'Sınıf/grup bulunamadı.' });

  store.classes[idx] = { ...store.classes[idx], ...req.body, id: req.params.id };
  store.save('classes');
  res.json(store.classes[idx]);
});

// Delete a class
router.delete('/:id', (req, res) => {
  const idx = store.classes.findIndex(c => c.id === req.params.id);
  if (idx === -1)
    return res.status(404).json({ message: 'Sınıf/grup bulunamadı.' });

  store.classes.splice(idx, 1);
  store.save('classes');
  res.json({ message: 'Sınıf/grup silindi.' });
});

module.exports = router;
