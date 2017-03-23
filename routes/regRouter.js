var express=require('express')
var userController=require('./../controllers/userController');
var regRouter=express.Router();

// upload photo

regRouter.route('/inputUser')
	.post(userController.addUser);
module.exports=regRouter;