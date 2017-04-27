var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
	autoIncrement=require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var region = new Schema({
	provinsi:String,
	kabupaten:String,
	kecamatan:String,
	kelurahan:String,
});

region.plugin(autoIncrement.plugin,{model:'region',field:'region_id',startAt:1});

module.exports = mongoose.model("region",region);