var User = require('./userModel');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var aspirasiModel = new Schema({
	us_id:{type:String,ref:'User'},
	subjek:String,
	datePost:Number,
	isi_aspirasi:String,
	pendukung_id:[{idpendukung:String}]
});

aspirasiModel.plugin(autoIncrement.plugin, { model: 'Aspirasi', field: 'aspirasi_id' });
module.exports=mongoose.model('Aspirasi',aspirasiModel);