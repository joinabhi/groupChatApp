const express=require('express')
const userController=require('../controller/user')

const router=express.Router();

router.post('/add-signUp', userController.signUp);

router.post('/add-signIn', userController.signIn);

router.get('/group-user', userController.getUser)


module.exports=router;