//model atau collections laporanHargaModel
var laporanHarga		=			require('./../../models/masyarakat/laporanHargaModel');
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



var check = function(role) {		
	if(role==1 || role==2 || role==5) return true;
	else return false;
}


//add laporanHarga
var addLaporan = function(req,res){
	//cek role user		
	//if(req.role==1 || req.role==2 || req.role==5){				
		var newLaporan = new laporanHarga(req.body);
			newLaporan.komoditas_id = req.body.komoditas_id;
			newLaporan.user_id = req.user_id;
			newLaporan.harga = req.body.harga;
			newLaporan.alamat =  req.body.alamat;
			newLaporan.latitude= req.body.latitude;
			newLaporan.longitude = req.body.longitude;
			//create date add laporanHarga
			newLaporan.datePost = Date.now();
			newLaporan.save(function(err){
				if(err){
					res.json({status:402,message:err,data:"",token:req.token});
				}else{
					//kembalian dalam bentuk json
					res.json({
						status:200,
						message:"sukses tambah laporan harga",
						data:newLaporan,						
						token:req.token
					});
				}
			})
	// }else{
	// 	res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	// }
}


//ambil semualaporan, apapun komoditasnya dan kapanpun postnya
var allLaporan = function(req,res){
	//ambil semua laporan
	laporanHarga.find({},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,semuaLaporan){
		//ambil satuan_komoditas
		if(semuaLaporan==null) {
			res.json({status:204,message:"laporan tidak ditemukan",data:"",token:req.token});
		} else {
			each(semuaLaporan,function(value,key,array){	
				komoditas.findOne({komoditas_id:semuaLaporan[key].komoditas_id},function(err,komo){
					semuaLaporan[key].namaKomoditas = komo.name;
					semuaLaporan[key].satuan = komo.satuan;
				})
				user.findOne({user_id:semuaLaporan[key].user_id},function(err,masyarakat){
					//console.log(masyarakat.name);
					if(masyarakat!=null) {
						semuaLaporan[key].nama = masyarakat.name;
					} else {
						semuaLaporan[key].nama = "undefined";
					}
				})
				semuaLaporan[key].datePost = moment(semuaLaporan[key].datePost).format("YYYY-MM-DD");
			});
			setTimeout(function () {
				//kembalian dalam bentuk json
				//console.log(semuaLaporan);
				res.json({
					status:200,
					message:"sukses ambil semua laporan harga",
					data:semuaLaporan,						
					token:req.token
				});
			}, 300);	
		}
	});
};

//ambil satu laporan saja sesuai dengan laporanHarga_id nya
var oneLaporan = function(req,res){
	//ambil satu laporanHarga yang sesuai dengan laporanHarga_id nya
	laporanHarga.findOne({laporanHarga_id:req.params.laporanHarga_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,satulaporan){
		//jika tidak ditemukan
		if(satulaporan==null){
			res.json({status:204,message:"laporan tidak ditemukan",data:"",token:req.token});
		}else{
			komoditas.findOne({komoditas_id:satulaporan.komoditas_id},function(err,komo){
				satulaporan.namaKomoditas = komo.name;
				satulaporan.satuan = komo.satuan;		
			})
			user.findOne({user_id:satulaporan.user_id},function(err,masyarakat){
				if(masyarakat!=null) {
					satulaporan.nama = masyarakat.name;
				} else {
					satulaporan.nama = "undefined";
				}
				satulaporan.nama = masyarakat.name;
			})		
			satulaporan.datePost = moment(satulaporan.datePost).format("YYYY-MM-DD");
			setTimeout(function () {
				//kembalian dalam bentuk json
				res.json({
					status:200,
					message:"sukses ambil satu laporan harga",
					data:satulaporan,						
					token:req.token
				});
			}, 20);		
		}
	});	
};


//histori laporan ku
var laporanHargaKu = function(req,res){
	// if(req.role==1 || req.role==2 || req.role==5){
		laporanHarga.find({user_id:req.params.user_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,laporanku){
			if(laporanku==null){
				res.json({status:204,message:"laporan tidak ditemukan",data:"",token:req.token});
			}else{
				each(laporanku,function(value,key,array){	
					komoditas.findOne({komoditas_id:laporanku[key].komoditas_id},function(err,komo){			
						laporanku[key].namaKomoditas = komo.name;
						laporanku[key].satuan = komo.satuan;
						laporanku[key].datePost = moment(laporanku[key].datePost).format("YYYY-MM-DD");
					})
				});	
				setTimeout(function () {
					//kembalian dalam bentuk json
					res.json({
						status:200,
						message:"sukses ambil semua laporan satu user",
						data:laporanku,						
						token:req.token
					});
				}, 100);		
			}
		});
	// }else{
	// 	res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	// }
};

//update laporanHarga yang sesuai dengan laporanHarga_id nya
var updateLaporan = function(req,res){
	// if(req.role==1 || req.role==2 || req.role==5){
		//ambil laporanHarga yang akan diubah
		laporanHarga.findOne({laporanHarga_id:req.body.laporanHarga_id},function(err,ubahLaporan){
			//jika laporanHarga tidak ditemukan
			if(ubahLaporan==null){
				res.json({status:204,message:"laporan tidak ditemukan",data:"",token:req.token});
			}else{
				ubahLaporan.user_id = req.user_id;
				ubahLaporan.harga = req.body.harga;
				//simpan perubahan yang dilakukan
				ubahLaporan.save(function(err){
					if(err){
						res.json({status:402,message:err,data:"",token:req.token});
					}else{
						//kembalian dalam bentuk json
						res.json({
							status:200,
							message:"sukses ubah satu laporan harga",
							data:ubahLaporan,						
							token:req.token
						});
					}
				})
			}
		})
	// }else{
	// 	res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	// }	
}

//delete laporanHarga sesuai dengan laporanHarga_id nya
var deleteLaporan = function(req,res){
	//cek role user
	// if(req.role==1 || req.role==2 || req.role==5){
		//cari laporan harga yang akan dihapus sesuai dengan laporanHarga_id nya
		laporanHarga.findOne({laporanHarga_id:req.body.laporanHarga_id},function(err,hapuslaporan){
			//jika laporanHarga tidak ditemukan
			if(hapuslaporan==null){
				res.json({status:204,message:"laporan tidak ditemukan",data:"",token:req.token});
			}else{
				//hapus laporanHarga
				hapuslaporan.remove(function(err){
					if(err){
						res.json({status:402,message:err,data:"",token:""});
					}else{
						//kembalian dalam bentuk json
						res.json({	
							status:200,
							message:"sukses hapus satu laporan harga",
							data:hapuslaporan,						
							token:req.token
						});
					}
				})
			}
		})
	// }else{
	// 	res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	// }	
}

//mengambil laoranHarga beberapa hari yang lalu, komoditasnya apa aja selama hari itu
var dayLaporan = function(req,res){
	//ambil semua laporanHarga di sorting sesuai dengan tanggal post
	laporanHarga.find({},'-_id -__v',{sort:{datePost:-1}},function(err,all){
		if(all==null){
			res.json({status:204,message:err,data:"",token:req.token});
		}else{
			//tanggal sekarang
			var dateNow = new Date();				
			//tanggal sekarang di kurangi hari yang diinginkan, hari nya
			dateNow.setDate(dateNow.getDate() - req.params.day);
			//hari yang diinginkan dalam format, hari, tanggal, bulan, dan tahun
			var getDate = dateFormat(dateNow, "dddd , mmmm dS , yyyy");						
			//console.log(getDate);
			//buat variabel parsing yang akan menerima laporanHarga_id pada hari itu
			var parsing = [];
			var number = [];
			var counter = 0;
				
			for(var i=0;i<all.length;i++){
				if(dateFormat(all[i].datePost, "dddd , mmmm dS , yyyy")==getDate){
					number.push(all[i].laporanHarga_id);					
				};
			}
			//time out 300 miliseconds
			setTimeout(function () {
				for(var i=0;i<number.length;i++){
					laporanHarga.findOne({laporanHarga_id:number[i]},'-_id -__v').lean().exec(function(err,laporan){
						komoditas.findOne({komoditas_id:laporan.komoditas_id}).exec(function(err,komo){
							user.findOne({user_id:laporan.user_id},function(err,masyarakat){
								laporan.namaKomoditas=komo.name;
								laporan.satuan = komo.satuan;
								laporan.nama = masyarakat.name;
								laporan.datePost = moment(laporan.datePost).format("YYYY-MM-DD");;
								parsing.push(laporan);
							})
						})						
					})					
				}
			}, 300);
			//time out 400 mili seconds
			setTimeout(function () {
				res.json({	
					status:200,
					message:"sukses mendapat laporan harga " + req.params.day + ' hari sebelumnya',
					data:parsing,						
					token:req.token
				});
			}, 400);
		}
	})
}

//month
var monthLaporan = function(req,res){
	//ambil semua laporanHarga di sorting sesuai dengan tanggal post
	laporanHarga.find({},'-_id -__v',{sort:{datePost:-1}},function(err,all){
		if(all==null){
			res.json({status:204,message:err,data:"",token:req.token});
		}else{
			//tanggal sekarang
			var dateNow = new Date();
			//bulan
			var monthDate = dateFormat(dateNow, "mmmm, yyyy");						
			//console.log(getDate);
			//buat variabel parsing yang akan menerima laporanHarga_id pada hari itu
			var parsing = [];
			var number = [];
			var counter = 0;
				
			for(var i=0;i<all.length;i++){
				if(dateFormat(all[i].datePost, "mmmm, yyyy")==monthDate){
					number.push(all[i].laporanHarga_id);					
				};
			}
			//time out 300 miliseconds
			setTimeout(function () {
				for(var i=0;i<number.length;i++){
					laporanHarga.findOne({laporanHarga_id:number[i]},'-_id -__v').lean().exec(function(err,laporan){
						komoditas.findOne({komoditas_id:laporan.komoditas_id}).exec(function(err,komo){
							user.findOne({user_id:laporan.user_id},function(err,masyarakat){
								laporan.namaKomoditas=komo.name;
								laporan.satuan = komo.satuan;
								laporan.nama = masyarakat.name;
								laporan.datePost = moment(laporan.datePost).format("YYYY-MM-DD");;
								parsing.push(laporan);
							})
						})						
					})					
				}
			}, 300);
			//time out 400 mili seconds
			setTimeout(function () {
				res.json({	
					status:200,
					message:"sukses mendapat laporan harga " + monthDate +"",
					data:parsing,						
					token:req.token
				});
			}, 400);
		}
	})
}

var weekLaporan = function(req,res){
	//ambil semua laporanHarga di sorting sesuai dengan tanggal post
	laporanHarga.find({},'-_id -__v',{sort:{datePost:-1}},function(err,all){
		if(all==null){
			res.json({status:204,message:err,data:"",token:req.token});
		}else{
			//tanggal sekarang
			var dateNow = new Date();
			//bulan
			var weekDate = dateFormat(dateNow, "W");						
			//console.log(getDate);
			//buat variabel parsing yang akan menerima laporanHarga_id pada hari itu
			var parsing = [];
			var number = [];
			var counter = 0;
				
			for(var i=0;i<all.length;i++){
				if(dateFormat(all[i].datePost, "W")==weekDate){
					number.push(all[i].laporanHarga_id);					
				};
			}
			//time out 300 miliseconds
			setTimeout(function () {
				for(var i=0;i<number.length;i++){
					laporanHarga.findOne({laporanHarga_id:number[i]},'-_id -__v').lean().exec(function(err,laporan){
						komoditas.findOne({komoditas_id:laporan.komoditas_id}).exec(function(err,komo){
							user.findOne({user_id:laporan.user_id},function(err,masyarakat){
								laporan.namaKomoditas=komo.name;
								laporan.satuan = komo.satuan;
								laporan.nama = masyarakat.name;
								laporan.datePost = moment(laporan.datePost).format("YYYY-MM-DD");;
								parsing.push(laporan);
							})
						})						
					})					
				}
			}, 300);
			//time out 400 mili seconds
			setTimeout(function () {
				res.json({	
					status:200,
					message:"sukses mendapat laporan harga pada minggu ke " + weekDate +"",
					data:parsing,						
					token:req.token
				});
			}, 400);
		}
	})
}


module.exports = {
	add:addLaporan,
	all:allLaporan,
	oneLaporan:oneLaporan,
	update:updateLaporan,
	delete:deleteLaporan,
	getDay:dayLaporan,
	laporanku:laporanHargaKu,
	getMonth:monthLaporan,
	getWeek:weekLaporan

}
