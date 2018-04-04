//untuk nodemailer ngirim email lewat mailgun
var nodemailer		 	= 	require('nodemailer');
//gmail account , username : portalharga.ipb@gmail.com password : portalharga1234
var transporter 		= 	nodemailer.createTransport('smtps://portalharga.ipb@gmail.com:portalharga1234@smtp.gmail.com');
var randomstring 		= 	require("randomstring"); //npm untuk random string
var User            	=	require('./../models/userModel');
var crypto 				= 	require('crypto');
var jwt                 =   require('jsonwebtoken');
var config				=	require('./../config');
var fs                  =   require('fs');

//send link to mail for forget password
var forgetPassword = function(req,res ){
	User.findOne({username:req.body.username},function (err,user){
		if(!user){
			res.json({
				message:"user not found"
			});
		}		
        //email user
		var email 	= user.email;
        
        //create token as params
        var token = jwt.sign({            
            username:user.username,            
        },config.secretKey,{
            expiresIn:60*60
        });
        
        //define url
        var url = 'https://ph.yippytech.com/mobile/reset-password.html?' + token;

        console.log(url);

        //contenct emailnya, mulai dari, tujuan, subjek, html
        var mailOptions = {
            from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
            to: email,
            subject: 'Forget Password',
            html:

            '<div style="width: 100%;height: 10px;background-color: #3c763d;margin: 0px" ></div>'+
            '<div style="height: 50px;background-color: lightgrey;padding: 5px" >'+
		        '<p style="padding-left: 10px">' +
			    '<b>Lupa Kata Sandi</b>' +
		        '</p>' +
	        '</div>' +

	        '<div style="width: 100%;background-color: width" >' +
		        '<img src="https://ph.yippytech.com/mobile/logo.jpg" width="100%" />' +
		        '<p>Seseorang telah melakukan permintaan pengubahan kata sandi untuk akun :</p>' +
		        '<b>'+ user.username +'</b>' +
		        '<p>Untuk reset kata sandi silahkan klik tombol dibawah:</p>' +
		        '<a href='+ url +'> <button style="background-color: #3c763d;border: none;color: white;padding: 10px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;" type="button">Reset Kata Sandi</button> </a>'+
                '<p>Apabila anda tidak melakukan permintaan pengubahan kata sandi abaikan email ini, dan kata sandi anda tidak akan diubah.</p>' +
	        '</div>' +
	        '<div style="width: 100%;background-color: lightgrey;padding: 5px" >' +
		        '<p>' +
			    '<b>Masalah dengan link ?</b> Copy dan paste URL dibawah ini ke browser:'+
			    '<a href='+ url +'>LINK</a>'+
		        '</p>' +
	        '</div>' +
	        '<div style="width: 100%;height: 2px;background-color: #3c763d" ></div>'
           
            // 'Saudara/i '+ user.name + '<br><br>'+
            // 'reNew Password at link : '+ '<a href='+ url +'>klick</a>' + '<br> <br>' +
            // 'Portal Harga SEIS ILKOM IPB'
        };			
        //function sender
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
                res.json({
                    status:200,
                    message:"succes",
                    data:email,
                    token:""
                });
            }
        });
    });
};

//update password by link
var updatePassword = function(req,res){
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){	
		var token=req.headers.authorization.split(' ')[1];  
        jwt.verify(token, config.secretKey, function(err,decode){
            if(err){
                res.json({status:402,message:err,data:"",token:token}); //ini bagian yang belum di send ke halaman yang expire token
            }else{
                User.findOne({username:decode.username}, function(err,user){
                    if(err){
                        res.json({status:402,message:err,data:"",token:token});
                    }else{
                        //get password and make md5
                        user.password = crypto.createHash('md5').update(req.body.password+'portalharga', 'ut-8').digest('hex');
                        user.save(function(err){
                            if(err){
                                res.json({status:401,message:"failed save password",data:"",token:token});
                            }else{
                                res.json({
                                    status:200,
                                    data:"",
                                    message:"succes update password",
                                    token:""
                                })
                            }
                        })                        
                    }                  
                });
            }
        })
    }else{
        res.json({status:408,message:"Token invalid",data:"",token:token});
    }
}


//user get email to validate account, if isValidate == false, email send
/*funtion require 
- isValidate
- email
- username
- name
*/
var getValidate = function(req, res, isValidate, email, username, name, user_id){   
    if(isValidate==false){
        //create token as params
        var token = jwt.sign({  
            user_id:user_id
        },config.secretKey, {
            expiresIn : 60*60
        });

        var url = 'https://ph.yippytech.com:5000/user/email/validate/' + token;
        
        //contenct emailnya, mulai dari, tujuan, subjek, html
        var mailOptions = {
            from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
            to: email,
            subject: 'Validate account',
            html:
            'Saudara/i '+ name + '<br> <br>' +
            'Validate account at link : '+ '<a href='+ url +'>klick</a>' + '<br> <br>' +
            'Portal Harga SEIS ILKOM IPB'
        };
        //function sender
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
    }
};

//reSend Validate Email
var reSendGetValidate = function(req, res){   
    User.findOne({username:req.body.username},'-_id -__v',function(err,user){
        //create token as params
        var token = jwt.sign({  
            user_id:user.user_id
        },config.secretKey, {
            expiresIn : 60*60
        });

        var url = 'https://ph.yippytech.com:5000/user/email/validate/' + token;

        //contenct emailnya, mulai dari, tujuan, subjek, html
        var mailOptions = {
            from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
            to: user.email,
            subject: 'Validate account',
            html:
            'Saudara/i '+ user.name + '<br> <br>' +
            'Validate account at link : '+ '<a href='+ url +'>klick</a>' + '<br> <br>' +
            'Portal Harga SEIS ILKOM IPB'
        };
        //function sender
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
                res.json({
                    status:200,
                    message:"Succes reSendGetValidation",
                    data:url,
                    token:token
                });
            }
        });

    })    
};

//to change isValidate to true
var validating = function(req, res){
    jwt.verify(req.params.token, config.secretKey, function(err,decode){
        console.log(req.params.token);
        if(err){
            res.redirect('https://ph.yippytech.com/mobile/validate.php/?failed');
        }else{
            User.findOne({user_id:decode.user_id},function(err,user){
                if(user.isValidate==true){
                    res.redirect('https://ph.yippytech.com/mobile/validate.php/?valid');
                }else{
                    user.isValidate=true;
                    user.save(function(err){
                        if(err){
                            res.redirect('https://ph.yippytech.com/mobile/validate.php/?failed');
                        }else{
                            res.redirect('https://ph.yippytech.com/mobile/validate.php/?success');
                        }
                    })    
                }
                
            })
        }
    })
};

class EmailController {
    constructor() {
        this.mailOptions;
        this.email;
        this.token;
    }

    //function sender
    sendMail(req, res, email) {
        transporter.sendMail(this.mailOptions, (error, info) => {
            if(error){
                return console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
                res.json({
                    status:200,
                    message:"succes",
                    data:email,
                    token:this.token
                });
            }
        });
    }

    //create token as params
    setToken(data) {
        this.token = jwt.sign({
            user_id: data,
        }, 
        config.secretKey, {
            expiresIn:60*60
        })
    }
    
    forgetPassword(req, res) {
        User.findOne({username:req.body.username},function (err,user){
            if(!user){
                res.json({
                    message:"user not found"
                });
            }		
            //email user
            this.email 	= user.email;
            this.setToken(user.user_id);
            //define url
            var url = 'https://ph.yippytech.com/mobile/reset-password.html?' + this.token;
            //contenct emailnya, mulai dari, tujuan, subjek, html
            this.mailOptions = {
                from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
                to: this.email,
                subject: 'Forget Password',
                html:   
                '<div style="width: 100%;height: 10px;background-color: #3c763d;margin: 0px" ></div>'+
                '<div style="height: 50px;background-color: lightgrey;padding: 5px" >'+
                    '<p style="padding-left: 10px">' +
                    '<b>Lupa Kata Sandi</b>' +
                    '</p>' +
                '</div>' +   
                '<div style="width: 100%;background-color: width" >' +
                    '<img src="https://ph.yippytech.com/mobile/logo.jpg" width="100%" />' +
                    '<p>Seseorang telah melakukan permintaan pengubahan kata sandi untuk akun :</p>' +
                    '<b>'+ user.username +'</b>' +
                    '<p>Untuk reset kata sandi silahkan klik tombol dibawah:</p>' +
                    '<a href='+ url +'> <button style="background-color: #3c763d;border: none;color: white;padding: 10px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;" type="button">Reset Kata Sandi</button> </a>'+
                    '<p>Apabila anda tidak melakukan permintaan pengubahan kata sandi abaikan email ini, dan kata sandi anda tidak akan diubah.</p>' +
                '</div>' +
                '<div style="width: 100%;background-color: lightgrey;padding: 5px" >' +
                    '<p>' +
                    '<b>Masalah dengan link ?</b> Copy dan paste URL dibawah ini ke browser:'+
                    '<a href='+ url +'>LINK</a>'+
                    '</p>' +
                '</div>' +
                '<div style="width: 100%;height: 2px;background-color: #3c763d" ></div>'              
                // 'Saudara/i '+ user.name + '<br><br>'+
                // 'reNew Password at link : '+ '<a href='+ url +'>klick</a>' + '<br> <br>' +
                // 'Portal Harga SEIS ILKOM IPB'
            };			
            this.sendMail(req, res);
        });
    }

    getValidate(req, res) {
        User.findOne({username:req.body.username},'-_id -__v',function(err,user){
            //create token as params
            this.setToken(user.user_id);
            var url = 'https://ph.yippytech.com:5000/user/email/validate/' + token;
            //contenct emailnya, mulai dari, tujuan, subjek, html
            this.mailOptions = {
                from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
                to: user.email,
                subject: 'Validate account',
                html:
                'Saudara/i '+ user.name + '<br> <br>' +
                'Validate account at link : '+ '<a href='+ url +'>klick</a>' + '<br> <br>' +
                'Portal Harga SEIS ILKOM IPB'
            };
            //function sender
            this.sendMail(req, res);
        })
    }
    // prototype broadcast kebijakan
    sendBroadcast(req, res, data) {
        var role = [];
        if(req.body.role.Petani) {
            role.push(4);
        }
        if(req.body.role.Penyuluh) {
            role.push(3);
        }
        if(req.body.role.Pedagang) {
            role.push(6)
        }
        if(req.body.role.Masyarakat) {
            role.push(5);
        }
        User.find({role:{ $in: role}})
            .then((result) => {
                var email = [];
                var attachments = [];
                attachments.push({filename: data.file, path: __dirname + '/../public/kebijakanfile/' + data.file})
                for(let i=0; i<result.length; i++) {
                    email.push(result[i].email);
                }
                this.mailOptions = {
                    from: '"Digital Tani" <portalharga.ipb@gmail.com>',
                    to: email,
                    subject: data.judul,
                    html: data.isi,
                    attachments: attachments
                }
                // this.sendMail(req, res, email);
            })
            .catch((err) => {
                console.log(err);
                res.json({message: 'gagal untuk membroadcast kebijakan'});
            })
    }
}

//export modul
module.exports = {
    //password
	forgetPassword:forgetPassword,
    reNewPassword:updatePassword,
    //validate
    getMailVerify:getValidate,
    verify:validating,
    reSendGetMailVerify:reSendGetValidate,
    EmailController: new EmailController
}