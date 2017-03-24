var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://portalharga.ipb@gmail.com:portalharga1234@smtp.gmail.com');
var randomstring = require("randomstring"); //npm untuk random string
var newPassword = randomstring.generate({
	length:12,
	charset: 'alphabetic'
})

var email = 'nugrohoac96@gmail.com';

var send = function(req,res ){
	var mailOptions = {
		from: '"[PORTAL-HARGA]" <portalharga.ipb@gmail.com>',
		to: email,
		subject: 'Alhamdulillah',
		html:
		'Yth. Bapak/Ibu/Sdr Pembimbing Tugas Akhir dari mahasiswa berikut :<br><br>'+
		'baris 1<br>'+
		'passwor baru anda : ' + newPassword
  	};
	
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		else {
			console.log('Message sent: ' + info.response);
		}
	});
	console.log('success');
}

module.exports = {
	send:send
}