var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
	autoIncrement=require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var laporanHargaModel = new Schema({
	komoditas_id:Number,
	user_id:Number,
	harga:Number,
	date:Number,
	lokasi:[{
		latitude:Number,
		longitude:Number,
		alamat:String
	}]
});

laporanHargaModel.plugin(autoIncrement.plugin,{model:'laporanHarga',field:'laporanHarga_id',startAt:1});

module.exports = mongoose.model("laporanHarga",komoditasModel);