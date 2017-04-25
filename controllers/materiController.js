var User 		=	require('./../models/userModel');
var Materi 		= require('./../models/materiModel');
var moment 		= require('moment');
var time		= moment();

var multer = require('multer');
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '../public_html/uploads/materi');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname.split('.')[0] + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});
var upload = multer({ //multer settings
                    storage: storage
                }).single('file');
	 
var uploadMateri = function(req,res){
	upload(req,res,function(err){
        console.log(req.file);
        if(err)
        {
             res.json({error_code:1,err_desc:err});
             return;
        }
        else
        {        
	        materi = new Materi(req.body);
			materi.user_id 	= req.user_id;	  	
			materi.datePost = Date.parse(moment(time).tz('Asia/Jakarta'));
		 	materi.file="https://ph.yippytech.com/uploads/materi/"+req.file.filename;	
			materi.save(function(err)
			{
				if(!err)
				{
					res.json({status:200,success:true,message:'Input Success',data:materi,token:req.token});
				}
				else
				{
					res.json({status:400,success:false,message:'Input Failed',token:req.token});
				}
			});	
        }
    });
	
	
}

module.exports={
	uploadMateri:uploadMateri
};