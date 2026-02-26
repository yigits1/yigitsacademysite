const express = require('express');
const router = express.Router();
const store = require('../store');

// Get messages. Optionally filter by participants. If no filter provided admin sees all.
router.get('/', (req, res) => {
  // support old query params plus new generic ones
  let { participantRole, participantId, otherRole, otherId, studentId, teacherId, adminId } = req.query;
  // map legacy ids to participantRole/participantId
  if (studentId) {
    participantRole = 'student';
    participantId = studentId;
  }
  if (teacherId) {
    participantRole = 'teacher';
    participantId = teacherId;
  }
  if (adminId) {
    participantRole = 'admin';
    participantId = adminId;
  }

  let result = store.messages;

  if (participantRole && participantId) {
    result = result.filter(m =>
      (m.fromRole === participantRole && m.fromId === participantId) ||
      (m.toRole === participantRole && m.toId === participantId)
    );
  }

  if (otherRole && otherId) {
    result = result.filter(m =>
      (m.fromRole === otherRole && m.fromId === otherId) ||
      (m.toRole === otherRole && m.toId === otherId)
    );
  }

  res.json([...result].reverse());
});

// Send a message between any two participants (student / teacher / admin)
router.post('/', (req, res) => {
  const {
    fromRole,
    fromId,
    toRole,
    toId,
    subject,
    content
  } = req.body;

  const entry = {
    id: store.uuidv4(),
    fromRole: fromRole || 'student',
    fromId: fromId || null,
    toRole: toRole || 'admin',
    toId: toId || null,
    subject: subject || '',
    content: content || '',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  };
  store.messages.push(entry);
  store.save('messages');
  res.status(201).json(entry);
});

// Deprecated reply route kept for compatibility
router.put('/:id/reply', (req, res) => {
  const idx = store.messages.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Bulunamadı.' });
  store.messages[idx].reply = req.body.reply;
  store.messages[idx].replyDate = new Date().toISOString().split('T')[0];
  store.save('messages');
  res.json(store.messages[idx]);
});

router.delete('/:id', (req, res) => {
  const idx = store.messages.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Bulunamadı.' });
  store.messages.splice(idx, 1);
  store.save('messages');
  res.json({ message: 'Silindi.' });
});

module.exports = router;
