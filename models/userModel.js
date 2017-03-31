var Aspirasi = require('./aspirasiModel');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");
 
autoIncrement.initialize(connection);

var userModel = new Schema({
	name:String,
	username:String,
	password:String,
	email:String,
	role:{type:Number,default:0},
	last_login:String,
	picture:String,
	address:String
});
userModel.plugin(autoIncrement.plugin, { model: 'User', field: 'user_id' });

module.exports=mongoose.model('User',userModel);