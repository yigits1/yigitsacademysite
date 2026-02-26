const express = require('express');
const router = express.Router();
const store = require('../store');

// Get all grades
router.get('/', (req, res) => {
  res.json(store.grades);
});

// Get grades by student ID
router.get('/student/:studentId', (req, res) => {
  const studentGrades = store.grades.filter(g => g.studentId === req.params.studentId);
  res.json(studentGrades);
});

// Get grades by course ID
router.get('/course/:courseId', (req, res) => {
  const courseGrades = store.grades.filter(g => g.courseId === req.params.courseId);
  res.json(courseGrades);
});

// Add a grade (teacher)
router.post('/', (req, res) => {
  const { courseId, studentId, examName, grade, teacherId } = req.body;
  const entry = {
    id: store.uuidv4(),
    courseId: courseId || '',
    studentId: studentId || '',
    examName: examName || '',
    grade: grade || 0,
    teacherId: teacherId || '',
    createdAt: Date.now()
  };
  store.grades.push(entry);
  store.save('grades');
  res.status(201).json(entry);
});

// Update a grade (admin can override/edit teacher entries)
router.put('/:id', (req, res) => {
  const { courseId, studentId, examName, grade, teacherId } = req.body;
  const gradeEntry = store.grades.find(g => g.id === req.params.id);
  if (!gradeEntry) return res.status(404).json({ message: 'Not bulunamadı.' });
  
  if (courseId) gradeEntry.courseId = courseId;
  if (studentId) gradeEntry.studentId = studentId;
  if (examName) gradeEntry.examName = examName;
  if (grade !== undefined) gradeEntry.grade = grade;
  if (teacherId) gradeEntry.teacherId = teacherId;
  
  store.save('grades');
  res.json(gradeEntry);
});

// Delete a grade
router.delete('/:id', (req, res) => {
  const idx = store.grades.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not bulunamadı.' });
  store.grades.splice(idx, 1);
  store.save('grades');
  res.json({ message: 'Not silindi.' });
});

module.exports = router;
