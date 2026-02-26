const express = require('express');
const router = express.Router();
const store = require('../store');
const PDFDocument = require('pdfkit');

// Generate student grades report PDF
router.get('/grades/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const student = store.students.find(s => s.id === studentId);
  
  if (!student) {
    return res.status(404).json({ message: 'Öğrenci bulunamadı.' });
  }
  
  const grades = store.grades.filter(g => g.studentId === studentId);
  
  // Create PDF
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="notlar_${student.name}_${Date.now()}.pdf"`);
  
  doc.pipe(res);
  
  // Title
  doc.fontSize(20).text("YIĞIT'S AKADEMİ - NOTLAR RAPORU", { align: 'center' });
  doc.fontSize(12).text(new Date().toLocaleDateString('tr-TR'), { align: 'center' });
  doc.moveDown(1);
  
  // Student info
  doc.fontSize(12).text(`Öğrenci Adı: ${student.name}`);
  doc.text(`Öğrenci ID: ${student.id}`);
  doc.text(`E-mail: ${student.email || 'N/A'}`);
  doc.moveDown(1);
  
  // Grades table
  if (grades.length > 0) {
    doc.fontSize(11).text('Notlar:', { underline: true });
    doc.moveDown(0.5);
    
    grades.forEach((g, idx) => {
      const course = store.courses.find(c => c.id === g.courseId);
      const courseName = course ? course.name : 'Bilinmiyor';
      doc.fontSize(10);
      doc.text(`${idx + 1}. ${courseName} - ${g.examName}: ${g.grade}/100`);
    });
  } else {
    doc.fontSize(10).text('Henüz not kaydı bulunmamaktadır.');
  }
  
  doc.moveDown(1);
  doc.fontSize(10).text(`Rapor oluşturulma tarihi: ${new Date().toLocaleString('tr-TR')}`);
  
  doc.end();
});

// Generate student attendance report PDF
router.get('/attendance/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const student = store.students.find(s => s.id === studentId);
  
  if (!student) {
    return res.status(404).json({ message: 'Öğrenci bulunamadı.' });
  }
  
  const attendance = store.attendance
    .map(record => ({
      ...record,
      records: record.records.filter(r => r.studentId === studentId)
    }))
    .filter(record => record.records.length > 0);
  
  // Create PDF
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="devamsizlik_${student.name}_${Date.now()}.pdf"`);
  
  doc.pipe(res);
  
  // Title
  doc.fontSize(20).text("YIĞIT'S AKADEMİ - DEVAMSIZLIK RAPORU", { align: 'center' });
  doc.fontSize(12).text(new Date().toLocaleDateString('tr-TR'), { align: 'center' });
  doc.moveDown(1);
  
  // Student info
  doc.fontSize(12).text(`Öğrenci Adı: ${student.name}`);
  doc.text(`Öğrenci ID: ${student.id}`);
  doc.moveDown(1);
  
  // Attendance records
  if (attendance.length > 0) {
    doc.fontSize(11).text('Devamsızlık Kayıtları:', { underline: true });
    doc.moveDown(0.5);
    
    let presentCount = 0;
    let absentCount = 0;
    
    attendance.forEach((record, idx) => {
      const course = store.courses.find(c => c.id === record.courseId);
      const courseName = course ? course.name : 'Bilinmiyor';
      const studentRecord = record.records.find(r => r.studentId === studentId);
      
      doc.fontSize(10);
      const status = studentRecord.present ? '✓ Hazır' : '✗ Devamsız';
      doc.text(`${idx + 1}. ${record.date} - ${courseName}: ${status}`);
      
      if (studentRecord.present) presentCount++;
      else absentCount++;
    });
    
    doc.moveDown(1);
    doc.fontSize(10);
    doc.text(`Toplam Hazır: ${presentCount}`);
    doc.text(`Toplam Devamsız: ${absentCount}`);
  } else {
    doc.fontSize(10).text('Henüz devamsızlık kaydı bulunmamaktadır.');
  }
  
  doc.moveDown(1);
  doc.fontSize(10).text(`Rapor oluşturulma tarihi: ${new Date().toLocaleString('tr-TR')}`);
  
  doc.end();
});

// Generate comprehensive student report (grades + attendance + lesson topics)
router.get('/comprehensive/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const student = store.students.find(s => s.id === studentId);
  
  if (!student) {
    return res.status(404).json({ message: 'Öğrenci bulunamadı.' });
  }
  
  const grades = store.grades.filter(g => g.studentId === studentId);
  const attendance = store.attendance
    .map(record => ({
      ...record,
      records: record.records.filter(r => r.studentId === studentId)
    }))
    .filter(record => record.records.length > 0);
  
  // Create PDF
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="rapor_${student.name}_${Date.now()}.pdf"`);
  
  doc.pipe(res);
  
  // Title
  doc.fontSize(20).text("YIĞIT'S AKADEMİ - ÖĞRENCİ RAPORU", { align: 'center' });
  doc.fontSize(12).text(new Date().toLocaleDateString('tr-TR'), { align: 'center' });
  doc.moveDown(1);
  
  // Student info
  doc.fontSize(12).text(`Öğrenci Adı: ${student.name}`);
  doc.text(`Öğrenci ID: ${student.id}`);
  doc.text(`E-mail: ${student.email || 'N/A'}`);
  doc.moveDown(1);
  
  // Grades section
  doc.fontSize(11).text('NOTLAR:', { underline: true });
  doc.moveDown(0.5);
  if (grades.length > 0) {
    grades.forEach((g, idx) => {
      const course = store.courses.find(c => c.id === g.courseId);
      const courseName = course ? course.name : 'Bilinmiyor';
      doc.fontSize(10);
      doc.text(`${idx + 1}. ${courseName} - ${g.examName}: ${g.grade}/100`);
    });
  } else {
    doc.fontSize(10).text('Henüz not kaydı bulunmamaktadır.');
  }
  
  doc.moveDown(1);
  
  // Attendance section
  doc.fontSize(11).text('DEVAMSIZLIK:', { underline: true });
  doc.moveDown(0.5);
  if (attendance.length > 0) {
    let presentCount = 0;
    let absentCount = 0;
    
    attendance.forEach((record) => {
      const studentRecord = record.records.find(r => r.studentId === studentId);
      if (studentRecord.present) presentCount++;
      else absentCount++;
    });
    
    doc.fontSize(10);
    doc.text(`Toplam Hazır: ${presentCount}`);
    doc.text(`Toplam Devamsız: ${absentCount}`);
  } else {
    doc.fontSize(10).text('Henüz devamsızlık kaydı bulunmamaktadır.');
  }
  
  doc.moveDown(1);
  doc.fontSize(10).text(`Rapor oluşturulma tarihi: ${new Date().toLocaleString('tr-TR')}`);
  
  doc.end();
});

// Generate course report with all students
router.get('/course/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  const course = store.courses.find(c => c.id === courseId);
  
  if (!course) {
    return res.status(404).json({ message: 'Kurs bulunamadı.' });
  }
  
  const courseGrades = store.grades.filter(g => g.courseId === courseId);
  
  // Create PDF
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="rapor_${course.name}_${Date.now()}.pdf"`);
  
  doc.pipe(res);
  
  // Title
  doc.fontSize(20).text("YIĞIT'S AKADEMİ - KURS RAPORU", { align: 'center' });
  doc.fontSize(12).text(new Date().toLocaleDateString('tr-TR'), { align: 'center' });
  doc.moveDown(1);
  
  // Course info
  doc.fontSize(12).text(`Kurs Adı: ${course.name}`);
  doc.text(`Kurs ID: ${course.id}`);
  doc.text(`Seviye: ${course.level || 'N/A'}`);
  doc.moveDown(1);
  
  // Grades
  doc.fontSize(11).text('NOTLAR:', { underline: true });
  doc.moveDown(0.5);
  
  if (courseGrades.length > 0) {
    courseGrades.forEach((g, idx) => {
      const student = store.students.find(s => s.id === g.studentId);
      const studentName = student ? student.name : 'Bilinmiyor';
      doc.fontSize(10);
      doc.text(`${idx + 1}. ${studentName} - ${g.examName}: ${g.grade}/100`);
    });
  } else {
    doc.fontSize(10).text('Henüz not kaydı bulunmamaktadır.');
  }
  
  doc.moveDown(1);
  doc.fontSize(10).text(`Rapor oluşturulma tarihi: ${new Date().toLocaleString('tr-TR')}`);
  
  doc.end();
});

module.exports = router;
