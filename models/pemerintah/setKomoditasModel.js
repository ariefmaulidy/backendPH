var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
	autoIncrement=require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var setKomoditas = new Schema({
	namaKomoditas:String
});

setKomoditas.plugin(autoIncrement.plugin,{model:'setKomoditas',field:'setKom_id',startAt:1});

module.exports = mongoose.model("setKomoditas",setKomoditas);