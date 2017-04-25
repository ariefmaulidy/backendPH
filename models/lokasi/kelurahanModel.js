var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kelurahanModel = new Schema({
    id_kel:String,
    id_kec:String,
    nama:String,
  id_jenis:String,
});

module.exports = mongoose.model("kelurahan",kelurahanModel);
