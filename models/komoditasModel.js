var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
	autoIncrement=require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var komoditasModel = new Schema({
	name:String,
	satuan:String,
	harga:Number,
	datePost:Number,
	last_update:String
});

komoditasModel.plugin(autoIncrement.plugin,{model:'komoditas',field:'komoditas_id',startAt:1});

module.exports = mongoose.model("komoditas",komoditasModel);