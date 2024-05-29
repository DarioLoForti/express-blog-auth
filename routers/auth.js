const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.js');

router.get('/', auth.index);
router.post('/', auth.index);

module.exports = router;

