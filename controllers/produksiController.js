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
							produksi[key].datePost=moment(produksi[key].datePost).format("DD MMMM YYYY hh:mm a");
							produksi[key].date_panen=moment(produksi[key].date_panen).format("DD MMMM YYYY");
							produksi[key].date_tanam=moment(produksi[key].date_tanam).format("DD MMMM YYYY");
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
	Produksi.find({user_id:req.params.user_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,produksi){
					if(produksi!='')
					{ 
						each(produksi,function(value,key,array)
						{
							
							User.findOne({user_id:produksi[key].user_id}).exec(function(err,user){
							produksi[key].name=user.name;
							produksi[key].picture=user.picture;
							produksi[key].time=fromNow(produksi[key].datePost);
							produksi[key].datePost=moment(produksi[key].datePost).format("DD MMMM YYYY hh:mm a");
							produksi[key].date_panen=moment(produksi[key].date_panen).format("DD MMMM YYYY");
							produksi[key].date_tanam=moment(produksi[key].date_tanam).format("DD MMMM YYYY");
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

var getOneProduksi = function(req,res){
	Produksi.findOne({produksi_id:req.params.produksi_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,produksi){
					if(produksi!=null)
					{ 
							User.findOne({user_id:produksi.user_id}).exec(function(err,user){
							produksi.name=user.name;
							produksi.picture=user.picture;
							produksi.time=fromNow(produksi.datePost);
							produksi.datePost=moment(produksi.datePost).format("DD MMMM YYYY hh:mm a");
							produksi.date_panen=moment(produksi.date_panen).format("DD MMMM YYYY");
							produksi.date_tanam=moment(produksi.date_tanam).format("DD MMMM YYYY");
							});

							Komoditas.findOne({komoditas_id:produksi.komoditas_id}).exec(function(err,komoditas)
							{
								produksi.nama_komoditas=komoditas.name;
								produksi.satuan_komoditas=komoditas.satuan;
				
							});
						
						setTimeout(function()
						{
							res.json({status:200,message:'Get data success',data:produksi,token:req.token});
						},50);
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
				res.json({status:400,success:false,message:'Input Failed',token:req.token,err:err});
			}
		});
}

var updateProduksi = function(req,res){
	Produksi.findOne({produksi_id:req.body.produksi_id},function(err,produksi){
		console.log(req.body);
		if(produksi!=null)
		{
			produksi.komoditas_id 	= req.body.komoditas_id;
			produksi.date_panen 	= req.body.date_panen;
			produksi.date_tanam 	= req.body.date_tanam;
			produksi.jumlah 		= req.body.jumlah;
			produksi.luas_lahan 	= req.body.luas_lahan;
			produksi.latitude		= req.body.latitude,
			produksi.longitude		= req.body.longitude,
			produksi.alamat			= req.body.alamat
			produksi.keterangan		= req.body.keterangan;
			produksi.save(function(err){
				if(err)
				{
					res.json({status:400,message:'Update Failed',token:req.token,err:err});
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
	});
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
	getOneProduksi:getOneProduksi,
	updateProduksi:updateProduksi,
	postProduksi:postProduksi
};

	