var User = require('./userModel');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var produksiModel = new Schema({
	us_id:{type:String,ref:'User'},
	komoditas:String,
	lokasi:String,
	datePost:String,
	jumlah_produksi:String,
	keterangan:String
});

produksiModel.plugin(autoIncrement.plugin, { model: 'Produksi', field: 'produksi_id' });
module.exports=mongoose.model('Produksi',produksiModel);