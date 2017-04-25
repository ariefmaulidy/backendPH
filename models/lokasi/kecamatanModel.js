var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var provinsiModel = new Schema({
    id_kec:String,
    id_kab:String,
    nama:String
});

module.exports = mongoose.model("kecamatan",provinsiModel);
