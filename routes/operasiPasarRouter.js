var express						=	require('express');
var operasiPasarController		=	require('./../controllers/masyarakat/operasiPasarController');
var operasiPasarRouter			=	express.Router();

operasiPasarRouter.route('/add')
	.post(operasiPasarController.add);
operasiPasarRouter.route('/get')
	.get(operasiPasarController.all);
operasiPasarRouter.route('/get/:operasiPasar_id')
	.get(operasiPasarController.oneLaporan);
operasiPasarRouter.route('/update')
	.post(operasiPasarController.update);
operasiPasarRouter.route('/delete')
	.post(operasiPasarController.delete);
//histori operasi pasar
operasiPasarRouter.route('/operasi/get/:user_id')
	.get(operasiPasarController.operasiKu);

module.exports = operasiPasarRouter;