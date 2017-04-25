var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var provinsiModel = new Schema({
    id_prov:String,
    nama:String
});

module.exports = mongoose.model("provinsi",provinsiModel);
