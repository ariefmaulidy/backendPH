var express = require('express');
var app=express();
var emailController=require('./../controllers/emailController');
var emailRouter=express.Router();

emailRouter.route('/forgetPassword')
    .post(emailController.forgetPassword);
emailRouter.route('/updatePassword')
    .post(emailController.updatePassword);
//validate acoounts
emailRouter.route('/validate/:token')
    .post(emailController.postValidate);
module.exports = emailRouter;