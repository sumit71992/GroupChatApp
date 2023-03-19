const express = require('express');
const userAuthentication = require('../middle/auth');
const groupController = require('../controller/groupController');

const router = express.Router();

router.post('/creategroup',userAuthentication.authenticate,groupController.createGroup);
router.get('/getallgroups',userAuthentication.authenticate,groupController.getallgroups);
router.post('/postgroupmessage/:id',userAuthentication.authenticate,groupController.postGroupMessage);
router.get('/getgroupmessages/:id',userAuthentication.authenticate,groupController.getGroupMessages);
router.post('/addusertogroup/:id',userAuthentication.authenticate,groupController.addUserToGroup);

module.exports = router;