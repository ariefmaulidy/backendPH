var express=require('express')
var jualanController=require('./../controllers/jualanController');
var jualanRouter=express.Router();

// upload photo

jualanRouter.route('/getAll')
	.get(jualanController.getAll);
jualanRouter.route('/getJualanKu/:id')
	.get(jualanController.getJualanKu);
jualanRouter.route('/updateJualan')
	.post(jualanController.updateJualan);
jualanRouter.route('/postJualan')
	.post(jualanController.postJualan);
jualanRouter.route('/delJualan')
	.post(jualanController.delJualan);

module.exports=jualanRouter; 