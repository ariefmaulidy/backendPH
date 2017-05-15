var express = require('express');
var app=express();
var emailController=require('./../controllers/emailController');
var emailRouter=express.Router();

emailRouter.route('/forgetPassword')
    .post(emailController.forgetPassword);
emailRouter.route('/reNewPassword')
    .post(emailController.reNewPassword);
//verify acoounts
emailRouter.route('/validate/:token')
    .get(emailController.verify);
//if token expire, get new verify
emailRouter.route('/validate/resend')
    .post(emailController.reSendGetMailVerify);
module.exports = emailRouter;