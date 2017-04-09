//setKomoditas model
var setKomoditas 	= 	require('./../../models/pemerintah/setKomoditasModel');
var crypto 			= 	require('crypto');
var config			=	require('./../../config');
var jwt 			=	require('jsonwebtoken');
var moment			=	require('moment');
var tz				=	require('moment-timezone');
var each 			= 	require('foreach');
var math 			=	require('mathjs'); //untuk math

//tambah komoditas
var tambahKomoditas = function(req,res){
	var komoditasBaru = new setKomoditas(req.body);
	komoditasBaru.save(function(err){
		if(err){
			throw err;
		}else{
			res.json({
				data:komoditasBaru,
				message:"succes"
			})
		}
	});	
};

//semua komoditas yang sudah diinput oleh pemerintah
var semuaKomoditas = function(req,res){
	setKomoditas.find({},'-_id -__v',{sort:{namaKomoditas:1}},function(err,hasil){
		if(err){
			throw err;
		}else{
			res.json({
				data:hasil,
				message:"succes"
			})
		}
	});
};

//hapus komoditas
var deleteKomoditas = function(req,res){
	setKomoditas.findOne({setKom_id:req.params.setKom_id},function(err,komoditas){
		komoditas.remove(function(err){
			if(err){
				throw err;
				res.json({"status":"404","message":"failed delete data"});
			}else{
				res.json({
					message:"succes delete data"
				})
			}
		});
	});
};

//menghapus komoditasnya saja
var jenisKomoditas = function(req,res){
	setKomoditas.find({},'-_id -__v',{sort:{namaKomoditas:1}},function(err,komoditas){
		//inisialisasi variable untuk parsing dan jenis dalam bentuk array
		var parsing="";
		var jenis=[];
		var counter=0;
		//loping untuk mendapatkan komoditas
		if(counter<komoditas.length){
			for(var i=0;i<komoditas.length;i++){
				if(parsing==komoditas[i].namaKomoditas){
					parsing=komoditas[i].namaKomoditas;
				}else{
					parsing=komoditas[i].namaKomoditas;
					jenis.push(komoditas[i].namaKomoditas);
				}
				counter++;
				if(counter==komoditas.length){
					res.json({data:jenis});
				}
			};
		}
	});
};

module.exports = {
	tambahKomoditas:tambahKomoditas,
	semuaKomoditas:semuaKomoditas,
	deleteKomoditas:deleteKomoditas,
	jenisKomoditas:jenisKomoditas
}