const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/class', require('./routes/classRegister'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/settings', require('./routes/siteSettings'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/lessons', require('./routes/lessonTopics'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => res.json({ message: 'Yigits Akademi API çalışıyor.' }));

app.listen(PORT, () => console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`));
