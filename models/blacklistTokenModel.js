var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var blacklistTokenModel = new Schema({
	token:String
});

module.exports=mongoose.model('BlacklistToken',blacklistTokenModel);
