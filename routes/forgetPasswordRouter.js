var express = require('express');
var app=express();
var forgetPasswordController=require('./../controllers/forgetPasswordController');
var forgetPasswordRouter=express.Router();

forgetPasswordRouter.route('')
  .post(forgetPasswordController.forgetPassword);

module.exports = forgetPasswordRouter;
