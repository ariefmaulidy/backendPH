var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");
 
autoIncrement.initialize(connection);

var daganganModel = new Schema({
	komoditas_id:String,
	user_id:String,
	harga:String,
	picture:String,
	datePost:Number,
	keterangan:String,
	stok:String
});
daganganModel.plugin(autoIncrement.plugin, { model: 'Dagangan', field: 'dagangan_id' });

module.exports=mongoose.model('Dagangan',daganganModel);