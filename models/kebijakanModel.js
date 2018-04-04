var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var kebijakanModel = new Schema({
    from: String,
    to:{
        Masyarakat: Boolean,
        Pedagang: Boolean,
        Penyuluh: Boolean,
        Petani: Boolean
    },
    nomor: String,
	judul: String,
	isi: String,
	dateSent: Number,
    file: String,
    apps: {
        Email: Boolean, 
        Ecommerce: Boolean, 
        KMS: Boolean, 
        PH: Boolean
    },
    status: Boolean
});
kebijakanModel.plugin(autoIncrement.plugin, { model: 'Kebijakan', field: 'kebijakan_id' });
module.exports=mongoose.model('Kebijakan',kebijakanModel);