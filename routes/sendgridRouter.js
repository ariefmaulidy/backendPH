var express = require('express');
var app=express();
var sendgridController=require('./../controllers/sendgridController');
var sendgridRoute=express.Router();

sendgridRoute.route('/send')
  .get(sendgridController.sendEmail);

module.exports = sendgridRoute;