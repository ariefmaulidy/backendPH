var express=require('express');
var komoditasController=require('./../controllers/komoditasController');
var komoditasRouter=express.Router();

komoditasRouter.route('/add')
	.post(komoditasController.addKomoditas);
komoditasRouter.route('/get')
	.get(komoditasController.allKomoditas);
komoditasRouter.route('/get/:komoditas_id')
	.get(komoditasController.oneKomoditas);
komoditasRouter.route('/update')
	.post(komoditasController.updateKomoditas);
komoditasRouter.route('/delete')
	.post(komoditasController.deleteKomoditas);

module.exports=komoditasRouter; 