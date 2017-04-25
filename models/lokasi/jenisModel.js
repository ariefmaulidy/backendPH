var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var provinsiModel = new Schema({
    id_jenis:String,
    nama:String
});

module.exports = mongoose.model("jenis",provinsiModel);