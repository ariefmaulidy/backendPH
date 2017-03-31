var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
	autoIncrement=require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var daganganModel = new Schema({
	komoditas_id:Number,
	keterangan:String,
	harga:Number,
	stock:Number,
	date:Number
});

daganganModel.plugin(autoIncrement.plugin,{model:'dagangan',field:'dagangan_id',startAt:1});

module.exports = mongoose.model("dagangan",komoditasModel);