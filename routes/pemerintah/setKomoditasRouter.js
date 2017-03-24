var express = require('express');
var app=express();
var setKomoditasController=require('./../../controllers/pemerintah/setKomoditasController');
var setKomoditasRouter=express.Router();

setKomoditasRouter.route('/setKomoditas/tambahKomoditas')
	.post(setKomoditasController.tambahKomoditas);

setKomoditasRouter.route('/setKomoditas/semuaKomoditas')
	.get(setKomoditasController.semuaKomoditas);

setKomoditasRouter.route('/setKomoditas/hapusKomoditas/:setKom_id')
	.get(setKomoditasController.deleteKomoditas);

setKomoditasRouter.route('/setKomoditas/jenisKomoditas')
	.get(setKomoditasController.jenisKomoditas);

module.exports = setKomoditasRouter;