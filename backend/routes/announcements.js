const express = require('express');
const router = express.Router();
const store = require('../store');

router.get('/', (req, res) => {
  res.json([...store.announcements].reverse());
});

router.post('/', (req, res) => {
  const { title, content, targetRole } = req.body;
  const entry = {
    id: store.uuidv4(),
    title,
    content,
    targetRole: targetRole || 'all',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  };
  store.announcements.push(entry);
  store.save('announcements');
  res.status(201).json(entry);
});

router.delete('/:id', (req, res) => {
  const idx = store.announcements.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Bulunamadı.' });
  store.announcements.splice(idx, 1);
  store.save('announcements');
  res.json({ message: 'Silindi.' });
});

module.exports = router;
