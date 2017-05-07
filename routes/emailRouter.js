var express = require('express');
var app=express();
var emailController=require('./../controllers/emailController');
var emailRouter=express.Router();

emailRouter.route('/forgetPassword')
    .post(emailController.forgetPassword);
emailRouter.route('/reNewPassword')
    .post(emailController.reNewPassword);
//validate acoounts
emailRouter.route('/validate/:token')
    .get(emailController.validating);
//if token expire, get new validation
emailRouter.route('/validate/resend')
    .post(emailController.reSendGetValidation);
module.exports = emailRouter;