var user				=			require('./../models/userModel');
var komoditas			=			require('./../models/komoditasModel');
var kelurahan			=			require('./../models/lokasi/kelurahanModel');
var provinsi			=			require('./../models/lokasi/provinsiModel');
var location   			=			require('./../models/locationModel');
var crypto 				= 			require('crypto');
var config				=			require('./../config');
var jwt 				=			require('jsonwebtoken');
var moment 				=			require('moment');
var tz 					= 			require('moment-timezone');
var each 				= 			require('foreach');
var mongoose			=        	require('mongoose');

//location
var jenis = function(req,res){
    /*location.find({},'-_id -__v',{sort:{id_jenis:1}},function(err,all){*/
    /*location.findOne({id_jenis:4},'-_id -__v',{sort:{id_jenis:1}},function(err,all){*/
    /*location.findOne({id_jenis:"3"},function(err,all){*/
    kelurahan.find({},function(err,all){
        console.log(all);
        res.json({
            data:all
        })
    })
}

//provinsi
module.exports = {
    jenis:jenis
}