var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var moment=require('moment');
var tz=require('moment-timezone');
var each = require('foreach');
var math = require('mathjs'); //untuk math
var sendgrid = require('sendgrid')('nugrohoac','silentmirror007');

//var now = require('date-now');
var date = require('date-utils');;

/*var sendEmail = function(req,res){
	sendgrid.send({
		to:'nugrohoac17@gmail.com',
		from:'nugrohoac96@gmail.com',
		subject:'i am try sendgrid',
		text:'sendgrid on inbox'
	},function(err,json){
		if(err){
			console.error(err);
		}
		console.log(json);
	});
};*/

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
var helper = require('sendgrid').mail;
  
from_email = new helper.Email("nugrohoac17@gmail.com");
to_email = new helper.Email("nugrohoac96@gmail.com");
subject = "Sending with SendGrid is Fun";
content = new helper.Content("text/plain", "and easy to do anywhere, even with Node.js open link www.google.com jam 13.40");
mail = new helper.Mail(from_email, subject, to_email, content);

var sg = require('sendgrid')('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')/*(process.env.SENDGRID_API_KEY)*/;
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON()
});
var sendEmail = function(req,res){
	sg.API(request, function(error, response) {
		console.log(response.statusCode);
		console.log(response.body);
  		console.log(response.headers);
	})
}

/*var sendEmail = function(req,res){
	// using SendGrid's Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
var sendgrid = require("sendgrid")(process.env.SENDGRID_API_KEY);
var email = new sendgrid.Email();

email.addTo("nugrohoac96@gmail.com");
email.setFrom("nugrohoac17@gmail.com");
email.setSubject("Sending with SendGrid is Fun");
email.setHtml("and easy to do anywhere, even with Node.js");

sendgrid.send(email);
}*/
	
module.exports ={
	sendEmail:sendEmail
}