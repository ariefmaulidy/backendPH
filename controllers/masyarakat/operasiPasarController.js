//model atau collections laporanHargaModel
var operasiPasar		=			require('./../../models/operasiPasarModel');
//model komoditas
var komoditas			=			require('./../../models/komoditasModel');
//user
var user				=			require('./../../models/userModel');
//security, crypto, jwt, dan secretCodenya ada dalam config
var crypto 				= 			require('crypto');
var jwt 				=			require('jsonwebtoken');
var config				=			require('./../../config');
//time dan date format, fromNow,
var moment 				=			require('moment');
var tz 					= 			require('moment-timezone');
var now 				=			require("date-now");
var fromNow				= 			require('from-now');
var dateFormat	 		=		 	require('dateformat');
//each looping
var each 				= 			require('foreach');
//call fungsi matematika
var math 				= 			require('mathjs');
//get address dari latitude dan longitude google maps
var geocoder 			=			require('geocoder');

var addOperasiPasar =function(req,res){
	var newOperasi = new operasiPasar(req.body);
	var role = req.role;
	//cek role user
	if(role==1 || role==5){				
		//dapat alamatnya			
		geocoder.reverseGeocode(req.body.latitude,req.body.longitude,function(err,data){
			newOperasi.user_id = req.user_id;
			newOperasi.komoditas_id = req.komoditas_id;
			newOperasi.alamat = newLaporan.alamat = data.results[0].formatted_address;
			newOperasi.pesan = req.body.pesan;
			newOperasi.datePost = Date.now();
			newOperasi.save(function(err,komo){
				if(err){
					throw err;
				}else{
					res.status(200);
					res.json({
						data:newOperasi,
						message:"sukses tambah operasi"
					});
				}
			});
		});
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	}
}

var allOperasiPasar = function(req,res){
	operasiPasar.find({},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,operasi){
		if(operasi==null){
			res.json({status:201,message:"operasi pasar tidak ditemukan",data:"",token:""});
		}else{
			each(operasi,function(value,key,array){
				user.findOne({user_id:operasi[key].user_id}).exec(function(err,masyarakat){
					komoditas.findOne({komoditas_id:operasi[key].komoditas_id},function(err,komo){
						operasi[key].totalPendukung = masyarakat.pendukung.length;
						operasi[key].namaKomoditas = komo.name;
						operasi[key].name = masyarakat.name;
						operasi[key].time=fromNow(operasi[key].datePost);
					})
				});
			});
			setTimeout(function () {
					//kembalian dalam bentuk json
					res.json({
						status:200,
						message:"sukses mendapat operasi semua pasar",
						data:operasi,						
						token:req.token
					});
				}, 100);
		}	
	});
};

var operasiPasarKu = function(req,req){
	var role = req.role;
	//cek role user
	if(role==1 || role==5){
		operasiPasar.findOne({user_id:req.body.user_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,operasi){
			if(operasi==null){
				res.json({status:201,message:"operasi pasar tidak ditemukan",data:"",token:""});
			}else{
				each(operasi,function(value,key,array){
					user.findOne({user_id:operasi[key].user_id}).exec(function(err,masyarakat){
						komoditas.findOne({komoditas_id:operasi[key].komoditas_id},function(err,komo){
							operasi[key].totalPendukung = masyarakat.pendukung.length;
							operasi[key].namaKomoditas = komo.name;
							operasi[key].name = masyarakat.name;
							operasi[key].time=fromNow(operasi[key].datePost);
					})
				});
			});
			setTimeout(function () {
					//kembalian dalam bentuk json
					res.json({
						status:200,
						message:"sukses mendapat operasi semua pasar",
						data:operasi,						
						token:req.token
					});
				}, 100);
		}
		})
	}
};

var updateOperasiPasar = function(req,res){
	var role = req.role;
	//cek role user
	if(role==1 || role==5){
		operasiPasar.findOne({operasiPasar_id:req.body.operasiPasar_id},function(err,operasi){
			operasi.pesan=req.body.pesan;
			operasi.save(function(err){
				if(err){
					throw err;
				}else{
					res.json({
						status:200,
						message:"sukses update operasi semua pasar",
						data:operasi,						
						token:req.token
					});
				}
			});
		});
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	}
};

