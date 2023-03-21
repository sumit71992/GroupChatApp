const express = require('express');
const userAuthentication = require('../middle/auth');
const groupController = require('../controller/groupController');

const router = express.Router();

router.post('/creategroup',userAuthentication.authenticate,groupController.createGroup);
router.get('/getallgroups',userAuthentication.authenticate,groupController.getAllGroups);
router.post('/postgroupmessage/:id',userAuthentication.authenticate,groupController.postGroupMessage);
router.get('/getgroupmessages/:id',userAuthentication.authenticate,groupController.getGroupMessages);
router.post('/addusertogroup/:id',userAuthentication.authenticate,groupController.addUserToGroup);
router.delete('/removeuserfromgroup/:id',userAuthentication.authenticate,groupController.removeUserFromGroup);
router.get('/getgroupmembers/:id', userAuthentication.authenticate,groupController.getAllGroupMembers);
router.put('/makeadmin/:id',userAuthentication.authenticate,groupController.makeOtherMemberAdmin);

module.exports = router;