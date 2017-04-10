var express						=	require('express');
var laporanHargaController		=	require('./../controllers/masyarakat/laporanHargaController');
var laporanHargaRouter			=	express.Router();

laporanHargaRouter.route('/add')
	.post(laporanHargaController.add);	
laporanHargaRouter.route('/get')
	.get(laporanHargaController.all);
laporanHargaRouter.route('/get/:laporanHarga_id')
	.get(laporanHargaController.oneLaporan);
//histori user
laporanHargaRouter.route('/get/laporan/:user_id')
	.get(laporanHargaController.laporanku);
laporanHargaRouter.route('/update')
	.post(laporanHargaController.update);
laporanHargaRouter.route('/delete')
	.post(laporanHargaController.delete);
laporanHargaRouter.route('/get/day/:day')
	.get(laporanHargaController.getDay);

module.exports = laporanHargaRouter;