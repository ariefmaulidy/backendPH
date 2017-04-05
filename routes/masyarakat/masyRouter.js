var express = require('express');
var app=express();
var masyController=require('./../../controllers/masyarakat/masyarakatController');
var masyRouter=express.Router();

//untuk crud masyarakat
masyRouter.route('/add')
  .post(masyController.addMasyarakat);
masyRouter.route('/allMasy')
  .get(masyController.allMasy);
masyRouter.route('/findMasy/:us_id')
  .get(masyController.findMasy);
masyRouter.route('/updateMasy/:us_id')
  .post(masyController.updateMasy);
masyRouter.route('/deleteMasy/:us_id')
  .get(masyController.deleteMasy);


//untuk komoditas

//tambah komoditas
masyRouter.route('/addKom')
	.post(masyController.addKom);

//semua komoditas
masyRouter.route('/allKom')
	.get(masyController.allKom);

//komoditas tertentu hari ini saja
masyRouter.route('/todayKom')
	.post(masyController.todayKom);

//untuk dapetin semua jenis komoditas
masyRouter.route('/allJenis')
	.get(masyController.allJenis);


//untuk operasi pasar

//request operasi pasar
masyRouter.route('/addOperasi')
	.post(masyController.operasiPasar);

//histori operasi pasar untuk setiap user
masyRouter.route('/operasiku/:us_id')
	.get(masyController.operasiKu);


module.exports = masyRouter;