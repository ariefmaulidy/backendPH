var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
	autoIncrement=require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var komoditasModel = new Schema({
	jenis:String,		//jenis komoditasnya misal bawang cabai
	us_id:String,
	harga:Number,		//dalam satuan kg
	lokasi:[				//lokasi di mana post komoditas
		{latitude:String,
		longitude:String}
	],		
	datePost:String,
	pathPictLocKOm:String	//path picture lokasi komoditas
});

komoditasModel.plugin(autoIncrement.plugin,{model:'komoditas',field:'kom_id',startAt:1});

module.exports = mongoose.model("komoditas",komoditasModel);