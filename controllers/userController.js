var User=require('./../models/userModel');
var cryp = require('crypto');
var latihan=require('./../models/latihanModel');
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/'})
var fs=require('fs');


var codeSecret=require('./../config');
var jwt=require('jsonwebtoken');

var login_user = function(req,res){
	generated_hash = require('crypto')
	.createHash('md5')
	.update(req.body.password+'portalharga', 'utf8')
	.digest('hex');
	//console.log(req.body.username);
	User.findOne({'username':req.body.username,'password':generated_hash},'-_id -password -__v' ,function(err,user){
		if(!user)
		{
			User.findOne({'username':req.body.username},function(err,user)
			{
				if(user){
					res.json({"status":"400","message":"Your password is wrong"});		
				}
				else
				{
					res.json({"status":"400","message":"Your username or password is wrong"});
				}
			});
		}
		else
		{
			res.json({"status":"200","message":"Login Success","data":user});	
		}

	})
}
var getAllUser = function(req,res){
	User.find(function(err,users){
		if(err)
		{
			res.json({"status":"400","message":"Bad Request"});
		}
		else
		{
			res.status(200);
			res.json({status:200,message:"Get data success",data:users});
		}
	})
}

var addUser = function(req,res){
	var user = new User(req.body);
	
	generated_hash = require('crypto')
	.createHash('md5')
	.update(req.body.password+'portalharga', 'utf8')
	.digest('hex');
	user.password = generated_hash;
	// console.log(req.body);
	if(req.body.name == "" && req.body.password == "" && req.body.email == "" && req.body.username == "" )
	{
			res.json({"status":"400","message":"Bad Request"});
	}
	else
	{
	user.save(function(err){
		if(err)
		{
			res.json({"status":"500","message": "Add Failed"});	
		}
		else
		{
			var dt = new Date();
            var utcDate = dt.toGMTString();
			var token = jwt.sign(user._id+utcDate+user.username,codeSecret.secret, {
            expiresIn : 60*60*24// expires in 24 hours
            });	
			res.json({"status":"200","message": "Create User Success",data:user,token:token});	
		}
	});
	
	}
}

var delId = function(req,res){
	User.findOne({'us_id':req.params.id},function(err, user){
		if(user)
		{
			res.status(404);
			user.remove();
			res.json({"status": "200", "message":"Delete Success"});	
		}
		else
		{
			res.json({"status": "404", "message":"User is not found"});				
		}
	});
};

var updateUser = function(req,res){
	User.findOne({us_id:req.body.us_id},function (err,user){
	 	jwt.verify(req.headers.token, codeSecret.secret, function(err, decoded) {      
		    if (err) 
		    {
    			return res.json({ success: false, message: 'Failed to authenticate token.' });    
	  		}		 
	  		else
	  		{
				if(err)
				{
					res.status(500).json({status:500,message:'User is not found'});
				}
				else 
				{
					generated_hash = require('crypto')
						.createHash('md5')
						.update(req.body.old_password+'portalharga', 'utf8')
						.digest('hex');
					if(user.password==generated_hash)
					{
						user.password = require('crypto')
							.createHash('md5')
							.update(req.body.new_password+'portalharga', 'utf8')
							.digest('hex');
						user.username=req.body.username;
						user.name=req.body.name;
						user.role=user.role;
						user.email=req.body.email;
						user.save(function(err){
							if(!err){
								res.status(200).json({status:200,message:'Update success',result:user});
							}
							else 
							{
								res.status(400).json({status:400,message:'bad request'});
							}
						});
					}
					else
					{
						res.status(400).json({status:400,message:'Old password is wrong'});
							
					}
				}
			}
		});
	});
}	

module.exports = {
	login_user:login_user,
	addUser:addUser,
	getAllUser:getAllUser,
	delId:delId,
	updateUser:updateUser
};