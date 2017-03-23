var express = require('express');
var app=express();
var masyController=require('./../../controllers/masyarakat/masyarakatController');
var masyRouter=express.Router();

//untuk crud masyarakat
masyRouter.route('/addMasy')
  .post(masyController.addMasy);
masyRouter.route('/allMasy')
  .get(masyController.allMasy);
masyRouter.route('/findMasy/:us_id')
  .get(masyController.findMasy);
masyRouter.route('/updateMasy/:us_id')
  .post(masyController.updateMasy);
masyRouter.route('/deleteMasy/:us_id')
  .get(masyController.deleteMasy);

//untuk komoditas
masyRouter.route('/addKom')
	.post(masyController.addKom);
masyRouter.route('/allKom')  //kalau nggak dipakai
	.get(masyController.allKom);
masyRouter.route('/todayKom')
	.post(masyController.todayKom);
//untuk dapetin semua jenis komoditas
masyRouter.route('/allJenis')
	.get(masyController.allJenis);

//untuk operasi pasar
masyRouter.route('/addOperasi')
	.post(masyController.operasiPasar);
masyRouter.route('/operasiku/:us_id')
	.get(masyController.operasiKu);


module.exports = masyRouter;