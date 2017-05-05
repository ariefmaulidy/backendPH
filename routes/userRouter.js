var express=require('express');
var userController=require('./../controllers/userController');
var userRouter=express.Router();

// upload photo

userRouter.route('/delete')
	.post(userController.deleteUser);
userRouter.route('/update')
	.post(userController.updateUser);
userRouter.route('/updateAddress')
	.post(userController.updateAddress);
userRouter.route('/updatePassword')
	.post(userController.updatePassword);
userRouter.route('/uploadPhoto')
	.post(userController.uploadPhoto);
userRouter.route('/logout')
	.post(userController.logoutUser);
	
userRouter.route('/get')
	.get(userController.getAllUser);
userRouter.route('/get/role/:role')
	.get(userController.getRoleUser);
userRouter.route('/get/:user_id')
	.get(userController.getOneUser);
module.exports=userRouter; 