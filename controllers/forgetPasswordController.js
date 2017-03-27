//untuk nodemailer ngirim email lewat mailgun
var nodemailer		 	= 	require('nodemailer');
//gmail account , username : portalharga.ipb@gmail.com password : portalharga1234
var transporter 		= 	nodemailer.createTransport('smtps://portalharga.ipb@gmail.com:portalharga1234@smtp.gmail.com');
var randomstring 		= 	require("randomstring"); //npm untuk random string
var User            	=	require('./../models/userModel');
var crypto 				= 	require('crypto');

var forgetPassword = function(req,res ){
	var name = req.body.name;
	//random string sepanjang 12 karakter password string alfabet tanpa angka
	var newPassword = randomstring.generate({	
		length:12,
		charset: 'alphabetic'
	});
	
	//cari usernamenya	
	User.findOne({username:req.body.username},function (err,user){
		if(!user){
			res.json({
				message:"user not found"
			});
		}
		//pembuatan md5 ditambahi dengan (portalharga)
		user.password=crypto.createHash('md5').update(newPassword+'portalharga', 'ut-8').digest('hex');
		//menyimpan email
		var email 	= user.email;
		user.save(function(err){
			if(!err){
				res.status(200).json({status:200,message:'Update success'});
			}else{
				console.log('filed update password');
			}
			
			//contenct emailnya, mulai dari, tujuan, subjek, html
			var mailOptions = {
				from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
				to: email,
				subject: 'Forget Password',
				html:
				'Saudara/i '+ req.body.username + ' password baru anda : ' + newPassword + '<br><br>'+
				'Setelah berhasil login segera ubah password anda <br>'
			};
			
			//function sender
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					return console.log(error);
				}else{
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

//export modul
module.exports = {
	forgetPassword:forgetPassword
}