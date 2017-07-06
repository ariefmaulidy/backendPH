var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
	autoIncrement=require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var operasiPasarModel = new Schema({
	user_id:Number,
	komoditas_id:Number,
	latitude:Number,
	longitude:Number,
	alamat:String,
	pesan:String,
	datePost:Number,
	//array pendukungnya
	pendukung:[{
		user_id:Number
	}],
	tanggapan:[
		{
			user_id:String,
			isi:String,
			datePost:Number
		}
	]
});

operasiPasarModel.plugin(autoIncrement.plugin,{model:'operasiPasar',field:'operasiPasar_id',startAt:1});

module.exports = mongoose.model("operasiPasar",operasiPasarModel);