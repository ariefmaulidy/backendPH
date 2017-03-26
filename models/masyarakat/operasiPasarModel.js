var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
	autoIncrement=require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var operasiPasarModel = new Schema({
	us_id:String,
	email:String,
	//lokasi maps latitide dan longitude
	lokasi:[
		{latitude:Number,
		longitude:Number}
	],
	komoditas:String,
	pesan:String,
	datePost:String
});

operasiPasarModel.plugin(autoIncrement.plugin,{model:'operasipasars',field:'operasiPasar_id',startAt:1});

module.exports = mongoose.model("operasipasars",operasiPasarModel);