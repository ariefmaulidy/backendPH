var express = require('express');
var app=express();
var setKomoditasController=require('./../../controllers/pemerintah/setKomoditasController');
var setKomoditasRouter=express.Router();

//tambah komoditas
setKomoditasRouter.route('/setKomoditas/tambahKomoditas')
	.post(setKomoditasController.tambahKomoditas);

//semua komoditas
setKomoditasRouter.route('/setKomoditas/semuaKomoditas')
	.get(setKomoditasController.semuaKomoditas);

//menghapus komoditas
setKomoditasRouter.route('/setKomoditas/hapusKomoditas/:setKom_id')
	.get(setKomoditasController.deleteKomoditas);

//hanya jenisnya saja
setKomoditasRouter.route('/setKomoditas/jenisKomoditas')
	.get(setKomoditasController.jenisKomoditas);

module.exports = setKomoditasRouter;