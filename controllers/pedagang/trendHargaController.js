//model atau collections laporanHargaModel
var laporanHarga		=			require('./../../models/laporanHargaModel');
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


//dapat trend harga 5 hari sebelumnya

var trendHarga = function(req,res){	
	var mean = [];
	//ambil semua laporanHarga di sorting sesuai dengan tanggal post
	laporanHarga.find({komoditas_id:req.params.komoditas_id},'-_id -__v',{sort:{datePost:-1}},function(err,laporan){
		//console.log(laporan);		
		if(laporan==""){
			res.json({status:204,message:"not found",data:"",token:req.token});
		}else{
			//tanggal sekarang
			for (var i=0; i<5; i++){
				
				var dateNow = new Date();				
				//tanggal sekarang di kurangi hari yang diinginkan, hari nya
				dateNow.setDate(dateNow.getDate() - i);
				//hari yang diinginkan dalam format, hari, tanggal, bulan, dan tahun
				var getDate = dateFormat(dateNow, "dddd , mmmm dS , yyyy");						


				//buat variabel parsing yang akan menerima laporanHarga_id pada hari itu
				var parsing = [];
				var number = [];
				var counter = 0;
				var mean = [];

				for(var j=0;j<laporan.length;j++){
					if(dateFormat(laporan[j].datePost, "dddd , mmmm dS , yyyy")==getDate){
						number.push(laporan[j].laporanHarga_id);			
						parsing.push(laporan[j].harga);
					};
				}
				console.log(parsing);
				console.log(parsing.length);
				setTimeout(function(){
					if(parsing.length==0){
					mean.push(0);
				}else{
					mean.push(math.mean(parsing));
				}
				},100)
				
				
			}
			
			setTimeout(function(){
				res.send(mean);
			},150)
							
		}
		
		
	})
	
}

module.exports = {
	trendHarga:trendHarga
};
	
	
	