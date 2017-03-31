var User = require('./userModel');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var aspirasiModel = new Schema({
	user_id:{type:String,ref:'User'},
	subjek:String,
	datePost:Number,
	isi:String,
	pendukung:[{user_id:String}]
});

aspirasiModel.plugin(autoIncrement.plugin, { model: 'Aspirasi', field: 'aspirasi_id' });
module.exports=mongoose.model('Aspirasi',aspirasiModel);