var express=require('express')
var produksiController=require('./../controllers/produksiController');
 
var produksiRouter=express.Router();

produksiRouter.route('/postProduksi')
	.post(produksiController.postProduksi);
produksiRouter.route('/delProduksi')
	.post(produksiController.delProduksi);
produksiRouter.route('/getProduksi/:id')
	.get(produksiController.allProduksi);
module.exports=produksiRouter;
