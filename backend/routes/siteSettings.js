const express = require('express');
const router = express.Router();
const store = require('../store');

router.get('/', (req, res) => {
  res.json(store.siteSettings);
});

router.put('/', (req, res) => {
  Object.assign(store.siteSettings, req.body);
  store.save('settings');
  res.json(store.siteSettings);
});

module.exports = router;
