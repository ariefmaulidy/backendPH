var crypto 				= 			require('crypto');
var config				=			require('./../../config');
var jwt 				=			require('jsonwebtoken');
var moment 				=			require('moment');
var tz 					= 			require('moment-timezone');
var each 				= 			require('foreach');
var mongoose			=        	require('mongoose');

var jenis               =			require('./../../models/lokasi/jenisModel');
var provinsi			=			require('./../../models/lokasi/provinsiModel');
var kabupaten			=			require('./../../models/lokasi/kabupatenModel');
var kelurahan			=			require('./../../models/lokasi/kelurahanModel');
var kecamatan			=			require('./../../models/lokasi/kecamatanModel');

/*jenis
1 = kabupaten
2 = kota
3 = kelurahan
4 = desa*/
var get_jenis = function(req,res){
    jenis.find({},'-_id',function(err,allJenis){
        if(err){
            res.json({status:402,message:err,data:"",token:req.token});
        }
        else{
            res.json({
            status:200,
            message:"succes get all jenis",
            data:allJenis,
            token:req.token});
        }        
    })
}

//all provinsi
var get_provinsi = function(req,res){
    provinsi.find({},'-_id',{sort:{nama:1}},function(err,prov){
        if(err){
            res.json({status:402,message:err,data:"",token:req.token});
        }else{            
            res.json({
            status:200,
            message:"succes get provinsi",
            data:prov,
            token:req.token});
        }
    })
}

//kabupaten base on provinsi selected
var get_kabupaten = function(req,res){
    kabupaten.find({id_prov:req.params.id_prov},'-_id id_kab nama',{sort:{nama:1}},function(err,kab){
        if(err){
            res.json({status:402,message:err,data:"",token:req.token});
        }else{            
            res.json({
            status:200,
            message:"succes get kabupaten",
            data:kab,
            token:req.token});
        }
    })
}

//kecamatan base on kabupaten selected
var get_kecamatan = function(req,res){
    kecamatan.find({id_kab:req.params.id_kab},'-_id id_kec nama',{sort:{nama:1}},function(err,kec){
        if(err){
            res.json({status:402,message:err,data:"",token:req.token});
        }else{            
            res.json({
            status:200,
            message:"succes get kecamatan",
            data:kec,
            token:req.token});
        }
    })
}

//kelurahan base on kecamatan selected
var get_kelurahan = function(req,res){
    kelurahan.find({id_kec:req.params.id_kec},'-_id id_kel nama',{sort:{nama:1}},function(err,kel){
        if(err){
            res.json({status:402,message:err,data:"",token:req.token});
        }else{            
            res.json({
            status:200,
            message:"succes get kelurahan",
            data:kel,
            token:req.token});
        }
    })
}


//provinsi
module.exports = {
    jenis:get_jenis,
    provinsi:get_provinsi,
    kabupaten:get_kabupaten,
    kecamatan:get_kecamatan,
    kelurahan:get_kelurahan
}