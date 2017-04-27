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
        
        //contenct emailnya, mulai dari, tujuan, subjek, html
        var mailOptions = {
            from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
            to: email,
            subject: 'Forget Password',
            html:
            'Saudara/i '+ user.name + '<br><br>'+
            'Untuk memperbarui password silahkan buka link : '+ 'ph.yippytech.com/'+token + '<br> <br>' +
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
        
        //contenct emailnya, mulai dari, tujuan, subjek, html
        var mailOptions = {
            from: '"PORTAL-HARGA" <portalharga.ipb@gmail.com>',
            to: email,
            subject: 'Validate acoount',
            html:
            'Saudara/i '+ name + '<br> <br>' +
            'Validate account at link : '+ 'https://ph.yippytech.com:5000/user/email/validate/'+token + '<br> <br>' +
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

//to change isValidate to true
var validating = function(req, res){
    jwt.verify(req.params.token, config.secretKey, function(err,decode){
        console.log(req.params.token);
        if(err){
            res.json({status:402,message:err,data:"",token:""});
        }else{
            User.findOne({user_id:decode.user_id},function(err,user){
                user.isValidate=true;
                user.save(function(err){
                    if(err){
                        res.json({status:402,message:err,data:"",token:""});
                    }else{
                        res.send("Have been validated");
                    }
                })
            })
        }
    })
};

//export modul
module.exports = {
    //password
	forgetPassword:forgetPassword,
    updatePassword:updatePassword,
    //validate
    getValidate:getValidate,
    validating:validating
    
}