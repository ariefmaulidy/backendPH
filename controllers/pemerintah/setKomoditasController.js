var setKomoditas 	= 	require('./../../models/pemerintah/setKomoditasModel');
var crypto 			= 	require('crypto');
var config			=	require('./../../config');
var jwt 			=	require('jsonwebtoken');
var moment			=	require('moment');
var tz				=	require('moment-timezone');
var each 			= 	require('foreach');
var math 			=	require('mathjs'); //untuk math

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

var deleteKomoditas = function(req,res){
	setKomoditas.findOne({setKom_id:req.params.setKom_id},function(err,komoditas){
		console.log(req.params.setKom_id);
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

var jenisKomoditas = function(req,res){
	setKomoditas.find({},'-_id -__v',{sort:{namaKomoditas:1}},function(err,komoditas){
		console.log(komoditas.length);
		var parsing="";
		var jenis=[];
		var counter=0;
		if(counter<komoditas.length){
			for(var i=0;i<komoditas.length;i++){
				//console.log(all[i].jenis)
				if(parsing==komoditas[i].namaKomoditas){
					parsing=komoditas[i].namaKomoditas;
					//console.log("ini yang di if"+all[i].jenis);
				}else{
					parsing=komoditas[i].namaKomoditas;
					jenis.push(komoditas[i].namaKomoditas);
				}
				counter++;
				if(counter==komoditas.length){
					res.json({data:jenis});
					/*console.log("sudah 9"+jenis);*/
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