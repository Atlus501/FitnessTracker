const express = require('express');
const router = express.Router();
const helper = require('./helpers/UsersHelper.js');

router.post('/register', helper.register);
router.post('/login', helper.login);
router.get('/:user_id', helper.getUser);

module.exports = router;
