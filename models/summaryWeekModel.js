var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
    autoIncrement=require('mongoose-auto-increment');
    
var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var summaryWeekModel = new Schema({
	provinsiid: String,
	komoditas_id: Number,
    date: String, // tanggal bulan tahun
    month: String,
    year: String,
    averageHarga: Number,
    quantity: Number,
});

summaryWeekModel.plugin(autoIncrement.plugin,{model:'summaryWeek',field:'summaryWeek_id',startAt:1});

module.exports = mongoose.model("summaryWeek",summaryWeekModel);