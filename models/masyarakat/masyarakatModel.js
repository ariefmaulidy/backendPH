var mongoose=require('mongoose'),
	Schema=mongoose.Schema,
	autoIncrement=require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/PortalHarga");

autoIncrement.initialize(connection);

var masyarakatModel=new Schema({
	name:String,
  	username:String,
  	password:String,
  	email:String,
	role:String,
	pathPictProfil:String		//buat picute profil yang akan digunakan
});

masyarakatModel.plugin(autoIncrement.plugin,{model:'masyarakats', field:'masyId', startAt:1});

module.exports=mongoose.model("masyarakats",masyarakatModel);
	