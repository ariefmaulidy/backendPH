//model atau collections laporanHargaModel
var laporanHarga		=			require('./../../models/laporanHargaModel');
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

//add laporanHarga
var addLaporan = function(req,res){
	var newLaporan = new laporanHarga(req.body);
	//misahin text "Bearer" dengan token
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		//verifikasi token jwt lalu didecode
		jwt.verify(token, config.secret, function(err, decode){
			var role = decode.role;
			//cek role user
			if(role==1 || role==2 || role==5){
				
				
				//address
				geocoder.reverseGeocode(req.body.latitude,req.body.longitude, function ( err, data ) {
					//dapat alamatnya
					newLaporan.komoditas_id = req.body.komoditas_id;
					newLaporan.user_id = req.body.user_id;
					newLaporan.harga = req.body.harga;
					//create date add laporanHarga
					newLaporan.datePost = Date.now();
					newLaporan.alamat = data.results[0].formatted_address;
					
					newLaporan.save(function(err){
						if(err){
							res.json({status:402,message:err,data:"",token:""});
						}else{
							//create token dan apa saja yang dimasukan ke dalam token
							var token = jwt.sign({
								laporanHarga_id:newLaporan.laporanHarga_id,
								komoditas_id:newLaporan.komoditas_id,
								user_id:newLaporan.user_id,
								role:role,
								login_type:1
							},config.secretKey,{expiresIn:60*20});
							//kembalian dalam bentuk json
							res.json({
								status:200,
								message:"sukses tambah laporan harga",
								data:newLaporan,						
								token:token
							});
						}
					})
				}, { sensor: true });
				/*newLaporan.latitude=req.body.latitude,
				newLaporan.longitude=req.body.longitude,*/
				//newLaporan.alamat=wwe;				
				
				//save laporan yang masuk
				
				//jika role tidak sesuai
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:""});
			}
		});
	}
};

//ambil semualaporan, apapun komoditasnya dan kapanpun postnya
var allLaporan = function(req,res){
	//misahin text "Bearer" dengan token
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		var gg = req.headers.authorization;
		console.log(gg);
		//verifikasi jwt
		jwt.verify(token, config.secret, function(err, decode){
			var role = decode.role;
			//cek role user
			if(role==1 || role==2 || role==5){
				//ambil semua laporan
				laporanHarga.find(function(err,semuaLaporan){
					var role = decode.role;
					var sukses = "sukses ambil semua laporan harga";
					//create token dan apa saja yang dimasukan ke dalam token
					var token = jwt.sign({
						status:sukses,
						role:role,
						login_type:1
					},config.secretKey,{expiresIn:60*20});
					//kembalian dalam bentuk json
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
	}
};

//ambil satu laporan saja sesuai dengan laporanHarga_id nya
var oneLaporan = function(req,res){
	//misahin text "Bearer" dengan token
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		//verifikasi jwt
		jwt.verify(token, config.secret, function(err, decode){
			var role = decode.role;
			//cek role user
			if(role==1 || role==2 || role==5){
				//ambil satu laporanHarga yang sesuai dengan laporanHarga_id nya
				laporanHarga.findOne({laporanHarga_id:req.params.laporanHarga_id},function(err,satulaporan){
					//jika tidak ditemukan
					if(satulaporan==null){
						res.json({status:201,message:"laporan tidak ditemukan",data:"",token:""});
					}else{
						var sukses = "sukses ambil semua laporan harga";
						//create token dan apa saja yang dimasukan ke dalam token
						var token = jwt.sign({
							status:sukses,
							laporanHarga_id:satulaporan.laporanHarga_id,
							komoditas_id:satulaporan.komoditas_id,
							role:role,
							login_type:1
							},config.secretKey,{expiresIn:60*20});
						//kembalian dalam bentuk json
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

//update laporanHarga yang sesuai dengan laporanHarga_id nya
var updateLaporan = function(req,res){
	//misahin text "Bearer" dengan token
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		//verifikasi jwt
		jwt.verify(token, config.secret, function(err, decode){
			var role = decode.role;
			//cek role user
			if(role==1 || role==2 || role==5){
				//ambil laporanHarga yang akan diubah
				laporanHarga.findOne({laporanHarga_id:req.body.laporanHarga_id},function(err,ubahLaporan){
					//jika laporanHarga tidak ditemukan
					if(ubahLaporan==null){
						res.json({status:201,message:"laporan tidak ditemukan",data:"",token:""});
					}else{
						ubahLaporan.user_id = req.body.user_id;
						ubahLaporan.harga = req.body.harga;
						ubahLaporan.datePost = Date.now();						
						ubahLaporan.latitude=req.body.latitude,
						ubahLaporan.longitude=req.body.longitude,
						ubahLaporan.alamat=req.body.alamat
						//simpan perubahan yang dilakukan
						ubahLaporan.save(function(err){
							if(err){
								res.json({status:402,message:err,data:"",token:""});
							}else{
								//create token dan apa saja yang dimasukan ke dalam token
								var token = jwt.sign({
									laporanHarga_id:ubahLaporan.laporanHarga_id,
									komoditas_id:ubahLaporan.komoditas_id,
									user_id:ubahLaporan.user_id,
									role:role,
									login_type:1
								},config.secretKey,{expiresIn:60*20});
								//kembalian dalam bentuk json
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

//delete laporanHarga sesuai dengan laporanHarga_id nya
var deleteLaporan = function(req,res){
	//misahin text "Bearer" dan token
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		//verifikasi token
		jwt.verify(token, config.secret, function(err, decode){
			var role = decode.role;
			//cek role user
			if(role==1 || role==2 || role==5){
				//cari laporan harga yang akan dihapus sesuai dengan laporanHarga_id nya
				laporanHarga.findOne({laporanHarga_id:req.body.laporanHarga_id},function(err,hapuslaporan){
					//jika laporanHarga tidak ditemukan
					if(hapuslaporan==null){
						res.json({status:201,message:"laporan tidak ditemukan",data:"",token:""});
					}else{
						//hapus laporanHarga
						hapuslaporan.remove(function(err){
							if(err){
								res.json({status:402,message:err,data:"",token:""});
							}else{
								//create token dan apa saja yang dimasukan ke dalam token
								var sukses = "sukses hapus satu laporan harga";
								var token = jwt.sign({
									status:sukses,
									laporanHarga_id:hapuslaporan.laporanHarga_id,
									role:role,
									login_type:1
									},config.secretKey,{expiresIn:60*20});						
								//kembalian dalam bentuk json
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

//mengambil laoranHarga beberapa hari yang lalu, komoditasnya apa aja selama hari itu
var dayLaporan = function(req,res){
	//misahin text "Bearer" dan tokennya
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		//validasi token
		jwt.verify(token, config.secret, function(err, decode){
			var role = decode.role;
			//cek role user
			if(role==1 || role==2 || role==5){
				//buat variabel parsing yang akan menerima laporanHarga_id pada hari itu
				var parsing = [];
				//ambil semua laporanHarga di sorting sesuai dengan tanggal post
				laporanHarga.find({},'-_id -__v',{sort:{datePost:-1}},function(err,all){
					if(err){
						res.json({status:402,message:err,data:"",token:""});
					}else{
						//tanggal sekarang
						var dateNow = new Date();
						//tanggal sekarang di kurangi hari yang diinginkan, hari nya
						dateNow.setDate(dateNow.getDate() - req.params.day);
						//hari yang diinginkan dalam format, hari, tanggal, bulan, dan tahun
						var getDate = dateFormat(dateNow, "dddd , mmmm dS , yyyy");						
						//cek dalam database yang sesuai dengan hari yang diinginkan
						for(var i=0; i<all.length; i++){
							if(dateFormat(all[i].datePost, "dddd , mmmm dS , yyyy")==getDate){
								//jika sesuai masukkan dalam variabel parsing
								parsing.push(all[i].laporanHarga_id);
							}
						}						
						//create token dan apa saja yang dimasukan ke dalam token
						var sukses = "sukses laporan";
						var token = jwt.sign({
							status:sukses,
							role:role,
							login_type:1
							},config.secretKey,{expiresIn:60*20});
						//kembalian dalam bentuk json dan isinya
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
	getDay:dayLaporan
}