var region       	= 	require('./../../models/pemerintah/regionModel');
var crypto 			= 	require('crypto');
var config			=	require('./../../config');
var jwt 			=	require('jsonwebtoken');
var moment			=	require('moment');
var tz				=	require('moment-timezone');
var each 			= 	require('foreach');

var addRegion = function(req,res){
    if(req.role==1 || req.role==2){
        var newRegion = new region(req.body);
        newRegion.save(function(err){
            if(err){
                res.json({status:402,message:err,data:"",token:req.token});
            }else{
                res.json({
                    status:200,
					message:"sukses tambah laporan harga",
					data:newLaporan,						
					token:req.token
                });
            }
        })
    }else{
        res.json({status:401,message:"role tidak sesuai",data:"",token:""});
    }
}

