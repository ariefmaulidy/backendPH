var laporanHarga		=			require('./../../models/laporanHargaModel');
var crypto 				= 			require('crypto');
var config				=			require('./../../config');
var jwt 				=			require('jsonwebtoken');
var moment 				=			require('moment');
var tz 					= 			require('moment-timezone');
var each 				= 			require('foreach');
var math 				= 			require('mathjs');
var now 				=			require("date-now");
var fromNow				= 			require('from-now');
var dateFormat	 		=		 	require('dateformat');

var addLaporan = function(req,res){
	var newLaporan = new laporanHarga(req.body);
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function(err, decoded){
			var role = decoded.role;
			if(role==1 || role==2 || role==5){
				newLaporan.komoditas_id = req.body.komoditas_id;
				newLaporan.user_id = req.body.user_id;
				newLaporan.harga = req.body.harga;
				//create date
				newLaporan.datePost = Date.now();
				//newLaporan.datePost = 1444140297141;
				console.log(newLaporan.datePost);
				//newLaporan.lokasi.push({
				newLaporan.latitude=req.body.latitude,
				newLaporan.longitude=req.body.longitude,
				newLaporan.alamat=req.body.alamat
				//});
				newLaporan.save(function(err){
					if(err){
						res.json({status:402,message:err,data:"",token:""});
					}else{
						var role = req.body.role;
						var token = jwt.sign({
							laporanHarga_id:newLaporan.laporanHarga_id,
							komoditas_id:newLaporan.komoditas_id,
							user_id:newLaporan.user_id,
							role:role,
						},config.secretKey,{expiresIn:60*20});
						
						res.json({
							status:200,
							message:"sukses tambah laporan harga",
							data:newLaporan,						
							token:token
						});
					}
				})
				
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:""});
			}
		});
	}
};


var allLaporan = function(req,res){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function(err, decoded){
			var role = decoded.role;
			if(role==1 || role==2 || role==5){
				laporanHarga.find(function(err,semuaLaporan){
					var role = req.body.role;
					var sukses = "sukses ambil semua laporan harga";
					var token = jwt.sign({
					status:sukses,
					role:role
					},config.secretKey,{expiresIn:60*20});
					
					res.json({
						status:200,
						message:"sukses ambil semua laporan harga",
						data:semuaLaporan,						
						token:token
					});
				})
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:""});
			}
		});
	}else{
		res.json({status:401,message:"token tidak sesuai",data:"",token:""});
	}
};


var oneLaporan = function(req,res){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function(err, decoded){
			var role = decoded.role;
			if(role==1 || role==2 || role==5){
				laporanHarga.findOne({laporanHarga_id:req.params.laporanHarga_id},function(err,satulaporan){
					if(satulaporan==null){
						res.json({status:201,message:"laporan tidak ditemukan",data:"",token:""});
					}else{
						var role = req.body.role;
						var sukses = "sukses ambil semua laporan harga";
						var token = jwt.sign({
							status:sukses,
							laporanHarga_id:satulaporan.laporanHarga_id,
							komoditas_id:satulaporan.komoditas_id,
							role:role
							},config.secretKey,{expiresIn:60*20});
						
						res.json({
							status:200,
							message:"sukses ambil satu laporan harga",
							data:satulaporan,						
							token:token
						});
					}
				})
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:""});
			}
		})
	}
};


var updateLaporan = function(req,res){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function(err, decoded){
			var role = decoded.role;
			if(role==1 || role==2 || role==5){
				laporanHarga.findOne({laporanHarga_id:req.body.laporanHarga_id},function(err,ubahLaporan){
					if(ubahLaporan==null){
						res.json({status:201,message:"laporan tidak ditemukan",data:"",token:""});
					}else{
						ubahLaporan.user_id = req.body.user_id;
						ubahLaporan.harga = req.body.harga;
						//create date
						var tanggal = Date.now();
						ubahLaporan.datePost = req.body.tanggal;
						//ubahLaporan.lokasi.push({
						ubahLaporan.latitude=req.body.latitude,
						ubahLaporan.longitude=req.body.longitude,
						ubahLaporan.alamat=req.body.alamat
						//});
						ubahLaporan.save(function(err){
							if(err){
								res.json({status:402,message:err,data:"",token:""});
							}else{
								var role = req.body.role;
								var token = jwt.sign({
								laporanHarga_id:ubahLaporan.laporanHarga_id,
								komoditas_id:ubahLaporan.komoditas_id,
								user_id:ubahLaporan.user_id,
								role:role,
								},config.secretKey,{expiresIn:60*20});
								
								res.json({
									status:200,
									message:"sukses ubah satu laporan harga",
									data:ubahLaporan,						
									token:token
								});
							}
						})
					}
				})
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:""});
			}
		});
	}
}


var deleteLaporan = function(req,res){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function(err, decoded){
			var role = decoded.role;
			if(role==1 || role==2 || role==5){
				laporanHarga.findOne({laporanHarga_id:req.body.laporanHarga_id},function(err,hapuslaporan){
					if(hapuslaporan==null){
						res.json({status:201,message:"laporan tidak ditemukan",data:"",token:""});
					}else{
						hapuslaporan.remove(function(err){
							if(err){
								res.json({status:402,message:err,data:"",token:""});
							}else{
								var role = req.body.role;
								var sukses = "sukses hapus satu laporan harga";
								var token = jwt.sign({
									status:sukses,
									laporanHarga_id:hapuslaporan.laporanHarga_id,
									role:role
									},config.secretKey,{expiresIn:60*20});						
								
								res.json({	
									status:200,
									message:"sukses hapus satu laporan harga",
									data:hapuslaporan,						
									token:token
								});
							}
						})
					}
				})
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:""});
			}
		});
	}
}


var todayLaporan = function(req,res){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function(err, decoded){
			var role = decoded.role;
			if(role==1 || role==2 || role==5){
				var date1 = Date.now();
				var date2 = dateFormat(date1, "dddd , mmmm dS , yyyy");
				console.log('ini date2 '+ date2);
				var parsing = [];
				laporanHarga.find({},'-_id -__v',{sort:{datePost:1}},function(err,all){
					if(err){
						res.json({status:402,message:err,data:"",token:""});
					}else{
						for(var i=0; i<all.length; i++){
							if(dateFormat(all[i].datePost, "dddd , mmmm dS , yyyy")==date2){
								parsing.push(all[i].laporanHarga_id);
							}
						}
						//sdfsf
						var role = req.body.role;
						var sukses = "sukses laporan hari ini";
						var token = jwt.sign({
							status:sukses,
							role:role,
							},config.secretKey,{expiresIn:60*20});
						
						res.json({
							status:200,
							message:"sukses, kembalian array laporanHarga_id",
							data:parsing,						
							token:token
						});
					}
				})
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:""});
			}
		})
	}
};

module.exports = {
	add:addLaporan,
	all:allLaporan,
	one:oneLaporan,
	update:updateLaporan,
	delete:deleteLaporan,
	today:todayLaporan
}