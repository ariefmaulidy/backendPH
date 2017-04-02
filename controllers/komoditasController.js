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
	}else{
		var time=moment();
		newKomoditas.datePost = Date.parse(moment(time).tz('Asia/Jakarta'));
		var date_parser = Date.parse(moment(time).tz('Asia/Jakarta'));
		newKomoditas.last_update = new Date(date_parser);
		newKomoditas.save(function(err){
			if(err){
				console.log(err);
				res.json({status:204,message:"gagal tambah komoditas",data:"",token:""});
			}else{
				var role = [];
				role.push(3);
				role.push(2);
				var token = jwt.sign({
					komoditas_id:newKomoditas.user_id,
					name:newKomoditas.name,
					satuan:newKomoditas.satuan,
					harga:newKomoditas.harga,
					role:role
					},config.secretKey,{expiresIn:60*20});
					console.log(role.length);
				jwt.verify(token,config.secretKey,function(err,decode){
					var lol = decode.role;
					for(var i=0; i<lol.length;i++){
						if(lol[i]==1 || lol[i]==2){
							console.log(lol[i]);
						}else{
							console.log("not found");
						}
					}
				})
					res.json({
						status:200,
						message:"sukses tambah komoditas",
						data:newKomoditas,						
						token:token
					})
			}
		});
	}
};


var allKomoditas = function(req,res){
	komoditas.find(function(err,semuaKomoditas){
		if(err){
			res.json({status:402,message:"request time out",data:"",token:""});
		}else{
			var sukses = "sukses ambil semua komoditas";
			var token = jwt.sign({
				status:sukses
				},config.secretKey,{expiresIn:60*20});
					
				res.json({
					status:200,
					message:"sukses ambil semua komoditas",
					data:semuaKomoditas,						
					token:token
				})
		}
	});
};


var updateKomoditas = function(req,res){
	komoditas.findOne({komoditas_id:req.body.komoditas_id},function(err,komoditi){
		if(err){
			res.json({status:402,message:"request time out",data:"",token:""});
		}else{
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
					var token = jwt.sign({
					komoditas_id:newKomoditas.user_id,
					name:newKomoditas.name,
					satuan:newKomoditas.satuan,
					harga:newKomoditas.harga,
					},config.secretKey,{expiresIn:60*20});
					
					res.json({
						status:200,
						message:"sukses tambah komoditas",
						data:newKomoditas,						
						token:token
					});
				}
			});
		}
	});
}

var deleteKomoditas = function(req,res){
	komoditas.findOne({komoditas_id:req.body.komoditas_id},function(err,komoditi){
		if(err){
			res.json({status:402,message:"request time out",data:"",token:""});
		}else{
			var komoditas_id=komoditi.user_id;
			var name=komoditi.name;
			var	satuan=komoditi.satuan;
			var	harga=komoditi.harga;
			var token = jwt.sign({
					komoditas_id:komoditas_id,
					name:name,
					satuan:satuan,
					harga:harga,
					},config.secretKey,{expiresIn:60*20});
					
					res.json({
						status:200,
						message:"sukses tambah komoditas",
						data:newKomoditas,						
						token:token
					});
	
		}
	})
}


module.exports = {
	addKomoditas:addKomoditas,
	allKomoditas:allKomoditas,
	updateKomoditas:updateKomoditas,
	deleteKomoditas:deleteKomoditas
}