var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
    autoIncrement=require('mongoose-auto-increment');
    
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var summaryModel = new Schema({
	kecamatanid: String,
	komoditas_id: Number,
    date: String, // tanggal bulan tahun
    month: String,
    year: String,
    averageHarga: Number,
    quantity: Number,
});

summaryModel.plugin(autoIncrement.plugin,{model:'summary',field:'summary_id',startAt:1});

module.exports = mongoose.model("summary",summaryModel);