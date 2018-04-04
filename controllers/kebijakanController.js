var User        = require('./../models/userModel'),
    Kebijakan 	= require('./../models/kebijakanModel'),
    moment 	    = require('moment'),
    multer      = require('multer'),
    fs 		    = require('fs'),
    Email       = require('./../controllers/emailController')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+'/../public/kebijakanfile/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, 'kebijakan_'+file.originalname.split('.')[0] +'_'+ datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

const pdfFilter = function (req, file, cb) {
    //accept pdf only
   if (file.mimetype != 'application/pdf') {
       req.fileValidateError = "Hanya dapat pdf yang di upload";
       return cb(new Error('Only pdf files are allowed!'), false);
   }
   cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: pdfFilter,
    limits: { fileSize: 10*1024*1024 }
}).single('file')


class KebijakanController {
    constructor() {

    }

    GetAllKebijakan(req, res) {
        Kebijakan
            .find()
            .then((result) => {
                res.json({message: "Berhasil mendapatkan data kebijakan pemerintah", data: result, token: req.token})
            })
            .catch((err) => {
                res.json({err: err});
            })
    }

    GetOneKebijakan(req, res) {
        Kebijakan
            .findOne({
                _id:req.params.id
            })
            .then((result) => {
                res.json({message: 'Berhasil mendapatkan data kebijakan pemerintah', data: result, token: req.token});
            })
            .catch((err) => {
                res.json({message: 'Gagal mendapatkan data kebijakan pemerintah', err: err});
            })
    }

    CreateNewKebijakan(req, res) {
        upload(req, res, (err) => {
            if(req.file.fileValidateError) {
                res.json({message: 'kudu pdf', token: req.token});
            }
            else if(err) {
                if(err.code == 'LIMIT_FILE_SIZE') {
                    res.json({message: err.code, token: req.token});
                } else {
                    res.json({message: err.code, token: req.token});
                }
            } else {
                var kebijakan = new Kebijakan();
                kebijakan.nomor = req.body.nomor;
                kebijakan.judul = req.body.judul;
                kebijakan.isi = req.body.isi;
                kebijakan.file = req.file.filename;
                kebijakan.status = 0;
                kebijakan.save((err) => {
                    if(err) {
                        res.json({message: 'gagal update data di ', token: req.token});
                    } else {
                        res.json({message:'Berhasil menambahkan kebijakan baru', data: kebijakan, token: req.token});
                    }
                })
            }
        })
    }

    BroadcastKebijakan(req, res) {
        if(req.body.apps == null && req.body.role == null) {
            res.json({message: 'tolong tentukan target penerima terlebih dahulu'});
        }
        else {
            Kebijakan
                .findOne({
                    _id:req.params.id
                })
                .then((result) => {
                    result.to = req.body.role;
                    result.dateSent = Date.now();
                    result.apps = req.body.apps;
                    result.from = 2;
                    result.status = 1;
                    result.save()
                        .then((result) => {
                            if(req.body.apps['Email']) {
                                Email.EmailController.sendBroadcast(req, res, result);
                            } else {
                                res.json({message: 'berhasil mempublikasikan kebijakan'});
                            }
                        })
                        .catch((err) => {
                            res.json({message: 'Tidak dapat mengupdate kebijakan tersebut'});
                        })
                })
                .catch((err) => {
                    res.json({message: 'tidak ada kebijakan tersebut'});
                })
        }
    }

    DeleteKebijakan(req, res) {
        Kebijakan.findOne({
            _id: req.params.id
        })
        .then((result) => {
            fs.unlink(__dirname + '/../public/kebijakanfile/' + result.file);
            result.remove();
            res.json({message: 'Berhasil menghapus data kebijakan', token: req.token});
        })
        .catch((err) => {
            res.json({message: 'Tidak dapat mendapatkan data kebijakan', err: err, token: req.token});
        })
    }
}

module.exports = new KebijakanController;