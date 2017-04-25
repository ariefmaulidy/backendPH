var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jenisModel = new Schema({
  id_jenis:String,
  nama:String,
});

module.exports = mongoose.model("jenis",jenisModel);
