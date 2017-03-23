var express=require('express')
var userController=require('./../controllers/userController');
var userRouter=express.Router();

// upload photo

userRouter.route('/del_id/:id')
	.get(userController.delId);
userRouter.route('/update')
	.post(userController.updateUser);
userRouter.route('/updatePassword')
	.post(userController.updatePassword);
userRouter.route('/all')
	.get(userController.getAllUser);
module.exports=userRouter; 