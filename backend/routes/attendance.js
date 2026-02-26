const express = require('express');
const router = express.Router();
const store = require('../store');

// Get all attendance records
router.get('/', (req, res) => {
  res.json(store.attendance);
});

// Get attendance by course
router.get('/course/:courseId', (req, res) => {
  const courseAttendance = store.attendance.filter(a => a.courseId === req.params.courseId);
  res.json(courseAttendance);
});

// Get attendance by student
router.get('/student/:studentId', (req, res) => {
  const studentAttendance = store.attendance
    .map(record => ({
      ...record,
      records: record.records.filter(r => r.studentId === req.params.studentId)
    }))
    .filter(record => record.records.length > 0);
  res.json(studentAttendance);
});

// Add attendance record
router.post('/', (req, res) => {
  const { courseId, date, teacherId, records } = req.body;
  const entry = {
    id: store.uuidv4(),
    courseId: courseId || '',
    date: date || new Date().toISOString().split('T')[0],
    teacherId: teacherId || '',
    records: records || [],
    createdAt: Date.now()
  };
  store.attendance.push(entry);
  store.save('attendance');
  res.status(201).json(entry);
});

// Update attendance record (admin can fix/edit)
router.put('/:id', (req, res) => {
  const { courseId, date, teacherId, records } = req.body;
  const attendanceRecord = store.attendance.find(a => a.id === req.params.id);
  if (!attendanceRecord) return res.status(404).json({ message: 'Devamsızlık kaydı bulunamadı.' });
  
  if (courseId) attendanceRecord.courseId = courseId;
  if (date) attendanceRecord.date = date;
  if (teacherId) attendanceRecord.teacherId = teacherId;
  if (records && Array.isArray(records)) attendanceRecord.records = records;
  
  store.save('attendance');
  res.json(attendanceRecord);
});

// Update single student attendance in a session
router.put('/:id/student/:studentId', (req, res) => {
  const { present } = req.body;
  const attendanceRecord = store.attendance.find(a => a.id === req.params.id);
  if (!attendanceRecord) return res.status(404).json({ message: 'Devamsızlık kaydı bulunamadı.' });
  
  const studentRecord = attendanceRecord.records.find(r => r.studentId === req.params.studentId);
  if (!studentRecord) {
    attendanceRecord.records.push({ studentId: req.params.studentId, present: present || false });
  } else {
    studentRecord.present = present;
  }
  
  store.save('attendance');
  res.json(attendanceRecord);
});

// Delete attendance record
router.delete('/:id', (req, res) => {
  const idx = store.attendance.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Devamsızlık kaydı bulunamadı.' });
  store.attendance.splice(idx, 1);
  store.save('attendance');
  res.json({ message: 'Devamsızlık kaydı silindi.' });
});

module.exports = router;
