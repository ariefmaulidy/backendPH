var express=require('express')
var userController=require('./../controllers/userController');
var userRouter=express.Router();

// upload photo

userRouter.route('/del_id/:id')
	.get(userController.delId);
userRouter.route('/update')
	.post(userController.updateUser);

userRouter.route('/login_check')
	.post(userController.login_user);
userRouter.route('/all')
	.get(userController.getAllUser);
userRouter.route('/inputUser')
	.post(userController.addUser);
module.exports=userRouter; 