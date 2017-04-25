var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var materiModel = new Schema({
	user_id:Number,
	judul:String,
	datePost:Number,
	keterangan:String,
	file:String
	
});
materiModel.plugin(autoIncrement.plugin, { model: 'Materi', field: 'materi_id' });
module.exports=mongoose.model('Materi',materiModel);