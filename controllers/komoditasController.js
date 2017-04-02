var user				=			require('./../models/userModel');
var komoditas			=			require('./../models/komoditasModel');
var crypto 				= 			require('crypto');
var config				=			require('./../config');
var jwt 				=			require('jsonwebtoken');
var moment 				=			require('moment');
var tz 					= 			require('moment-timezone');
var each 				= 			require('foreach');


var addKomoditas = function(req,res){
	var newKomoditas = new komoditas(req.body);
	if(req.body.name=="" || req.body.satuan=="" || req.body.harga==""){
		res.json({status:204,message:"ada field kosong",data:"",token:""});
	}else if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function(err, decoded){
			var role = decoded.role;
			if(role==1 || role==2){
				var time=moment();
				newKomoditas.datePost = Date.parse(moment(time).tz('Asia/Jakarta'));
				var date_parser = Date.parse(moment(time).tz('Asia/Jakarta'));
				newKomoditas.last_update = new Date(date_parser);
				newKomoditas.save(function(err){
					if(err){
						console.log(err);
						res.json({status:204,message:"gagal tambah komoditas",data:"",token:""});
					}else{
						var role = req.body.role;
						var token = jwt.sign({
							komoditas_id:newKomoditas.user_id,
							name:newKomoditas.name,
							satuan:newKomoditas.satuan,
							harga:newKomoditas.harga,
							role:role
						},config.secretKey,{expiresIn:60*20});
						
						res.json({
							status:200,
							message:"sukses tambah komoditas",
							data:newKomoditas,						
							token:token
						});
					}
				});
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:""});
			}
		})
	}
};


var allKomoditas = function(req,res){
	komoditas.find(function(err,semuaKomoditas){
		if(err){
			res.json({status:402,message:"request time out",data:"",token:""});
		}else if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
			var token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, config.secret, function(err, decoded){
				var role = decoded.role;
				if(role==1 || role==2){
					var role = req.body.role;
					var sukses = "sukses ambil semua komoditas";
					var token = jwt.sign({
					status:sukses,
					role:role
					},config.secretKey,{expiresIn:60*20});
					
					res.json({
						status:200,
						message:"sukses ambil semua komoditas",
						data:semuaKomoditas,						
						token:token
					});
				}else{
					res.json({status:401,message:"role tidak sesuai",data:"",token:""});
				}
			});
		}
	});
};


var oneKomoditas = function(req,res){
	komoditas.findOne({komoditas_id:req.params.komoditas_id},function(err,komoditi){
		console.log(komoditi);
		if(err){
			res.json({status:402,message:"request time out",data:"",token:""});
		}else if(komoditi==null){
			res.json({status:204,message:"komoditas tidak ditemukan",data:"",token:""});
		}else if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
			var token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, config.secret, function(err, decoded){
				var role = decoded.role;
				if(role==1 || role==2){
					var role = req.body.role;
					var sukses = "sukses ambil satu komoditas";
					var token = jwt.sign({
					status:sukses,
					role:role
					},config.secretKey,{expiresIn:60*20});
					
					res.json({
						status:200,
						message:"sukses ambil satu komoditas",
						data:komoditi,						
						token:token
					})
				}else{
					res.json({status:401,message:"role tidak sesuai",data:"",token:""});
				}
			});
		}
	});
};


var updateKomoditas = function(req,res){
	komoditas.findOne({komoditas_id:req.body.komoditas_id},function(err,komoditi){
		if(err){
			res.json({status:402,message:"request time out",data:"",token:""});
		}else if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
			var token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, config.secret, function(err, decoded){
				var role = decoded.role;
				if(role==1 || role==2){
					var time=moment();
					var date_parser = Date.parse(moment(time).tz('Asia/Jakarta'));			
					komoditi.name = req.body.name;
					komoditi.satuan = req.body.satuan;
					komoditi.harga = req.body.harga;
					komoditi.last_update = new Date(date_parser);
					komoditi.save(function(err){
						if(err){
							res.json({status:402,message:"gagal update komoditas",data:"",token:""});
						}else{
							var role = req.body.role;
							var token = jwt.sign({
								komoditas_id:komoditi.user_id,
								name:komoditi.name,
								satuan:komoditi.satuan,
								harga:komoditi.harga,
								role:role
							},config.secretKey,{expiresIn:60*20});
							res.json({
								status:200,
								message:"sukses update komoditas",
								data:komoditi,						
								token:token
							});
						}
					});
				}else{
					res.json({status:401,message:"role tidak sesuai",data:"",token:""});
				}
			});
		}
	});
}

var deleteKomoditas = function(req,res){
	komoditas.findOne({komoditas_id:req.body.komoditas_id},function(err,komoditi){
		if(err){
			res.json({status:402,message:"err hapus data",data:"",token:""});
		}else if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
			var token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, config.secret, function(err, decoded){
				var role = decoded.role;
				if(role==1 || role==2){
					komoditi.remove(function(err){
						if(err){
							res.json({status:402,message:"err hapus data",data:"",token:""});
						}else{
							var role = req.body.role;
							var komoditas_id=komoditi.user_id;
							var name=komoditi.name;
							var	satuan=komoditi.satuan;
							var	harga=komoditi.harga;
							var token = jwt.sign({
								komoditas_id:komoditas_id,
								name:name,
								satuan:satuan,
								harga:harga,
								role:role
							},config.secretKey,{expiresIn:60*20});
							
							res.json({
								status:200,
								message:"sukses hapus komoditas",
								data:"",						
								token:token
							});
						}
					})
				}else{
					res.json({status:401,message:"role tidak sesuai",data:"",token:""});
				}
			});
		}
	})
}


module.exports = {
	addKomoditas:addKomoditas,
	allKomoditas:allKomoditas,
	oneKomoditas:oneKomoditas,
	updateKomoditas:updateKomoditas,
	deleteKomoditas:deleteKomoditas
}