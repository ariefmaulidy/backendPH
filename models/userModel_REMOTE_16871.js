var Aspirasi = require('./aspirasiModel');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");
 
autoIncrement.initialize(connection);

var userModel = new Schema({
	//user umum
	username:String,
	email:String,
	password:String,
	name:String,
	role:{type:Number,default:0},
	last_login:String,
	picture:String,
	//pedagang
	dagangan:[{
		komoditas_id:Number,
		keterangan:String,
		harga:Number,
		stock:Number,
		date:Number
	}]
});
userModel.plugin(autoIncrement.plugin, { model: 'User', field: 'user_id',startAt:1});

module.exports=mongoose.model('User',userModel);