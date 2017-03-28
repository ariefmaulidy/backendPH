var Produksi=require('./../models/statusProduksiModel');
var User=require('./../models/userModel');
var codeSecret=require('./../config');
var jwt=require('jsonwebtoken');
var moment=require('moment');
var each=require('foreach');
var fromNow = require('from-now');
var tz=require('moment-timezone');

var allProduksi = function(req,res){
	Produksi.find({us_id:req.params.id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,produksi){
					if(produksi!='')
							{ var counter = 0;
									each(produksi,function(value,key,array){
										User.findOne({us_id:produksi[key].us_id}).exec(function(err,user){
										produksi[key].name=user.name;
										console.log(produksi[key].name);
										counter++;
										produksi[key].time=fromNow(produksi[key].datePost);
										if(counter==produksi.length)
											{									
							 					res.json({status:200,message:'Get data success',data:produksi});		
											}
										});
									})			
								}
				
					else
					{
						res.json({status:404,message:'No data provided'});
					}
			})
}

var postProduksi = function(req,res){
		produksi = new Produksi(req.body);
	  	var time=moment();
	  	produksi.datePost = Date.parse(moment(time).tz('Asia/Jakarta')); 
		produksi.save(function(err)
		{
			if(!err)
			{
				res.json({status:200,success:true,message:'Input Success',data:produksi});
			}
			else
			{

				res.json({status:400,success:false,message:'Input Failed'});
			}
		});
}

var delProduksi = function(req,res){
	Produksi.findOne({produksi_id:req.body.produksi_id,us_id:req.body.us_id},function(err,produksi){
	//	res.json({aspirasi});
		if(produksi!='')
		{
			produksi.remove(function(err){
				if(!err){
					res.status(200).json({status:200,message:"delete success"});
				}
				else{
					res.status(403).json({status:403,message:"Forbidden"});
				}
			})
		}
		else
		{
			res.status(403).json({status:403,message:"Forbidden"});
		}
	})
}

module.exports={
	delProduksi:delProduksi,
	allProduksi:allProduksi,
	postProduksi:postProduksi
};

	