const express = require('express');
const router = express.Router();
const store = require('../store');

router.get('/', (req, res) => {
  const safe = store.teachers.map(t => ({
    id: t.id,
    name: t.name,
    username: t.username,
    specialization: t.specialization,
    bio: t.bio,
    assignedCourses: t.assignedCourses
  }));
  res.json(safe);
});

router.post('/', (req, res) => {
  const { name, username, password, specialization, bio, assignedCourses } = req.body;
  if (store.teachers.find(t => t.username === username)) {
    return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
  }
  const newTeacher = {
    id: store.uuidv4(),
    name,
    username,
    password,
    specialization: specialization || '',
    bio: bio || '',
    assignedCourses: assignedCourses || []
  };
  store.teachers.push(newTeacher);
  store.save('teachers');
  res.status(201).json({ id: newTeacher.id, name: newTeacher.name, username: newTeacher.username });
});

router.put('/:id', (req, res) => {
  const idx = store.teachers.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Öğretmen bulunamadı.' });
  const { name, specialization, bio, assignedCourses, password } = req.body;
  if (name) store.teachers[idx].name = name;
  if (specialization) store.teachers[idx].specialization = specialization;
  if (bio) store.teachers[idx].bio = bio;
  if (assignedCourses) store.teachers[idx].assignedCourses = assignedCourses;
  if (password) store.teachers[idx].password = password;

  // also update course instructorId
  if (assignedCourses) {
    store.courses.forEach(c => {
      if (c.instructorId === req.params.id) c.instructorId = null;
    });
    assignedCourses.forEach(cid => {
      const ci = store.courses.findIndex(c => c.id === cid);
      if (ci !== -1) store.courses[ci].instructorId = req.params.id;
    });
  }

  store.save('teachers');
  store.save('courses');
  res.json({ id: store.teachers[idx].id, name: store.teachers[idx].name });
});

router.delete('/:id', (req, res) => {
const idx = store.teachers.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Öğretmen bulunamadı.' });
  store.teachers.splice(idx, 1);
  store.save('teachers');
  res.json({ message: 'Öğretmen silindi.' });
});

module.exports = router;
