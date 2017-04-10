var express						=	require('express');
var trendHargaController		=	require('./../controllers/pedagang/trendHargaController');
var trendHargaRouter			=	express.Router();

trendHargaRouter.route('/get')
	.get(trendHargaController.trendHarga)

module.exports = trendHargaRouter;