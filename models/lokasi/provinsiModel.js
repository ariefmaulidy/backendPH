var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var provinsiModel = new Schema({
    id_prov:String,
    nama:String,
    lat: Number,
    lng: Number,
});

module.exports = mongoose.model("provinsi",provinsiModel);
