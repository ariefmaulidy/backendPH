var User=require('./../models/userModel');
var cryp = require('crypto');
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/'})
var fs=require('fs');

var codeSecret=require('./../config');
var jwt=require('jsonwebtoken');

var getAllUser = function(req,res){
	User.find(function(err,users){
		if(users=='')
		{
			res.json({status:404,message:'No data provided'});
		}
		else
		{
			res.status(200);
			res.json({status:200,message:"Get data success",data:users});
		}
	})
}
var getOneUser = function(req,res){
	User.findOne({user_id:req.params.user_id},function(err,users){
		if(users==null)
		{
			res.json({status:404,message:'No data provided'});
		}
		else
		{
			res.status(200);
			res.json({status:200,message:"Get data success",data:users});
		}
	})
}

var addUser = function(req,res){
		User.findOne({username:req.body.username},function(err,usernameCheck){
			if(usernameCheck!=null)
			{
				console.log('sini');
				res.json({status:500,message:"Create failed, username is already exist"});
			}
			else
			{
				User.findOne({email:req.body.email},function(err,emailCheck){
					if(emailCheck!=null)
					{
						res.json({status:500,message:"Create failed, Email is already exist"});
					}
					else
					{	
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
									res.json({"status":"500","message": "Create failed",error:err});	
								}
								else
								{
									if(req.body.login_type==0)
									{
										var dt = new Date();
							            var utcDate = dt.toGMTString();
										var token = jwt.sign({
																user_id:user.user_id,
																username:user.username,
																time:utcDate,
																role:user.role,
																login_type:req.body.login_type
																},codeSecret.secret,{
													            expiresIn : 60*20// expires in 24 hours
							            					});	
										res.json({"status":"200","message": "Create User Success",data:user,token:token});	
									}
									else if(req.body.login_type==1)
									{
										var dt = new Date();
							            var utcDate = dt.toGMTString();
										var token = jwt.sign({
																user_id:user.user_id,
																username:user.username,
																time:utcDate,
																role:user.role,
																login_type:req.body.login_type
																},codeSecret.secret,{
													        });	
										res.json({"status":"200","message": "Create User Success",data:user,token:token});	
									} 
								}
							});
						}		
					}
				});		
			}

		});

		
}

var deleteUser = function(req,res){
	
	User.findOne({'user_id':req.body.user_id},function(err, user){
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
	User.findOne({user_id:req.body.user_id},function (err,user){
		user.username=req.body.username;
		user.name=req.body.name;
		user.role=user.role;
		user.email=req.body.email;
		user.save(function(err){
			if(!err){
				res.status(200).json({status:200,message:'Update success',data:user});
			}
			else 
			{
				res.status(400).json({status:400,message:'bad request'});
			}
		});
	});
}	


var updatePassword = function(req,res){
	User.findOne({user_id:req.body.user_id},function (err,user){
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
			user.username=user.username;
			user.name=user.name;
			user.role=user.role;
			user.email=user.email;
			user.save(function(err){
				if(!err){
					res.status(200).json({status:200,message:'Update success',data:user});
				}
				else 
				{
					res.status(400).json({status:400,message:'bad request'});
				}
			});
		}
		else
		{
			res.status(400).json({status:400,message:'Wrong password'});
		} 	
	});
}	

var uploadPhoto = function(req,res)
{
	var ImageSaver = require('image-saver-nodejs/lib');
	var imageSaver = new ImageSaver();
	
	User.findOne({user_id:req.body.user_id},function(err,user){
			if(user){
				if(user.picture!=null){
				fs.unlinkSync('../public_html/'+user.picture);
				}
				var time=moment();
				user.picture='uploads/picture/pp_'+user.username+moment(time).tz('Asia/Jakarta')+".jpg";
				user.save(function(err){
					if(!err){
						imageSaver.saveFile("../public_html/"+user.picture, req.body.string64).then((data)=>{
    					res.json({status:200,message:'Change profile picture success',picture:user.picture});
						})
						.catch((err)=>{
				        	res.json({status:400,message:err});
				    	})
					}
					else
					{
						res.json({status:400,message:err});
					}
				});
			}
			else
			{
				res.json({status:404,message:'User is not found'});
			}
		})
}

module.exports = {
	addUser:addUser,
	getOneUser:getOneUser,
	getAllUser:getAllUser,
	deleteUser:deleteUser,
	updateUser:updateUser,
	updatePassword:updatePassword,
	uploadPhoto:uploadPhoto
};