var Aspirasi=require('./../models/aspirasiModel');
var User=require('./../models/userModel');
var codeSecret=require('./../config');
var jwt=require('jsonwebtoken');
var moment=require('moment');
var tz=require('moment-timezone');
var fromNow = require('from-now');
var each = require('foreach');

var allAspirasi = function(req,res){
	Aspirasi.find({},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,aspirasi){
	if(aspirasi!='')
	{ 	
				each(aspirasi,function(value,key,array)
				{
					User.findOne({user_id:aspirasi[key].user_id}).exec(function(err,user){
					aspirasi[key].name=user.name;
					aspirasi[key].picture=user.picture;
					aspirasi[key].time=fromNow(aspirasi[key].datePost);
					aspirasi[key].total_pendukung=aspirasi[key].pendukung.length;
					aspirasi[key].status_voted=false;
					for(var i=0;i<aspirasi[key].pendukung.length;i++)
					{
						if(aspirasi[key].pendukung[i].user_id==req.user_id)
						{
							aspirasi[key].status_voted=true;
						}
						else if(aspirasi[key].pendukung.length==0)
						{
							aspirasi[key].status_voted=false;
						}

					}	
					});
				})			
				setTimeout(function()
				{
					res.json({status:200,message:'Get data success',data:aspirasi,token:req.token});				
				},100);
				
		}
		
		else
		{
			res.json({status:204,message:'No data provided'});
		}
			
	});
}

var aspirasiKu = function(req,res){
	Aspirasi.find({user_id:req.params.user_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,aspirasi){
	if(aspirasi.length!=0)
	{ 	
				each(aspirasi,function(value,key,array){
					User.findOne({user_id:aspirasi[key].user_id}.sort).exec(function(err,user){
					aspirasi[key].name=user.name;
					aspirasi[key].picture=user.picture;
					aspirasi[key].time=fromNow(aspirasi[key].datePost);
					aspirasi[key].total_pendukung=aspirasi[key].pendukung.length;
					aspirasi[key].status_voted=false;
					});
				})
				setTimeout(function()
				{
					res.json({status:200,message:'Get data success',data:aspirasi,token:req.token});				
				},100);			
		}
		else
		{
			res.json({status:204,message:'No data provided',token:req.token});
		}
					
	});
}

var getPendukung = function(req,res)
{
	Aspirasi.findOne({aspirasi_id:req.params.aspirasi_id}).lean().exec(function(err,aspirasi){
	if(aspirasi!=null)
	{ 	
		console.log(aspirasi.pendukung.length);
		var counter = 0;
		var pendukungKu=[];
		each(aspirasi.pendukung,function(value,key,array)
		{
			User.findOne({user_id:value.user_id},'name picture -_id',function(err,user)
			{
				if(user!=null)
				{
					pendukungKu.push(user);
				}
			});
		})
		setTimeout(function()
		{
			if(pendukungKu!='')
			{
				res.json({status:200,message:'Get data success',data:pendukungKu,token:req.token});		
			}
			else 
			{
				res.json({status:204,message:'No data provided',token:req.token});		
			}				
		},100);										
	}
	else
	{
		res.json({status:403,message:'Wrong aspirasi_id',token:req.token});
	}	
		
			
	});	
}

var batalDukung = function(req,res){
	if(req.role==1||req.role==4)
	{
		Aspirasi.update( 
      { aspirasi_id: req.body.aspirasi_id },
      { $pull: { pendukung : { user_id : req.user_id } } },
      { safe: true },
      function(err, aspirasi) {
        console.log(err);
        if(!err)
        {
	        res.json({status:200,message:'Delete vote success',token:req.token});
        }
        else
        {
        	res.json({status:400,message:err,token:req.token});	
        }  
      });

    }  				
}

var postAspirasi = function(req,res){
	aspirasi = new Aspirasi(req.body);
	aspirasi.user_id=req.user_id;
	//console.log(req.role);
	  	var time=moment();
		aspirasi.datePost = Date.parse(moment(time).tz('Asia/Jakarta')); 
		aspirasi.save(function(err)
		{
			if(!err)
			{
				res.json({status:200,success:true,message:'Input Success',data:aspirasi,token:req.token});
			}
			else
			{

				res.json({status:400,success:false,message:'Input Failed',token:req.token});
			}
		}); 
}

var updateAspirasi = function(req,res)
{
	Aspirasi.findOne({aspirasi_id:req.body.aspirasi_id},function(err,aspirasi)
	{
		console.log(aspirasi);
		if(aspirasi!='' && (req.role==1||req.role==4))
		{
			aspirasi.subjek		=	req.body.subjek;
			aspirasi.isi		=	req.body.isi;
			var time 			=	moment();
			aspirasi.datePost 	= 	Date.parse(moment(time).tz('Asia/Jakarta')); 
			aspirasi.save(function(err)
			{
				if(!err)
				{
					res.status(200).json({status:200,message:"update success",data:aspirasi,token:req.token});
				}
				else{
					res.status(400).json({status:400,message:"Bad request",token:req.token});
				}
			})	
		}
		else
		{
			res.status(403).json({status:403,message:"Forbidden",token:req.token});
		}
	})
}

var delAspirasi = function(req,res){
	Aspirasi.findOne({aspirasi_id:req.body.aspirasi_id,user_id:req.user_id},function(err,aspirasi){
	//	res.json({aspirasi});
		if(aspirasi!='' && (req.role==1||req.role==4))
		{
			aspirasi.remove(function(err){
				if(!err){
					res.status(200).json({status:200,message:"delete success",token:req.token});
				}
				else
				{
					res.status(400).json({status:400,message:"Bad request",token:req.token});
				}
			})
		}
		else
		{
			res.status(403).json({status:403,message:"Forbidden",token:req.token});
		}
	})
}
var dukung_aspirasi = function(req,res){
	Aspirasi.findOne({aspirasi_id:req.body.aspirasi_id}).exec(function(err,aspirasi){
	if(aspirasi!='' && (req.role==1||req.role==4) )
		{ 
			console.log(aspirasi.pendukung.length)
			counter=0;
			status_voted=false;
			if(aspirasi.pendukung.length==0)
			{
				aspirasi.pendukung.push({user_id:req.user_id});
				console.log(aspirasi);
					aspirasi.save(function(err)
					{
					if(!err)
					{
						res.status(200).json({status:200,message:"Vote success",data:aspirasi,token:req.token});
					}
					else{
						res.status(400).json({status:400,message:"Bad request",token:req.token});
					}
				});
			}
			else
			{
				each(aspirasi.pendukung,function(value,key,array)
				{
						if(value.user_id==req.user_id || aspirasi.user_id==req.user_id)
						{
							status_voted=true;
						}
						counter++;
						if(counter>=aspirasi.pendukung.length && status_voted==false)
						{	
							aspirasi.pendukung.push({user_id:req.user_id});
							console.log(aspirasi);
								aspirasi.save(function(err)
								{
								if(!err){
									res.status(200).json({status:200,message:"Vote success",data:aspirasi,token:req.token});
								}
								else
								{
									res.status(400).json({status:400,message:"Bad request",token:req.token});
								}
							});
						}
						else if(counter>=aspirasi.pendukung.length && status_voted==true)
						{
							res.status(400).json({status:400,message:"User already voted or user is this aspirasi's creator",token:req.token});
						}
				})	
			}
		}
		else
		{
			res.status(403).json({status:403,message:"Forbidden",token:req.token});
		}
	})
}

module.exports = {
	allAspirasi:allAspirasi,
	aspirasiKu:aspirasiKu,
	updateAspirasi:updateAspirasi,
	batalDukung:batalDukung,
	getPendukung:getPendukung,
	postAspirasi:postAspirasi,
	delAspirasi:delAspirasi,
	dukung_aspirasi:dukung_aspirasi
}
