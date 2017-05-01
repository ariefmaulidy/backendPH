var user				=			require('./../models/userModel');
var komoditas			=			require('./../models/komoditasModel');
var crypto 				= 			require('crypto');
var config				=			require('./../config');
var jwt 				=			require('jsonwebtoken');
var moment 				=			require('moment');
var tz 					= 			require('moment-timezone');
var each 				= 			require('foreach');

//tambah komoditas
var addKomoditas = function(req,res){
	var newKomoditas = new komoditas(req.body);
	//jika ada field kosong
	if(req.body.name=="" || req.body.satuan=="" || req.body.harga==""){
		res.json({status:204,message:"ada field kosong",data:"",token:""});
	}else{
		//role diambil dari express.js
		var role = req.role
		//cek role
		if(role==1 || role==2){
			newKomoditas.nama = req.body.nama;
			newKomoditas.satuan = req.body.satuan;
			newKomoditas.harga = req.body.harga;
			//create date dengan menggunakan fungsi Date();
			newKomoditas.datePost = Date.now();
			newKomoditas.last_update = Date.now();
			newKomoditas.save(function(err){
				if(err){
					console.log(err);
					res.json({status:204,message:"gagal tambah komoditas",data:"",token:""});
				}else{
					//kembalian dalam bentuk json
					res.json({
						status:200,
						message:"sukses tambah komoditas",
						data:newKomoditas,						
						token:req.token
						});
				}
			});
		}else{
			res.json({status:401,message:"role tidak sesuai",data:"",token:req.token});
		}
	}
};

//ambil semua komoditas apapun itu
var allKomoditas = function(req,res){
	komoditas.find({},'-_id -__v',{sort:{name:1}}).lean().exec(function(err,semuaKomoditas){
		if(err){
			res.json({status:402,message:"request time out",data:"",token:req.token});
		}else{
			each(semuaKomoditas,function(value,key,array){
				semuaKomoditas[key].datePost=moment(semuaKomoditas[key].datePost).format("DD MMMM YYYY hh:mm a");
				semuaKomoditas[key].last_update=moment(semuaKomoditas[key].last_update).format("DD MMMM YYYY hh:mm a");
			})
			setTimeout(function(){
				res.json({
					status:200,
					message:"sukses ambil semua komoditas",
					data:semuaKomoditas,						
					token:req.token
				});
			},100)			
		}
	})
};
		

//ambil satu komoditas saja
var oneKomoditas = function(req,res){
	komoditas.findOne({komoditas_id:req.params.komoditas_id},function(err,komoditi){
		if(err){
			res.json({status:402,message:"request time out",data:"",token:""});
		}else{
			//role dari express,js
			var role = req.role;
			//cek role
			if(role==1 || role==2){				
				res.json({
					status:200,
					message:"sukses ambil satu komoditas",
					data:komoditi,						
					token:req.token
					})
				}else{
					res.json({status:401,message:"role tidak sesuai",data:"",token:""});
				}
		}
			
	});
};

//update komoditas
var updateKomoditas = function(req,res){
	komoditas.findOne({komoditas_id:req.body.komoditas_id},function(err,komoditi){
		if(err){
			res.json({status:402,message:"request time out",data:"",token:""});
		}else{
			//ambil role dari express.js
			var role = req.role;
			if(role==1 || role==2){
				//isi dari body nya
				komoditi.name = req.body.name;
				komoditi.satuan = req.body.satuan;
				komoditi.harga = req.body.harga;
				komoditi.last_update = Date.now();
				komoditi.save(function(err){
					if(err){
						res.json({status:402,message:"gagal update komoditas",data:"",token:""});
					}else{
						res.json({
							status:200,
							message:"sukses update komoditas",
							data:komoditi,						
							token:req.token
						});
					}
				});
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:""});
			}		
		}
	});
}

//hapus komoditas
var deleteKomoditas = function(req,res){
	komoditas.findOne({komoditas_id:req.body.komoditas_id},function(err,komoditi){
		if(err){
			res.json({status:402,message:"err hapus data",data:"",token:""});
		}else{
			var role = req.role;
			if(role==1 || role==2){
				komoditi.remove(function(err){
					if(err){
						res.json({status:402,message:"err hapus data",data:"",token:""});
					}else{
						res.json({
							status:200,
							message:"sukses hapus komoditas",
							data:"",						
							token:req.token
						});
					}
				})
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:""});
			}		
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