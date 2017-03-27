var express = require('express');
var app=express();
var setKomoditasController=require('./../../controllers/pemerintah/setKomoditasController');
var setKomoditasRouter=express.Router();

//tambah komoditas
setKomoditasRouter.route('/tambahKomoditas')
	.post(setKomoditasController.tambahKomoditas);

//semua komoditas
setKomoditasRouter.route('/semuaKomoditas')
	.get(setKomoditasController.semuaKomoditas);

//menghapus komoditas
setKomoditasRouter.route('/hapusKomoditas/:setKom_id')
	.get(setKomoditasController.deleteKomoditas);

//hanya jenisnya saja
setKomoditasRouter.route('/jenisKomoditas')
	.get(setKomoditasController.jenisKomoditas);

module.exports = setKomoditasRouter;