var express=require('express')
var userController=require('./../controllers/userController');
var registerRouter=express.Router();

// create new user
registerRouter.route('')
	.post(userController.addUser);
module.exports=registerRouter; 