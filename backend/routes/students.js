const express = require('express');
const router = express.Router();
const store = require('../store');

router.get('/', (req, res) => {
  const safe = store.students.map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    username: s.username,
    enrolledCourses: s.enrolledCourses,
    progress: s.progress
  }));
  res.json(safe);
});

router.post('/', (req, res) => {
  const { name, email, username, password, enrolledCourses } = req.body;
  if (store.students.find(s => s.username === username)) {
    return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
  }
  const newStudent = {
    id: store.uuidv4(),
    name,
    email: email || '',
    username,
    password,
    enrolledCourses: enrolledCourses || [],
    progress: {}
  };
  store.students.push(newStudent);
  store.save('students');
  res.status(201).json({ id: newStudent.id, name: newStudent.name, username: newStudent.username });
});

router.put('/:id', (req, res) => {
  const idx = store.students.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Öğrenci bulunamadı.' });
  const { name, email, enrolledCourses, progress, password } = req.body;
  if (name) store.students[idx].name = name;
  if (email) store.students[idx].email = email;
  if (enrolledCourses) store.students[idx].enrolledCourses = enrolledCourses;
  if (progress) store.students[idx].progress = progress;
  if (password) store.students[idx].password = password;
  store.save('students');
  res.json({ id: store.students[idx].id, name: store.students[idx].name });
});

router.delete('/:id', (req, res) => {
  const idx = store.students.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Öğrenci bulunamadı.' });
  store.students.splice(idx, 1);
  store.save('students');
  res.json({ message: 'Öğrenci silindi.' });
});

module.exports = router;
