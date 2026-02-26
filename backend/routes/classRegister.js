const express = require('express');
const router = express.Router();
const store = require('../store');

// Get attendance — filter by courseId; studentId filters within records
router.get('/', (req, res) => {
  const { courseId, studentId } = req.query;
  let result = store.attendance;
  if (courseId) result = result.filter(a => a.courseId === courseId);
  // studentId filter: only return sessions where this student has a record
  if (studentId) result = result.filter(a => a.records && a.records.some(r => r.studentId === studentId));
  res.json(result);
});

// Save attendance for a session
router.post('/', (req, res) => {
  const { courseId, date, records, teacherId } = req.body;
  // records: [{ studentId, present }]
  const entry = {
    id: store.uuidv4(),
    courseId,
    date,
    teacherId,
    records
  };
  store.attendance.push(entry);
  store.save('attendance');
  res.status(201).json(entry);
});

// Grades
router.get('/grades', (req, res) => {
  const { courseId, studentId } = req.query;
  let result = store.grades;
  if (courseId) result = result.filter(g => g.courseId === courseId);
  if (studentId) result = result.filter(g => g.studentId === studentId);
  res.json(result);
});

router.post('/grades', (req, res) => {
  const { courseId, studentId, examName, grade, teacherId } = req.body;
  const existing = store.grades.findIndex(g => g.courseId === courseId && g.studentId === studentId && g.examName === examName);
  if (existing !== -1) {
    store.grades[existing].grade = grade;
    store.save('grades');
    return res.json(store.grades[existing]);
  }
  const entry = { id: store.uuidv4(), courseId, studentId, examName, grade, teacherId };
  store.grades.push(entry);
  store.save('grades');
  res.status(201).json(entry);
});

// Lesson topics
router.get('/topics', (req, res) => {
  const { courseId } = req.query;
  let result = store.lessonTopics;
  if (courseId) result = result.filter(t => t.courseId === courseId);
  res.json(result);
});

router.post('/topics', (req, res) => {
  const { courseId, date, topic, teacherId } = req.body;
  const entry = { id: store.uuidv4(), courseId, date, topic, teacherId };
  store.lessonTopics.push(entry);
  store.save('lessonTopics');
  res.status(201).json(entry);
});

module.exports = router;
