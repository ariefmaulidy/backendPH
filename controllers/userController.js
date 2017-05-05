var User=require('./../models/userModel');
var cryp = require('crypto');
var fs=require('fs');
var moment=require('moment');
var codeSecret=require('./../config');
var jwt=require('jsonwebtoken');
var Blacklist = require('./../models/blacklistTokenModel');
var mail      =     require('./../controllers/emailController');

//Cek ROLE

/*
1 = admin
2 = pemerintah
3 = penyuluh
4 = petani
5 = masyarakat
6 = pedagang
*/

// get all user data
var getAllUser = function(req,res){
	User.find({},'-_id -__v',function(err,users){
		if(users=='')
		{
			res.json({status:204,message:'No data provided',token:req.token});
		}
		else
		{
			res.status(200);
			res.json({status:200,message:"Get data success",data:users,token:req.token});
		}
	})
}
var getOneUser = function(req,res){
	User.findOne({user_id:req.params.user_id},'-_id -__v',function(err,users){
		if(users==null)
		{
			res.json({status:204,message:'No data provided',token:req.token});
		}
		else
		{
			res.status(200);
			res.json({status:200,message:"Get data success",data:users,token:req.token});
		}
	})
}

var getRoleUser = function(req,res){
	if(req.role==1 || req.role==2)
	{
		User.find({role:req.params.role},'-_id -__v',function(err,user){
			if(user!='')
			{
				res.json({status:200,message:"Get data success",data:user,token:req.token});
			}
			else
			{
				res.json({status:204,message:"No data provided",data:user,token:req.token});	
			}
		})
	}
	else if(req.role==3 && req.params.role==4)
	{
		User.find({role:req.params.role},'-_id -__v',function(err,user){
			if(user!='')
			{
				res.json({status:200,message:"Get data success",data:user,token:req.token});
			}
			else
			{
				res.json({status:204,message:"No data provided",data:user,token:req.token});	
			}
		})
	}
	else if(req.role!=1 || req.role!=2 || req.role!=3)
	{
		res.json({status:403,message:"Forbidden access for this user",token:req.token});
	}
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
                                        //send to email user to validate account
                                        mail.getValidate(req,res,user.isValidate,user.email,user.username,user.name);
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
                                        //send to email user to validate account
                                        mail.getValidate(req,res,user.isValidate,user.email,user.username,user.name,user.user_id);
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
	
	User.findOne({'user_id':req.user_id},function(err, user){
		if(user)
		{
			res.status(204);
			user.remove();
			res.json({"status": "200", "message":"Delete Success",token:req.token});	
		}
		else
		{
			res.json({"status": "204", "message":"User is not found",token:req.token});				
		}
	});
};

var updateUser = function(req,res){
	User.findOne({username:req.body.username},function(err,usernameCheck){
			if(usernameCheck==null || usernameCheck.user_id==req.user_id)
			{
				User.findOne({user_id:req.user_id},function (err,user){
					user.username=req.body.username;
					user.nomor_telepon=req.body.nomor_telepon;
					user.name=req.body.name;
					user.save(function(err){
						if(!err){
							res.status(200).json({status:200,message:'Update profile success',data:user,token:req.token});
						}
						else 
						{
							res.status(400).json({status:400,message:'bad request',token:req.token});
						}
					});
				});	
			}
			else if(usernameCheck.user_id!=req.user_id)
			{
				res.json({status:400,message:"Update failed, username is already exist"});
			}
		});
}	
var updateAddress = function(req,res){
	User.findOne({user_id:req.user_id},function(err,user){
		if(user!=null)
		{
				user.address=req.body.address;
				user.save(function(err){
					if(!err){
						res.status(200).json({status:200,message:'Update address success',data:user,token:req.token});
					}
					else 
					{
						res.status(400).json({status:400,message:'bad request',token:req.token});
					}
				});	
		}
		else
		{
			res.json({status:400,message:"Update failed, not authorize"});
		}
	});
}	

var updatePassword = function(req,res){
	User.findOne({user_id:req.user_id},function (err,user){
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
			user.save(function(err){
				if(!err){
					res.status(200).json({status:200,message:'Update success',data:user,token:req.token});
				}
				else 
				{
					res.status(400).json({status:400,message:'bad request',token:req.token});
				}
			});
		}
		else
		{
			res.status(400).json({status:400,message:'Wrong password',token:req.token});
		} 	
	});
}	

var uploadPhoto = function(req,res)
{
	var ImageSaver 	= require('image-saver-nodejs/lib');
	var imageSaver 	= new ImageSaver();
	var pictname	= 'pp_'+req.user_id+".jpg"

	User.findOne({user_id:req.user_id},function(err,user){
			if(user){
				if(user.picture!=null){
				fs.unlinkSync('../public_html/uploads/prof_pict/'+pictname);
				}
				user.picture='https://ph.yippytech.com/uploads/prof_pict/'+pictname;
				user.save(function(err){
					if(!err){
						imageSaver.saveFile("../public_html/uploads/prof_pict/"+pictname, req.body.picture).then((data)=>{
    					res.json({status:200,message:'Change profile picture success',picture:user.picture,token:req.token});
						})
						.catch((err)=>{
				        	res.json({status:400,message:err,token:req.token});
				    	})
					}
					else
					{
						res.json({status:400,message:err,token:req.token});
					}
				});
			}
			else
			{
				res.json({status:204,message:'User is not found'});
			}
		})
}

var logoutUser = function(req,res){
	blacklist = new Blacklist();
	//split bearer get only token
	blacklist.token = req.headers.authorization.split(' ')[1];
	blacklist.save(function(err){
		if(!err)
		{
			res.json({status:200,message:'Logout success'});
		}
		else 
		{
			res.json({status:400,message:err});
		}
	})
}

module.exports = {
	addUser:addUser,
	getRoleUser:getRoleUser,
	getOneUser:getOneUser,
	getAllUser:getAllUser,
	deleteUser:deleteUser,
	updateUser:updateUser,
	updateAddress:updateAddress,
	updatePassword:updatePassword,
	uploadPhoto:uploadPhoto,
	logoutUser:logoutUser
};