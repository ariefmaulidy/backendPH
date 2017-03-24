var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://portalharga.ipb@gmail.com:portalharga1234@smtp.gmail.com');

function Mail() {

  this.test = function() {

	 var mailOptions = {
		from: '"[SIMETA-ILKOM]" <simeta@apps.cs.ipb.ac.id>',
		to: 'nugroho96@gmail.com',
		subject: 'Log Bimbingan SIMETA - ',
		html:
		'Yth. Bapak/Ibu/Sdr Pembimbing Tugas Akhir dari mahasiswa berikut :<br><br>'
	  };

	  transporter.sendMail(mailOptions, function(error, info){
		  if(error){
			  return console.log(error);
		  }
		  else {
			console.log('Message sent: ' + info.response);
		  }
	  });

  }
  
}

module.exports = new Mail();
