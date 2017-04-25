var express=require('express')
var materiController=require('./../controllers/materiController');
var materiRouter=express.Router();

// upload photo

materiRouter.route('/add')
	.post(materiController.uploadMateri);

module.exports=materiRouter; 