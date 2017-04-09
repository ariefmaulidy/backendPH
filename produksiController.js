var Produksi=require('./../models/produksiModel');
var Komoditas=require('./../models/komoditasModel');
var User=require('./../models/userModel');
var codeSecret=require('./../config');
var jwt=require('jsonwebtoken');
var moment=require('moment');
var each=require('foreach');
var fromNow = require('from-now');
var tz=require('moment-timezone');

var getProduksi = function(req,res){
	Produksi.find({},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,produksi){
					if(produksi!='')
					{ 
						each(produksi,function(value,key,array)
						{
							
							User.findOne({user_id:produksi[key].user_id}).exec(function(err,user){
							produksi[key].name=user.name;
							produksi[key].picture=user.picture;
							produksi[key].time=fromNow(produksi[key].datePost);
							produksi[key].datePost=new Date(produksi[key].datePost);
							produksi[key].datePost=produksi[key].datePost.toString();
							produksi[key].date_panen=new Date(produksi[key].date_panen);
							produksi[key].date_panen=produksi[key].date_panen.toString();
							});

							Komoditas.findOne({komoditas_id:produksi[key].komoditas_id}).exec(function(err,komoditas)
							{
								produksi[key].nama_komoditas=komoditas.name;
								produksi[key].satuan_komoditas=komoditas.satuan;
				
							});
						})			
					
						setTimeout(function()
						{
							res.json({status:200,message:'Get data success',data:produksi,token:req.token});
						},100);
					}
					else
					{
						res.json({status:204,message:'No data provided',token:req.token});
					}
			})
}
var getProduksiKu = function(req,res){
	Produksi.find({user_id:req.params.id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,produksi){
					if(produksi!='')
					{ 
						each(produksi,function(value,key,array)
						{
							
							User.findOne({user_id:produksi[key].user_id}).exec(function(err,user){
							produksi[key].name=user.name;
							produksi[key].picture=user.picture;
							produksi[key].time=fromNow(produksi[key].datePost);
							produksi[key].datePost=new Date(produksi[key].datePost);
							produksi[key].datePost=produksi[key].datePost.toString();
							produksi[key].date_panen=new Date(produksi[key].date_panen);
							produksi[key].date_panen=produksi[key].date_panen.toString();
							
							});

							Komoditas.findOne({komoditas_id:produksi[key].komoditas_id}).exec(function(err,komoditas)
							{
								produksi[key].nama_komoditas=komoditas.name;
								produksi[key].satuan_komoditas=komoditas.satuan;
				
							});
						})			
					
						setTimeout(function()
						{
							res.json({status:200,message:'Get data success',data:produksi,token:req.token});
						},100);
					}
					else
					{
						res.json({status:204,message:'No data provided',token:req.token});
					}
			})
}

var postProduksi = function(req,res){
		produksi = new Produksi(req.body);
		produksi.user_id=req.user_id;
	  	var time=moment();
	  	produksi.datePost = Date.parse(moment(time).tz('Asia/Jakarta')); 
		produksi.save(function(err)
		{
			if(!err)
			{
				res.json({status:200,success:true,message:'Input Success',data:produksi,token:req.token});
			}
			else
			{
				res.json({status:400,success:false,message:'Input Failed',token:req.token});
			}
		});
}

var updateProduksi = function(req,res){
	Produksi.findOne({produksi_id:req.body.produksi_id},function(err,produksi){
		if(produksi!='')
		{
			produksi.komoditas_id 	= req.body.komoditas_id;
			produksi.datePanen 		= req.body.datePanen;
			produksi.jumlah 		= req.body.jumlah;
			produksi.latitude		= req.body.latitude,
			produksi.longitude		= req.body.longitude,
			produksi.alamat			= req.body.alamat
			produksi.keterangan		= req.body.keterangan;
			if(req.body.latitude!='' || req.body.longitude!='' || req.body.alamat!='' )
			{
				Produksi.update({ produksi_id: req.body.produksi_id },
								{ $pullAll:posisi},{ safe: true },function(){
										produksi.posisi.push({
										latitude:req.body.latitude,
										longitude:req.body.longitude,
										alamat:req.body.alamat
									});
								});	
			}
			produksi.save(function(err){
				if(err)
				{
					res.json({status:400,message:'Update Failed',token:req.token});
				}
				else
				{
					res.json({status:200,message:'Update Success',data:produksi,token:req.token});	
				}
			});
		}
		else
		{	
			res.json({status:204,message:'Produksi not found',token:req.token});
		}
	})
}

var delProduksi = function(req,res){
	Produksi.findOne({produksi_id:req.body.produksi_id},function(err,produksi){
	//	res.json({aspirasi});
		if(produksi!='')
		{
			produksi.remove(function(err){
				if(!err){
					res.status(200).json({status:200,message:"delete success",token:req.token});
				}
				else{
					res.status(403).json({status:403,message:"Forbidden",token:req.token});
				}
			})
		}
		else
		{
			res.status(403).json({status:403,message:"Forbidden",token:req.token});
		}
	})
}

module.exports={
	delProduksi:delProduksi,
	getProduksi:getProduksi,
	getProduksiKu:getProduksiKu,
	updateProduksi:updateProduksi,
	postProduksi:postProduksi
};

	