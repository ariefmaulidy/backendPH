var nodemailer = require("nodemailer");

var send = function(req,res){
	var smtpTransport = nodemailer.createTransport("SMTP",{
host: "mail.smtp2go.com",
port: 2525, // 8025, 587 and 25 can also be used. 
auth: {
user: "nugrohoac",
pass: "PASSWORD"
}
});

smtpTransport.sendMail({
from: "nugrohoac96@gmail.com",
to: "nugrohoac17@gmail.com",
subject: "Your Subject",
text: "It is a test message"
}, function(error, response){
if(error){
console.log(error);
}else{
console.log("Message sent: " + response.message);
}
});
}

module.exports = {
	send:send
}