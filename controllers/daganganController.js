var Dagangan 	=	require('./../models/daganganModel');
var User 		=	require('./../models/userModel');
var moment 		=	require('moment');
var each		=	require('foreach');
var fs 			=	require('fs');
var fromNow 	= 	require('from-now');
var tz 			=	require('moment-timezone');
var ImageSaver 	=	require('image-saver-nodejs/lib');

var getDaganganKu = function(req,res){
	Dagangan.find({user_id:req.params.id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,dagangan){
					if(dagangan!='')
							{ var counter = 0;
									each(dagangan,function(value,key,array){
										User.findOne({user_id:dagangan[key].user_id}).exec(function(err,user){
										dagangan[key].time=fromNow(dagangan[key].datePost);
										counter++;
										if(counter==dagangan.length)
											{									
							 					res.json({status:200,message:'Get data success',data:dagangan});		
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
	Dagangan.find({},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,dagangan){
					if(dagangan!='')
							{ var counter = 0;
									each(dagangan,function(value,key,array){
										User.findOne({user_id:dagangan[key].user_id}).exec(function(err,user){
										dagangan[key].nama=user.name;
										dagangan[key].picture=user.picture;
										dagangan[key].address=user.address;
										dagangan[key].time=fromNow(dagangan[key].datePost);
										counter++;
										if(counter==dagangan.length)
											{									
							 					res.json({status:200,message:'Get data success',data:dagangan});		
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
var postDagangan = function(req,res){
		dagangan = new Dagangan(req.body);
		var imageSaver = new ImageSaver();
	  	var time=moment();
	  	if(req.body.string64!=null){
	  		dagangan.picture="uploads/foto_komoditas/"+req.body.user_id+"_"+req.body.komoditas_id+"_"+Date.parse(moment(time).tz('Asia/Jakarta'))+".jpg";	
				imageSaver.saveFile("../public_html/"+dagangan.picture, req.body.string64)
					.then((data)=>{
						console.log("upload photo success"); 
			    		})
		    		.catch((err)=>{
						res.json({status:400,message:err});
						})
	  	}
	  	dagangan.datePost = Date.parse(moment(time).tz('Asia/Jakarta')); 
		dagangan.save(function(err)
		{
			if(!err)
			{
				res.json({status:200,success:true,message:'Input Success',data:dagangan});
			}
			else
			{
				res.json({status:400,success:false,message:'Input Failed'});
			}
		});
}
	// komoditas:String,
	// user_id:String,
	// harga:String,
	// picture:String,
	// datePost:String,
	// stok:String
var updateDagangan = function(req,res){
	Dagangan.findOne({dagangan_id:req.body.dagangan_id},function(err,dagangan){
		if(dagangan!=null){
			if(dagangan.user_id==req.body.user_id){
				var time=moment();
				dagangan.komoditas_id 		=	req.body.komoditas_id;
				dagangan.harga				=	req.body.harga;
				dagangan.stok				= 	req.body.stok;
				dagangan.picture			= 	dagangan.picture;
				dagangan.datePost 			= 	Date.parse(moment(time).tz('Asia/Jakarta')); 
				if(req.body.string64!=null){
					if(dagangan.picture!=null){
						fs.unlinkSync('../public_html/'+dagangan.picture);
						dagangan.picture="uploads/foto_komoditas/"+req.body.user_id+"_"+req.body.komoditas+"_"+moment(time).tz('Asia/Jakarta')+".jpg";	
						imageSaver.saveFile("../public_html/"+dagangan.picture, req.body.string64)
						.then((data)=>{
							console.log("upload photo success"); 
				    		})
			    		.catch((err)=>{
							res.json({status:400,message:err});
							})
						}
		  			}
		  		dagangan.save(function(err)
				{
					if(!err)
					{
						res.json({status:200,success:true,message:'Update Success',data:dagangan});
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

var delDagangan = function(req,res){
	Dagangan.findOne({dagangan_id:req.body.dagangan_id},function(err,dagangan){
	//	res.json({aspirasi});
		if(dagangan!=null)
		{
			if(dagangan.picture!=null && dagangan.user_id==req.body.user_id){
					fs.unlinkSync('../public_html/'+dagangan.picture);
					}
			dagangan.remove(function(err){
				if(dagangan.user_id==req.body.user_id){
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
	postDagangan:postDagangan,
	updateDagangan:updateDagangan,
	getDaganganKu:getDaganganKu,
	delDagangan:delDagangan
};

	