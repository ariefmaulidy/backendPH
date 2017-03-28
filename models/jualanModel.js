var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");
 
autoIncrement.initialize(connection);

var jualanModel = new Schema({
	komoditas:String,
	us_id:String,
	harga:String,
	satuan_harga:String,
	foto_komoditas:String,
	datePost:Number,
	stok:String,
	satuan_stok:String
});
jualanModel.plugin(autoIncrement.plugin, { model: 'Jualan', field: 'jualan_id' });

module.exports=mongoose.model('Jualan',jualanModel);