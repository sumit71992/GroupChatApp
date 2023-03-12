const express = require('express');
const chatController = require('../controller/chatController');
const userAuthentication = require('../middle/auth');

const router = express.Router();

router.post('/postmessage', userAuthentication.authenticate, chatController.postChat);
router.get('/getchat', userAuthentication.authenticate, chatController.getAllChat);


module.exports = router;