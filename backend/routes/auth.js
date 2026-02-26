const express = require('express');
const router = express.Router();
const store = require('../store');

router.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  if (role === 'admin') {
    const admin = store.admins.find(a => a.username === username && a.password === password);
    if (admin) {
      return res.json({ success: true, user: { id: admin.id, name: admin.name, role: 'admin' } });
    }
  } else if (role === 'teacher') {
    const teacher = store.teachers.find(t => t.username === username && t.password === password);
    if (teacher) {
      return res.json({ success: true, user: { id: teacher.id, name: teacher.name, role: 'teacher', assignedCourses: teacher.assignedCourses } });
    }
  } else if (role === 'student') {
    const student = store.students.find(s => s.username === username && s.password === password);
    if (student) {
      return res.json({ success: true, user: { id: student.id, name: student.name, role: 'student', enrolledCourses: student.enrolledCourses } });
    }
  }

  return res.status(401).json({ success: false, message: 'Geçersiz kullanıcı adı veya şifre.' });
});

module.exports = router;
