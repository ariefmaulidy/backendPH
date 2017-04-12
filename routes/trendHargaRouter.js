var express						=	require('express');
var trendHargaController		=	require('./../controllers/pedagang/trendHargaController');
var trendHargaRouter			=	express.Router();

trendHargaRouter.route('/get/:komoditas_id')
	.get(trendHargaController.trendHarga)

module.exports = trendHargaRouter;