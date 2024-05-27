const express = require('express');
const { getToken } = require('../controllers/authController');
const { checkAdminRole } = require('../middlewares/authorization');
const router = express.Router();

router.post('/login', getToken);

module.exports = router;