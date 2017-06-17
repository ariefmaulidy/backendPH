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
        var url = 'https://ph.yippytech.com:5000/lokasi/provinsi'// + token;

        //contenct emailnya, mulai dari, tujuan, subjek, html
        var mailOptions = {
            from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
            to: email,
            subject: 'Forget Password',
            html:
            'Saudara/i '+ user.name + '<br><br>'+
            'reNew Password at link : '+ '<a href='+ url +'>klick</a>' + '<br> <br>' +
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
                res.json({status:402,message:err,data:"",token:token});
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
        var url2 = 'www.google.com';

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
            res.redirect('https://www.google.com');
        }else{
            User.findOne({user_id:decode.user_id},function(err,user){
                if(user.isValidate==false){
                    res.redirect('https://facebook.com');
                }else{
                    user.isValidate=true;
                    user.save(function(err){
                        if(err){
                            res.redirect('https://www.google.com');
                        }else{
                            res.send("Have been validated");
                        }
                    })    
                }
                
            })
        }
    })
};

//export modul
module.exports = {
    //password
	forgetPassword:forgetPassword,
    reNewPassword:updatePassword,
    //validate
    getMailVerify:getValidate,
    verify:validating,
    reSendGetMailVerify:reSendGetValidate
    
}