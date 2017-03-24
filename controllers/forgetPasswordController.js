//untuk nodemailer ngirim email lewat mailgun
//gmail account , username : portalharga.ipb@gmail.com password : portalharga1234
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://portalharga.ipb@gmail.com:portalharga1234@smtp.gmail.com'); //set usernae dan password
var randomstring = require("randomstring"); //npm untuk random string

var forgetPassword = function(req,res ){
	var email 	= 	req.body.email;
	var name	=	req.body.name;
	var newPassword = randomstring.generate({
		length:12,
		charset: 'alphabetic'
	});
	
	var mailOptions = {
		from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
		to: email,
		subject: 'Forget Password',
		html:
		'Saudara/i '+ name + ' password baru anda : ' + newPassword + '<br>'+
		'Setelah berhasil login segera ubah password anda'
		//'baris 2'+
	};
	
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		else {
			console.log('Message sent: ' + info.response);
			res.json({
				message:"succes",
				name:name,
				email:email
			});
		}
	});
}

module.exports = {
	forgetPassword:forgetPassword
}