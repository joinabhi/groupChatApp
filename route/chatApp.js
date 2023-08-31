const express=require('express');
const chatAppController=require('../controller/chatApp');
const userAuthentication=require('../middleware/auth')
const router=express.Router()

router.post('/add-chat', userAuthentication.authenticate, chatAppController.addChat);

router.get('/get-chat', userAuthentication.authenticate, chatAppController.getChat);

router.post('/create-group', userAuthentication.authenticate, chatAppController.createGroup);

// router.post('/join-group', userAuthentication.authenticate, chatAppController.joinGroup);

router.get('/get-group',userAuthentication.authenticate, chatAppController.getGroups)

router.delete('/delete-chat/:id', userAuthentication.authenticate, chatAppController.deleteChat)

router.delete('/delete-group/:id', userAuthentication.authenticate, chatAppController.deleteGroup)

router.get('/get-group/:id', userAuthentication.authenticate, chatAppController.fetchGroup)

router.post('/create-multimediaFile', userAuthentication.authenticate, chatAppController.uploadFile)

router.get('/get-multimediaFile', userAuthentication.authenticate, chatAppController.downloadFile)

// router.post('/create-group2', userAuthentication.authenticate, chatAppController.createGroupUsingSocket)

module.exports=router;