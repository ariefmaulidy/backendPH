var express=require('express')
var aspirasiController=require('./../controllers/aspirasiController');
 
var aspirasiRouter=express.Router();

aspirasiRouter.route('/getAspirasi/:id')
	.get(aspirasiController.allAspirasi);
aspirasiRouter.route('/getAspirasiKu/:id')
	.get(aspirasiController.aspirasiKu);
aspirasiRouter.route('/getPendukung/:aspirasi_id')
	.get(aspirasiController.getPendukung);
aspirasiRouter.route('/batalDukung')
	.post(aspirasiController.batalDukung);
aspirasiRouter.route('/delAspirasi')
	.post(aspirasiController.delAspirasi);
aspirasiRouter.route('/dukungAspirasi')
	.post(aspirasiController.dukung_aspirasi);
aspirasiRouter.route('/postAspirasi')
	.post(aspirasiController.postAspirasi);
module.exports=aspirasiRouter; 