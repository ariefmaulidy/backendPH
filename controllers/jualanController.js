var Jualan 		=	require('./../models/jualanModel');
var User 		=	require('./../models/userModel');
var moment 		=	require('moment');
var each		=	require('foreach');
var fs 			=	require('fs');
var fromNow 	= 	require('from-now');
var tz 			=	require('moment-timezone');
var ImageSaver 	=	require('image-saver-nodejs/lib');

var getJualanKu = function(req,res){
	Jualan.find({us_id:req.params.id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,jualan){
					if(jualan!='')
							{ var counter = 0;
									each(jualan,function(value,key,array){
										User.findOne({us_id:jualan[key].us_id}).exec(function(err,user){
										jualan[key].time=fromNow(jualan[key].datePost);
										counter++;
										if(counter==jualan.length)
											{									
							 					res.json({status:200,message:'Get data success',data:jualan});		
											}
										});
									})			
								}
				else
				{
					res.json({status:404,message:"No data provided"});
				}
			})
}
var getAll = function(req,res){
	Jualan.find({},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,jualan){
					if(jualan!='')
							{ var counter = 0;
									each(jualan,function(value,key,array){
										User.findOne({us_id:jualan[key].us_id}).exec(function(err,user){
										jualan[key].nama=user.name;
										jualan[key].prof_pict=user.prof_pict;
										jualan[key].address=user.address;
										jualan[key].time=fromNow(jualan[key].datePost);
										counter++;
										if(counter==jualan.length)
											{									
							 					res.json({status:200,message:'Get data success',data:jualan});		
											}
										});
									})			
								}
				else
				{
					res.json({status:404,message:"No data provided"});
				}
			})
}
var postJualan = function(req,res){
		jualan = new Jualan(req.body);
		var imageSaver = new ImageSaver();
	  	var time=moment();
	  	if(req.body.string64!=null){
	  		jualan.foto_komoditas="uploads/foto_komoditas/"+req.body.us_id+"_"+req.body.komoditas+"_"+Date.parse(moment(time).tz('Asia/Jakarta'))+".jpg";	
				imageSaver.saveFile("../public_html/"+jualan.foto_komoditas, req.body.string64)
					.then((data)=>{
						console.log("upload photo success"); 
			    		})
		    		.catch((err)=>{
						res.json({status:400,message:err});
						})
	  	}
	  	jualan.datePost = Date.parse(moment(time).tz('Asia/Jakarta')); 
		jualan.save(function(err)
		{
			if(!err)
			{
				res.json({status:200,success:true,message:'Input Success',data:jualan});
			}
			else
			{
				res.json({status:400,success:false,message:'Input Failed'});
			}
		});
}
	// komoditas:String,
	// us_id:String,
	// harga:String,
	// foto_komoditas:String,
	// datePost:String,
	// stok:String
var updateJualan = function(req,res){
	Jualan.findOne({jualan_id:req.body.jualan_id},function(err,jualan){
		if(jualan!=null){
			if(jualan.us_id==req.body.us_id){
				var time=moment();
				jualan.komoditas 		=	req.body.komoditas;
				jualan.harga			=	req.body.harga;
				jualan.stok				= 	req.body.stok;
				jualan.satuan_harga		=	req.body.satuan_harga;
				jualan.satuan_stok		= 	req.body.satuan_stok;
				jualan.foto_komoditas	= 	jualan.foto_komoditas;
				jualan.datePost 		= 	Date.parse(moment(time).tz('Asia/Jakarta')); 
				if(req.body.string64!=null){
					if(jualan.foto_komoditas!=null){
						fs.unlinkSync('../public_html/'+jualan.foto_komoditas);
						jualan.foto_komoditas="uploads/foto_komoditas/"+req.body.us_id+"_"+req.body.komoditas+"_"+moment(time).tz('Asia/Jakarta')+".jpg";	
						imageSaver.saveFile("../public_html/"+jualan.foto_komoditas, req.body.string64)
						.then((data)=>{
							console.log("upload photo success"); 
				    		})
			    		.catch((err)=>{
							res.json({status:400,message:err});
							})
						}
		  			}
		  		jualan.save(function(err)
				{
					if(!err)
					{
						res.json({status:200,success:true,message:'Update Success',data:jualan});
					}
					else
					{
						res.json({status:400,success:false,message:'Update Failed'});
					}
				});
			}
			else
			{
				res.status(403).json({status:403,message:"Forbidden"});
			}
			
		}
		else
		{
			res.status(404).json({status:404,message:"Not Found"});
		}
	})
}

var delJualan = function(req,res){
	Jualan.findOne({jualan_id:req.body.jualan_id},function(err,jualan){
	//	res.json({aspirasi});
		if(jualan!=null)
		{
			if(jualan.foto_komoditas!=null && jualan.us_id==req.body.us_id){
					fs.unlinkSync('../public_html/'+jualan.foto_komoditas);
					}
			jualan.remove(function(err){
				if(jualan.us_id==req.body.us_id){
					res.status(200).json({status:200,message:"delete success"});
				}
				else{
					res.status(403).json({status:403,message:"Forbidden"});
				}
			})
		}
		else
		{
			res.status(404).json({status:404,message:"Not Found"});
		}
	})
}

module.exports={
	getAll:getAll,
	postJualan:postJualan,
	updateJualan:updateJualan,
	getJualanKu:getJualanKu,
	delJualan:delJualan
};

	