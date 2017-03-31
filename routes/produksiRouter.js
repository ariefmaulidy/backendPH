var express=require('express')
var produksiController=require('./../controllers/produksiController');
 
var produksiRouter=express.Router();

produksiRouter.route('/add')
	.post(produksiController.postProduksi);
produksiRouter.route('/update')
	.post(produksiController.updateProduksi);
produksiRouter.route('/delete')
	.post(produksiController.delProduksi);
produksiRouter.route('/get/:id')
	.get(produksiController.getProduksiKu);
produksiRouter.route('/get')
	.get(produksiController.getProduksi);

module.exports=produksiRouter;
