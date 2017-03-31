var express=require('express')
var aspirasiController=require('./../controllers/aspirasiController');
 
var aspirasiRouter=express.Router();


aspirasiRouter.route('/add')
	.post(aspirasiController.postAspirasi);
aspirasiRouter.route('/delete')
	.post(aspirasiController.delAspirasi);
aspirasiRouter.route('/pendukung/add')
	.post(aspirasiController.dukung_aspirasi);
aspirasiRouter.route('/pendukung/delete')
	.post(aspirasiController.batalDukung);

aspirasiRouter.route('/get')
	.get(aspirasiController.allAspirasi);
aspirasiRouter.route('/get/:user_id')
	.get(aspirasiController.aspirasiKu);
aspirasiRouter.route('/pendukung/get/:aspirasi_id')
	.get(aspirasiController.getPendukung);

module.exports=aspirasiRouter; 