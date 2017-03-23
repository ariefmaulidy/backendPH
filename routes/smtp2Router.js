var express = require('express');
var app=express();
var smtpController=require('./../controllers/smtp2Controller');
var smtpRouter=express.Router();

smtpRouter.route('/send')
  .get(smtpController.send);

module.exports = smtpRouter;