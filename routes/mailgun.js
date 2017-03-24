var express = require('express');
var app=express();
var mail=require('./../controllers/mailgun');
var mailRouter=express.Router();

mailRouter.route('/send')
  .get(mail.send);

module.exports = mailRouter;