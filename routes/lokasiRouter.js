var express             =       require('express');
var locationController  =       require('./../controllers/lokasi/lokasiController');
var locationRouters     =       express.Router();

/*jenis 1 = kabupaten, 2 = kota, 3 = kelurahan, 4 = desa*/
locationRouters.route('/jenis')
    .get(locationController.jenis)

locationRouters.route('/provinsi')
    .get(locationController.provinsi)

locationRouters.route('/kabupaten/:id_prov')
    .get(locationController.kabupaten)

locationRouters.route('/kecamatan/:id_kab')
    .get(locationController.kecamatan)

locationRouters.route('/kelurahan/:id_kec')
    .get(locationController.kelurahan)

module.exports = locationRouters;