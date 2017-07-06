//model or collections laporanHargaModel
var operasiPasar		=			require('./../../models/masyarakat/operasiPasarModel');
//model komoditas
var komoditas			=			require('./../../models/komoditasModel');
//user
var user				=			require('./../../models/userModel');
//security, crypto, jwt, and secretCodenya in config
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
//get address from latitude dan longitude google maps
var geocoder 			=			require('geocoder');
//promise
var Promise 			= 			require('promise');

var addOperasiPasar =function(req,res){
	var newOperasi = new operasiPasar(req.body);
	var role = req.role;
	//cek role user
	if(role==1 || role==5){				
			newOperasi.user_id = req.user_id;
			newOperasi.komoditas_id = req.body.komoditas_id;
			newOperasi.alamat =  req.body.alamat;
			newOperasi.latitude= req.body.latitude;
			newOperasi.longitude = req.body.longitude;
			newOperasi.pesan = req.body.pesan;
			newOperasi.datePost = Date.now();
            //save newOperasi
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
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	}
}

var allOperasiPasar = function(req,res){
	operasiPasar.find({},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,operasi){
		if(operasi==null){
			res.json({status:204,message:"operasi pasar tidak ditemukan",data:"",token:""});
		}else{
            //looping operasi pasar
			each(operasi,function(value,key,array){
                //find user who post operasi pasar
				user.findOne({user_id:operasi[key].user_id}).lean().exec(function(err,masyarakat){
                    //find komoditas was posted
					komoditas.findOne({komoditas_id:operasi[key].komoditas_id},function(err,komo){
						operasi[key].totalPendukung = operasi[key].pendukung.length;
						operasi[key].namaKomoditas = komo.name;
						operasi[key].satuan = komo.satuan;
						operasi[key].nama = masyarakat.name;
						operasi[key].datePost =moment(operasi[key].datePost).format("DD MMMM YYYY hh:mm a");
						operasi[key].time=fromNow(operasi[key].datePost); //from now dari sekarang
						operasi[key].status_voted = false;
						operasi[key].picture = masyarakat.picture;
						//looping pendukung every operasi pasar and check user have been vote or no
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
            //set time out 100 miliseconds
			setTimeout(function () {
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

//get one Operasi Pasar
var oneOperasiPasar = function(req,res){
	if(req.role==1 || req.role==5){
        //operasi pasar base on operasiPasar_id
		operasiPasar.findOne({operasiPasar_id:req.params.operasiPasar_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,oneOperasi){
            //formated day mon year hour minutes
			oneOperasi.datePost = moment(oneOperasi.datePost).format("DD MMMM YYYY hh:mm a");
			if(oneOperasi==null){
				res.json({status:204,message:"operasi pasar tidak ditemukan",data:"",token:""});
			}else{
				res.json({
					status:200,
					message:"sukses mendapat satu operasi pasar",
					data:oneOperasi,						
					token:req.token
				});
			}
		})
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:""});
	}
};


//history operasi pasar user
var operasiPasarKu = function(req,res){
	if(req.role==1 || req.role==5){
        //find operasi pasar based on user_id
		operasiPasar.find({user_id:req.params.user_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,operasi){
			if(operasi==null){
				res.json({status:204,message:"operasi pasar tidak ditemukan",data:"",token:""});
			}else{
                //looping operasi pasar
				each(operasi,function(value,key,array){
                    //find user who post operasi pasar
					user.findOne({user_id:operasi[key].user_id}).exec(function(err,masyarakat){
                        //find komoditas was posted
						komoditas.findOne({komoditas_id:operasi[key].komoditas_id},function(err,komo){
							operasi[key].totalPendukung = operasi[key].pendukung.length;
							operasi[key].namaKomoditas = komo.name;
							operasi[key].nama = masyarakat.name;
							operasi[key].datePost = moment(operasi[key].datePost).format("DD MMMM YYYY hh:mm a");
							operasi[key].time=fromNow(operasi[key].datePost);
					})
				});
			});
            //set time out 100 ms
			setTimeout(function () {
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
	if(req.role==1 || req.role==5){
		operasiPasar.findOne({operasiPasar_id:req.body.operasiPasar_id},function(err,operasi){
			operasi.user_id=req.user_id;
			operasi.pesan=req.body.pesan;
            //save update
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
	if(req.role==1 || req.role==5){
        //find operasi pasar based on operasipasar_id
		operasiPasar.findOne({operasiPasar_id:req.body.operasiPasar_id},function(err,hapusOperasi){
			if(err){
				res.json({status:402,message:err,data:"",token:req.token});
			}else{
                //delete operasi pasar
				hapusOperasi.remove(function(err){
					if(err){
						res.json({status:401,message:err,data:"",token:req.token});
					}else{
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


//vote operasi pasar
var voteOperasi = function(req,res){
	if(req.role==1 || req.role==5){
        //find operasi pasar based on operasi pasar id
		operasiPasar.findOne({operasiPasar_id:req.body.operasiPasar_id},function(err,operasi){
            //check operasi pasar have voted or no
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
			//check user have voted operasi pasar or no
			else{
				var status_vote = false;
				for(var i=0; i<operasi.pendukung.length; i++){
					if(operasi.pendukung[i].user_id==req.user_id){
                        //have voted so status_voted = true
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
        //remove from array pendukung
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
        //find operasi pasar
		operasiPasar.findOne({operasiPasar_id:req.params.operasiPasar_id},function(err,operasi){
			for(var i=0; i<operasi.pendukung.length; i++){
                //find user who was voted operasi pasar
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


//post tanggapan operasi pasar
var addTang = function(req,res){
	if(req.role==1||req.role==5){
		operasiPasar.findOne({operasiPasar_id:req.body.operasiPasar_id}).exec(function(err,operasi){
			var datePost = Date.now();
			if(operasi!=null){
				operasi.tanggapan.push({user_id:req.user_id,isi:req.body.isi,datePost:datePost});
					operasi.save(function(err){
					if(!err){
						res.status(200).json({status:200,message:"sukses memberi tanggapan",data:operasi,token:req.token});
					}else{
						res.status(400).json({status:400,message:err,token:req.token});
					}
				});		
			}else{
				res.status(400).json({status:400,message:"Operasi Pasar tidak ada",token:req.token});	
			}
		});	
	}else{
		res.status(403).json({status:403,message:"role tidak sesuai",token:req.token});
	}
}

//delete tanggapan operasi pasar
var delTang = function(req,res){
	if(req.role==1||req.role==5){
		//update tanggapan dengan pull _id tanggapan, _id yang dipakai merupakan _id dari mongo
		operasiPasar.update( 
      		{ operasiPasar_id: req.body.operasiPasar_id },
      		{ $pull: { tanggapan : { _id : req.body._id } } },
      		{ safe: true },
			function(err, operasi){
				if(!err){
					res.json({status:200,message:'sukses hapus tanggapan',token:req.token});
				}else{
					res.json({status:400,message:err,token:req.token});
				}
			}
		);
    }else{
		res.json({status:403,message:"role tidak sesuai",token:req.token});
	}
}

//view tanggapan operasi pasar
var getTang = function(req,res){
	if(req.role==1 || req.role==5){
		var tanggapan = [];
        //find operasi pasar
		operasiPasar.findOne({operasiPasar_id:req.params.operasiPasar_id},function(err,operasi){
			for(var i=0; i<operasi.tanggapan.length; i++){
                date_Post=moment(operasi.tanggapan[i].datePost).format("DD MMMM YYYY hh:mm a");
				var _id = operasi.tanggapan[i]._id;
				var isi = operasi.tanggapan[i].isi;
				//find user who was respon operasi pasar
				user.findOne({user_id:operasi.tanggapan[i].user_id},function(err,user){
					tanggapan.push({
						name:user.name,
						picture:user.picture,
						user_id:user.user_id,
						_id:_id,
						isi:isi,
						datePost:date_Post
					});
				})
			}
		})
		setTimeout(function (){
			res.json({status:200,message:"sukses dapat tanggapan",data:tanggapan,token:req.token});
		}, 100);
	}else{
		res.json({status:401,message:"role tidak sesuai",data:"",token:req.token});
	}
}

module.exports = {
	add:addOperasiPasar,
	all:allOperasiPasar,
	operasiKu:operasiPasarKu,
	update:updateOperasiPasar,
	delete:deleteOperasiPasar,
	oneLaporan:oneOperasiPasar,
	//vote
	voteOperasi:voteOperasi,
	unVoteOperasi:unVoteOperasi,
	pendukungOperasi:getPendukungOperasi,
	//tanggapan
	addTang:addTang,
	delTang:delTang,
	getTang:getTang
};