var express=require('express')
var userController=require('./../controllers/userController');
 
var userRouter=express.Router();

userRouter.route('/get')
	.get(userController.getUser);
module.exports=userRouter; 