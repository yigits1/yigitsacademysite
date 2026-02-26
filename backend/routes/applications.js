const express = require('express');
const router = express.Router();
const store = require('../store');

// List all applications (admin view)
router.get('/', (req, res) => {
  res.json(store.applications);
});

// Submit a new application
router.post('/', (req, res) => {
  const { name, phone, message, role } = req.body;
  const entry = {
    id: store.uuidv4(),
    name: name || '',
    phone: phone || '',
    role: role || 'student',
    message: message || '',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  };
  store.applications.push(entry);
  store.save('applications');
  res.status(201).json(entry);
});

// Update an application (admin only)
router.put('/:id', (req, res) => {
  const { name, phone, message, role } = req.body;
  const application = store.applications.find(a => a.id === req.params.id);
  if (!application) return res.status(404).json({ message: 'Başvuru bulunamadı.' });
  
  if (name) application.name = name;
  if (phone) application.phone = phone;
  if (message) application.message = message;
  if (role) application.role = role;
  
  store.save('applications');
  res.json(application);
});

// Delete an application
router.delete('/:id', (req, res) => {
  const idx = store.applications.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Başvuru bulunamadı.' });
  store.applications.splice(idx, 1);
  store.save('applications');
  res.json({ message: 'Başvuru silindi.' });
});

module.exports = router;
