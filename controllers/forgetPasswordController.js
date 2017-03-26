//untuk nodemailer ngirim email lewat mailgun
//gmail account , username : portalharga.ipb@gmail.com password : portalharga1234
var nodemailer		 	= 	require('nodemailer');
var transporter 		= 	nodemailer.createTransport('smtps://portalharga.ipb@gmail.com:portalharga1234@smtp.gmail.com'); //set usernae dan password
var randomstring 		= 	require("randomstring"); //npm untuk random string
var User            	=	require('./../models/userModel');
var crypto 				= 	require('crypto');

var forgetPassword = function(req,res ){
	var name	=	req.body.name;
	var newPassword = randomstring.generate({
		length:12,
		charset: 'alphabetic'
	});

	//var email 	="";

User.findOne({username:req.body.username},function (err,user){
	user.password=crypto.createHash('md5').update(newPassword, 'ut-8').digest('hex');
	console.log(user.password);
	console.log(newPassword);
	var email 	= user.email;
	user.save(function(err){
			if(!err){
				res.status(200).json({status:200,message:'Update success'});
			}
			else
			{
				//res.status(400).json({status:400,message:'bad request'});
				console.log('filed update password');
			}

			var mailOptions = {
				from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
				to: email,
				subject: 'Forget Password',
				html:
				'Saudara/i '+ req.body.username + ' password baru anda : ' + newPassword + '<br>'+
				'Setelah berhasil login segera ubah password anda <br>' +
				'ini password yang di database : ' + user.password + '<br>' +
				'ini password yang baru yang tidak di encrip : ' + newPassword
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
						email:email
					});
				}
			});

		});
	});


}

module.exports = {
	forgetPassword:forgetPassword
}
