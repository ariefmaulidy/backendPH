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
	if(aspirasi!=null)
	{ 	
		var counter = 0;
		
				each(aspirasi,function(value,key,array){
					User.findOne({us_id:aspirasi[key].us_id}).exec(function(err,user){
					aspirasi[key].name=user.name;
					aspirasi[key].prof_pict=user.prof_pict;
					aspirasi[key].time=fromNow(aspirasi[key].datePost);
					aspirasi[key].total_pendukung=aspirasi[key].pendukung_id.length;
					aspirasi[key].status_voted=false;
					
					if(counter<=aspirasi.length)
					{
						for(var i=0;i<aspirasi[key].pendukung_id.length;i++)
						{
							if(aspirasi[key].pendukung_id[i].idpendukung==req.params.id)
							{
								aspirasi[key].status_voted=true;
							}
							else if(aspirasi[key].pendukung_id.length==0)
							{
								aspirasi[key].status_voted=false;
							}

						}
					}
					counter++;
					if(counter==aspirasi.length)
						{
		 					res.json({status:200,message:'Get data success',data:aspirasi,token:req.token});		
						}
					});
				})			
				
		}
		
			
	});
}

var aspirasiKu = function(req,res){
	Aspirasi.find({us_id:req.params.id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,aspirasi){
	if(aspirasi.length!=0)
	{ 	
		var counter = 0;
		
				each(aspirasi,function(value,key,array){
					User.findOne({us_id:aspirasi[key].us_id}).exec(function(err,user){
					aspirasi[key].name=user.name;
					aspirasi[key].prof_pict=user.prof_pict;
					aspirasi[key].time=fromNow(aspirasi[key].datePost);
					aspirasi[key].total_pendukung=aspirasi[key].pendukung_id.length;
					aspirasi[key].status_voted=false;
					counter++;
					if(counter==aspirasi.length)
						{
							//console.log(aspirasi[0].pendukung_id[0]);
		 					res.json({status:200,message:'Get data success',data:aspirasi,token:req.token});		
						}
					});
				})			
				
		}
		else
		{
			res.json({status:404,message:'No data provided'});
		}
					
	});
}

var getPendukung = function(req,res){
	Aspirasi.findOne({aspirasi_id:req.params.aspirasi_id}).lean().exec(function(err,aspirasi){
	if(aspirasi.pendukung_id.length!=0)
	{ 	
		//console.log(aspirasi.pendukung_id.length);
		var counter = 0;
		var pendukung=[];
				each(aspirasi.pendukung_id,function(value,key,array){
					User.findOne({us_id:value.idpendukung},'name prof_pict -_id',function(err,user){
					if(user!=null){
					pendukung.push(user);
					counter++;	
					if(counter==aspirasi.pendukung_id.length)
						{
							if(pendukung!=[])
								{
									res.json({status:200,message:'Get data success',data_pendukung:pendukung,token:req.token});		
								}
						}
					}
						
					});
				})									
		}
		else
		{
			res.json({status:404,message:'No data provided'});
		}	
		
			
	});	
}
var batalDukung = function(req,res){
	if(req.role==1||req.role==0)
	{
		Aspirasi.update( 
      { aspirasi_id: req.body.aspirasi_id },
      { $pull: { pendukung_id : { idpendukung : req.body.us_id } } },
      { safe: true },
      function(err, aspirasi) {
        res.json({status:200,message:'Delete vote success',token:req.token});  
      });
    }  				
}

var postAspirasi = function(req,res){
	aspirasi = new Aspirasi(req.body);
	//console.log(req.role);
	  	var time=moment();
		aspirasi.datePost = moment(time).tz('Asia/Jakarta'); 
		aspirasi.save(function(err)
		{
			if(!err && (req.role==1||req.role==0))
			{
				res.json({status:200,success:true,message:'Input Success',data:aspirasi,token:req.token});
			}
			else
			{

				res.json({status:400,success:false,message:'Input Failed'});
			}
		}); 
}

var delAspirasi = function(req,res){
	Aspirasi.findOne({aspirasi_id:req.body.aspirasi_id,us_id:req.body.us_id},function(err,aspirasi){
	//	res.json({aspirasi});
		if(aspirasi!=null && (req.role==1||req.role==0))
		{
			aspirasi.remove(function(err){
				if(!err){
					res.status(200).json({status:200,message:"delete success",token:req.token});
				}
				else{
					res.status(400).json({status:400,message:"Bad request"});
				}
			})
		}
		else
		{
			res.status(403).json({status:403,message:"Forbidden"});
		}
	})
}
var dukung_aspirasi = function(req,res){
	Aspirasi.findOne({aspirasi_id:req.body.aspirasi_id}).exec(function(err,aspirasi){
		console.log(req.role);
	if(aspirasi!=null && req.role==1)
		{
			aspirasi.pendukung_id.push({idpendukung:req.body.us_id});
			console.log(aspirasi);
				aspirasi.save(function(err)
				{
				if(!err){
					res.status(200).json({status:200,message:"success",result:aspirasi,token:req.token});
				}
				else{
					res.status(400).json({status:400,message:"Bad request"});
				}
			});
		}
		else
		{
			res.status(403).json({status:403,message:"Forbidden"});
		}
	})
}

module.exports = {
	allAspirasi:allAspirasi,
	aspirasiKu:aspirasiKu,
	batalDukung:batalDukung,
	getPendukung:getPendukung,
	postAspirasi:postAspirasi,
	delAspirasi:delAspirasi,
	dukung_aspirasi:dukung_aspirasi
}