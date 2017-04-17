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
		//geocoder.reverseGeocode(req.body.latitude,req.body.longitude,function(err,data){
			newOperasi.user_id = req.user_id;
			newOperasi.komoditas_id = req.body.komoditas_id;
			//newOperasi.alamat =  data.results[0].formatted_address;
			newOperasi.alamat =  req.body.alamat;
			newOperasi.latitude= req.body.latitude;
			newOperasi.longitude = req.body.longitude;
			newOperasi.pesan = req.body.pesan;
			newOperasi.datePost = Date.now();
			newOperasi.save(function(err,komo){
				if(err){
					throw err;
				}else{
					res.json({
						status:200,
						data:newOperasi,
						message:"sukses tambah operasi",
						token:req.token
					});
				}
			});
		//});
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	}
}

var allOperasiPasar = function(req,res){
	operasiPasar.find({},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,operasi){
		
		if(operasi==null){
			res.json({status:204,message:"operasi pasar tidak ditemukan",data:"",token:""});
		}else{
			each(operasi,function(value,key,array){
				user.findOne({user_id:operasi[key].user_id}).lean().exec(function(err,masyarakat){
					komoditas.findOne({komoditas_id:operasi[key].komoditas_id},function(err,komo){
						operasi[key].totalPendukung = operasi[key].pendukung.length;
						operasi[key].namaKomoditas = komo.name;
						//console.log(komo.name);
						operasi[key].satuan = komo.satuan;
						operasi[key].nama = masyarakat.name;
						operasi[key].datePost =moment(operasi[key].datePost).format("DD MMMM YYYY hh:mm a");						
						operasi[key].time=fromNow(operasi[key].datePost);
						operasi[key].status_voted = false;
						
						for(var i=0; i<1; i++){
							if(operasi[key].pendukung.length==0){
								operasi[key].status_voted=false;
							}else if(operasi[key].pendukung[i].user_id==req.user_id){
								operasi[key].status_voted=true;
							}
						}
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

//get satu aja
var oneOperasiPasar = function(req,res){
	if(req.role==1 || req.role==5){
		operasiPasar.findOne({operasiPasar_id:req.params.operasiPasar_id},'-_id -__v',{sort:{datePost:-1}},function(err,oneLaporan){
			if(oneLaporan==null){
				res.json({status:204,message:"operasi pasar tidak ditemukan",data:"",token:""});
			}else{
				//kembalian dalam bentuk json
				res.json({
					status:200,
					message:"sukses mendapat satu semua pasar",
					data:oneLaporan,						
					token:req.token
				});
			}
		})
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	}
};


//historu operasi pasar ku
var operasiPasarKu = function(req,res){
	//cek role user
	if(req.role==1 || req.role==5){
		operasiPasar.find({user_id:req.params.user_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,operasi){
			if(operasi==null){
				res.json({status:204,message:"operasi pasar tidak ditemukan",data:"",token:""});
			}else{
				console.log(operasi);
				each(operasi,function(value,key,array){
					user.findOne({user_id:operasi[key].user_id}).exec(function(err,masyarakat){
						//console.log(masyarakat);
						komoditas.findOne({komoditas_id:operasi[key].komoditas_id},function(err,komo){
							console.log(komo);
							operasi[key].totalPendukung = operasi[key].pendukung.length;
							operasi[key].namaKomoditas = komo.name;
							operasi[key].nama = masyarakat.name;
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
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	}
};

var updateOperasiPasar = function(req,res){
	//cek role user
	if(req.role==1 || req.role==5){
		operasiPasar.findOne({operasiPasar_id:req.body.operasiPasar_id},function(err,operasi){
			console.log('ini user_id ' +req.user_id);
			console.log(operasi);
			operasi.user_id=req.user_id;
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

var deleteOperasiPasar = function(req,res){
	//cek role
	if(req.role==1 || req.role==5){
		operasiPasar.findOne({operasiPasar_id:req.body.operasiPasar_id},function(err,hapusOperasi){
			if(err){
				res.json({status:402,message:err,data:"",token:req.token});
			}else{
				hapusOperasi.remove(function(err){
					if(err){
						res.json({status:401,message:err,data:"",token:req.token});
					}else{
						//kembalian dalam bentuk json
						res.json({	
							status:200,
							message:"sukses hapus satu operasi pasar",
							data:hapusOperasi,						
							token:req.token
						});
					}
				})
			}
		})
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	}
};


//dukung operasi pasar
var voteOperasi = function(req,res){
	if(req.role==1 || req.role==5){
		operasiPasar.findOne({operasiPasar_id:req.body.operasiPasar_id},function(err,operasi){
			if(operasi.pendukung.length==0){
				operasi.pendukung.push({user_id:req.user_id});
				operasi.save(function(err){
					if(err){
						res.json({status:402,message:err,data:"",token:req.token});
					}else{
						res.json({status:200,message:"sukses dukung operasi pasar",data:operasi,token:req.token});
					}
				})
			}
			//jika sudah ada, di cek dulu
			else{
				var status_vote = false;
				for(var i=0; i<operasi.pendukung.length; i++){
					if(operasi.pendukung[i].user_id==req.user_id){
						status_vote = true;
						
					}						
				}
				setTimeout(function () {
					if(status_vote==false){
						operasi.pendukung.push({user_id:req.user_id});
						operasi.save(function(err){
							if(err){
								res.json({status:402,message:err,data:operasi,token:req.token});
							}else{
								res.json({status:200,message:"sukses vote operasi pasar",data:operasi,token:req.token});
							}
						});
					}else if (status_vote==true){
						res.json({status:200,message:"sudah vote atau anda pemilik operasi pasar",data:operasi,token:req.token});
					}
				}, 100);
			}
		})
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:req.token});
	}
}

//unvote operasi pasar
var unVoteOperasi = function(req,res){
	if(req.role==1 || req.role==5){
		operasiPasar.update(
			{operasiPasar_id:req.body.operasiPasar_id},
			{$pull: {pendukung: {user_id: req.user_id}}},
			{safe: true},
			function(err,operasi){
				if(err){
					res.json({status:402,message:err,data:operasi,token:req.token});
				}else{
					res.json({status:200,message:"sukses unvote operasi pasar",data:operasi,token:req.token});
				}
			});
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:req.token});
	}
};

var getPendukungOperasi = function(req,res){
	if(req.role==1 || req.role==5){
		var pendukung = [];
		operasiPasar.findOne({operasiPasar_id:req.params.operasiPasar_id},function(err,operasi){
			for(var i=0; i<operasi.pendukung.length; i++){
				user.findOne({user_id:operasi.pendukung[i].user_id},function(err,user){
					pendukung.push(user);
				})
			}
		})
		setTimeout(function (){
			res.json({status:200,message:"sukses dapat pendukung",data:pendukung,token:req.token});
		}, 100);
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:req.token});
	}
};

module.exports = {
	add:addOperasiPasar,
	all:allOperasiPasar,
	operasiKu:operasiPasarKu,
	update:updateOperasiPasar,
	delete:deleteOperasiPasar,
	oneLaporan:oneOperasiPasar,
	voteOperasi:voteOperasi,
	unVoteOperasi:unVoteOperasi,
	pendukungOperasi:getPendukungOperasi
};