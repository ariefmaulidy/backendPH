var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var provinsiModel = new Schema({
    id_kab:String,
    id_prov:String,
    nama:String,
    id_jenis:String
});

module.exports = mongoose.model("kabupaten",provinsiModel);
