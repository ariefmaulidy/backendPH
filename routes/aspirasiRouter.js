var express=require('express')
var aspirasiController=require('./../controllers/aspirasiController');
 
var aspirasiRouter=express.Router();
console.log("masuk routes");
aspirasiRouter.route('/get')
	.options(aspirasiController.allAspirasi);
aspirasiRouter.route('/add')
	.post(aspirasiController.postAspirasi);
aspirasiRouter.route('/update')
	.post(aspirasiController.updateAspirasi);
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
console.log("masuk routes");
module.exports=aspirasiRouter; 
