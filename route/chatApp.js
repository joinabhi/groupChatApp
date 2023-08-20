const express=require('express');
const chatAppController=require('../controller/chatApp');
const userAuthentication=require('../middleware/auth')
const router=express.Router()

router.post('/add-chat', userAuthentication.authenticate, chatAppController.addChat);

router.get('/get-chat', userAuthentication.authenticate, chatAppController.getChat);

module.exports=router;