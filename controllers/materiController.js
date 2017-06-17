var User 		=	require('./../models/userModel');
var Materi 		= require('./../models/materiModel');
var moment 		= require('moment');
var fs 			= require('fs');
//looping module
var each = require('foreach');
var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '../public_html/uploads/materi');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname.split('.')[0] +'_'+ datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
    
});
const pdfFilter = function (req, file, cb) {
     //accept pdf only
    if (!file.originalname.match(/\.(pdf)$/)) {
        return cb(new Error('Only pdf files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter: pdfFilter
                }).single('file');
	 
var addMateri = function(req,res){
if(req.role==1||req.role==2||req.role==3)
	{
		upload(req,res,function(err)
		{
	        if(req.file!=null)
	        {   
	        	materi = new Materi(req.body);
		        materi.user_id=req.user_id;
				materi.file="https://ph.yippytech.com/uploads/materi/"+req.file.filename;	
		        var time=moment();
				materi.datePost = Date.parse(moment(time).tz('Asia/Jakarta'));
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
				})
	        }
	        else
	        {
		     	materi = new Materi(req.body);
		        materi.user_id=req.user_id;
				var time=moment();
				materi.datePost = Date.parse(moment(time).tz('Asia/Jakarta'));
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
				})		
	        }		
		});
	}
	else
	{
		res.json({status:403,message:"Forbidden access for this user",token:req.token});
	}
}


var getAllMateri = function(req,res){
	Materi.find({},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,materi){

		if(materi!='')
		{
			each(materi,function(value,key,array)
			{	
				User.findOne({user_id:materi[key].user_id},function(err,user){
					if(user!=null){
						materi[key].name=user.name;
						materi[key].datePost=moment(materi[key].datePost).format("DD MMMM YYYY hh:mm a");
					}	
				})
				
			});
			setTimeout(function()
			{
				res.json({status:200,success:true,message:'Get data success',data:materi,token:req.token});
			},50);
		}
		else
		{
			res.status(204).json({status:204,success:true,message:'No data provided',data:materi,token:req.token});	
		}
	})
}

var getOneMateri = function(req,res){
	Materi.findOne({materi_id:req.params.materi_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,materi){

		if(materi!=null)
		{
				User.findOne({user_id:materi.user_id},function(err,user){
					if(user!=null){
						materi.name=user.name;
						materi.datePost=moment(materi.datePost).format("DD MMMM YYYY hh:mm a");
					}	
				})				
			setTimeout(function()
			{
				res.json({status:200,success:true,message:'Get data success',data:materi,token:req.token});
			},50);
		}
		else
		{
			res.status(204).json({status:204,success:true,message:'No data provided',data:materi,token:req.token});	
		}
	})
}

var getMateriKu = function(req,res){
	Materi.find({user_id:req.params.user_id},function(err,materi){
		if(materi!='')
		{			
			each(materi,function(value,key,array)
			{	
				User.findOne({user_id:materi[key].user_id},function(err,user){
					if(user!=null){
						materi[key].name=user.name;
						materi[key].datePost=moment(materi[key].datePost).format("DD MMMM YYYY hh:mm a");
					}	
				})
				
			});
			setTimeout(function()
			{
				res.json({status:200,success:true,message:'Get data success',data:materi,token:req.token});
			},50);
		}
		else
		{
			res.status(204).json({status:204,success:true,message:'No data provided',data:materi,token:req.token});	
		}
	})
}

var updateMateri = function(req,res){
	if(req.role==1||req.role==2||req.role==3)
	{
		upload(req,res,function(err)
		{
	        if(req.file!=null)
	        {
				Materi.findOne({materi_id:req.body.materi_id},function(err,materi){
					if(materi!=null){
						if(materi.user_id==req.user_id || req.role==2 || req.role==1)
						{
							if(materi.file!=null)
							{
								var del_file=materi.file.split('https://ph.yippytech.com/uploads/materi/')[1];
								fs.unlinkSync('../public_html/uploads/materi/'+del_file);
							}
							materi.file="https://ph.yippytech.com/uploads/materi/"+req.file.filename;				
							var time=moment();
							materi.judul				=	req.body.judul;
							materi.keterangan			=	req.body.keterangan;
							materi.datePost 			= 	Date.parse(moment(time).tz('Asia/Jakarta')); 
							
					  		setTimeout(function()
							{
								materi.save(function(err)
								{
									if(!err)
									{
										res.json({status:200,success:true,message:'Update Success',data:materi,token:req.token});
									}
									else
									{
										res.json({status:400,success:false,message:'Update Failed',token:req.token});
									}
								});
							},100);		  		
						}
						else
						{
							res.status(403).json({status:403,message:"Forbidden",token:req.token});
						}
					}
					else
					{
						res.status(204).json({status:204,message:"Not Found",token:req.token});
					}
				})	             
	        }
	        else
	        {
				Materi.findOne({materi_id:req.body.materi_id},function(err,materi){
					if(materi!=null){
						if(materi.user_id==req.user_id || req.role==2 || req.role==1)
						{
							var time=moment();
							materi.judul				=	req.body.judul;
							materi.keterangan			=	req.body.keterangan;
							materi.datePost 			= 	Date.parse(moment(time).tz('Asia/Jakarta')); 
							
					  		setTimeout(function()
							{
								materi.save(function(err)
								{
									if(!err)
									{
										res.json({status:200,success:true,message:'Update Success',data:materi,token:req.token});
									}
									else
									{
										res.json({status:400,success:false,message:'Update Failed',token:req.token});
									}
								});
							},100);		  		
						}
						else
						{
							res.status(403).json({status:403,message:"Forbidden",token:req.token});
						}
					}
					else
					{
						res.status(204).json({status:204,message:"Not Found",token:req.token});
					}
				})	 
	        }
		})	
	}
	else
	{
		res.status(403).json({status:403,message:"Forbidden access for this user",token:req.token});
	}
}
var delMateri = function(req,res){
if(req.role==1||req.role==2||req.role==3)
{
	Materi.findOne({materi_id:req.body.materi_id},function(err,materi){
	//	res.json({materi});
	//	console.log(materi);
		if(materi!=null) 
		{ 
			if(materi.user_id==req.user_id || req.role==2 || req.role==1)
			{
				if(materi.file!=null)
				{
					var del_file=materi.file.split('https://ph.yippytech.com/uploads/materi/')[1];
					fs.unlinkSync('../public_html/uploads/materi/'+del_file);
				}
				materi.remove(function(err){
					if(!err)
					{
						res.status(200).json({status:200,message:"delete success",token:req.token});
					}
					else
					{
						res.status(403).json({status:403,message:err,token:req.token});
					}
				})
			}
			else
			{
				res.status(403).json({status:403,message:"Forbidden",token:req.token});
			}
		}
		else
		{
			setTimeout(function() {
			res.status(204).json({status:204,message:"Not Found",token:req.token});	
			}, 10);
		}
	})
}
else
{
	res.status(403).json({status:403,message:"Forbidden access for this user",token:req.token});
}
}

module.exports={
	addMateri:addMateri,
	getAllMateri:getAllMateri,
	getMateriKu:getMateriKu,
	getOneMateri:getOneMateri,
	delMateri:delMateri,
	updateMateri:updateMateri
};