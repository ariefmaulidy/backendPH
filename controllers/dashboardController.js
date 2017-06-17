// import require model
var Aspirasi=require('./../models/aspirasiModel');
var User=require('./../models/userModel');
var Produksi=require('./../models/produksiModel');
var LaporanHarga=require('./../models/masyarakat/laporanHargaModel');
var OperasiPasar=require('./../models/masyarakat/operasiPasarModel');

// import module //

// time module
var moment=require('moment');
var tz=require('moment-timezone');
var fromNow = require('from-now');

//looping module
var each = require('foreach');

var countDashboard = function(req,res){
if(req.role==1)
{
	var total={};
	 User.count({role:3}, function(err, penyuluh) {
	           total.penyuluh = penyuluh;
	 		});
	 User.count({role:4}, function(err, petani) {
	           total.petani = petani;
			});
	 User.count({role:5}, function(err, masyarakat) {
	           total.masyarakat = masyarakat;
			})
	 User.count({role:6}, function(err, pedagang) {
	           total.pedagang = pedagang;
			})
	 Aspirasi.count({}, function(err, aspirasi) {
	           total.aspirasi = aspirasi;
			})
	 Produksi.count({}, function(err, produksi) {
	           total.produksi = produksi;
			})
	 LaporanHarga.count({}, function(err, laporanHarga) {
	           total.laporanHarga = laporanHarga;
			})
	 OperasiPasar.count({}, function(err, operasiPasar) {
	           total.operasiPasar = operasiPasar;
			})
	 setTimeout(function() {
	 	res.json({status:200,message:'Get data success',data:total,token:req.token});
	 }, 200);	
	}
	else
	{
		res.json({status:403,message:"Forbidden access for this user",token:req.token});
	}
}

module.exports = {
	countDashboard:countDashboard
};
