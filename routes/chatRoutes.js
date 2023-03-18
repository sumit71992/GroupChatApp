const express = require('express');
const chatController = require('../controller/chatController');
const userAuthentication = require('../middle/auth');

const router = express.Router();

router.post('/postmessage', userAuthentication.authenticate, chatController.postChat);
router.get('/getallchat', userAuthentication.authenticate, chatController.getAllChat);
router.get('/getallgroups',userAuthentication.authenticate,chatController.getallgroups);
router.post('/creategroup',userAuthentication.authenticate,chatController.createGroup);
router.post('/postgroupmessage/:id',userAuthentication.authenticate,chatController.postGroupMessage);
router.get('/getgroupmessages/:id',userAuthentication.authenticate,chatController.getGroupMessages);
router.post('/addusertogroup/:id',userAuthentication.authenticate,chatController.addUserToGroup);


module.exports = router;