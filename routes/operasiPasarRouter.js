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
//histori operasi pasarku / untuk setiap user
operasiPasarRouter.route('/operasi/get/:user_id')
	.get(operasiPasarController.operasiKu);
//vote operasi pasar
operasiPasarRouter.route('/pendukung/add')
	.post(operasiPasarController.voteOperasi);
//unvote operasi pasar
operasiPasarRouter.route('/pendukung/delete')
	.post(operasiPasarController.unVoteOperasi);
//get pendukung operasi pasar
operasiPasarRouter.route('/pendukung/get/:operasiPasar_id')
	.get(operasiPasarController.pendukungOperasi);
//tanggapan
operasiPasarRouter.route('/tanggapan/add')
	.post(operasiPasarController.addTang);
operasiPasarRouter.route('/tanggapan/delete')
	.post(operasiPasarController.delTang);
operasiPasarRouter.route('/tanggapan/get/:operasiPasar_id')
	.get(operasiPasarController.getTang);


module.exports = operasiPasarRouter;