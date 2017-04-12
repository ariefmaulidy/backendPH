var Dagangan 	=	require('./../models/daganganModel');
var User 		=	require('./../models/userModel');
var Komoditas 	= 	require('./../models/komoditasModel');
var moment 		=	require('moment');
var each		=	require('foreach');
var fs 			=	require('fs');
var fromNow 	= 	require('from-now');
var tz 			=	require('moment-timezone');
var ImageSaver 	=	require('image-saver-nodejs/lib');

// get all dagangans from this user_id
var getDaganganKu = function(req,res){

	// find dagangan model and using lean() for adding new field in this model 
	Dagangan.find({user_id:req.params.user_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,dagangan)
	{
		if(dagangan!='')
		{ 
			each(dagangan,function(value,key,array){
				//lookup user data in user model
				User.findOne({user_id:dagangan[key].user_id}).exec(function(err,user)
				{
					dagangan[key].user_picture=user.picture;
					dagangan[key].nama=user.name;
					dagangan[key].address=user.address;
					dagangan[key].user_nomor_telepon=user.nomor_telepon;	
					dagangan[key].time=fromNow(dagangan[key].datePost);
					dagangan[key].datePost=moment(dagangan[key].datePost).format("DD MMMM YYYY hh:mm a");;

				});
				//lookup komoditas data in komoditas model
				Komoditas.findOne({komoditas_id:dagangan[key].komoditas_id}).exec(function(err,komoditas)
				{
					if(komoditas!=null)
					{
						dagangan[key].nama_komoditas=komoditas.name;
						dagangan[key].satuan_komoditas=komoditas.satuan;
						counter++;		
					}
				});
			})
			// send response after 100 ms
			setTimeout(function()
			{
				res.json({status:200,message:'Get data success',data:dagangan,token:req.token});		
			},100);		
		}
		//if there is no data in this model
		else
		{
			res.json({status:204,message:"No data provided",token:req.token});
		}
	})
}
var getAll = function(req,res){
	Dagangan.find({},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,dagangan){
	if(dagangan!='')
			{ var counter = 0;
					each(dagangan,function(value,key,array){
						//lookup user data in user model
						User.findOne({user_id:dagangan[key].user_id}).exec(function(err,user)
						{
							dagangan[key].nama=user.name;
							dagangan[key].address=user.address;
							dagangan[key].user_picture=user.picture;
							dagangan[key].user_nomor_telepon=user.nomor_telepon;	
							dagangan[key].time=fromNow(dagangan[key].datePost);
							dagangan[key].datePost=moment(dagangan[key].datePost).format("DD MMMM YYYY hh:mm a");
						});
						//lookup komoditas data in komoditas model
						Komoditas.findOne({komoditas_id:dagangan[key].komoditas_id}).exec(function(err,komoditas)
						{
							if(komoditas!=null)
							{
								dagangan[key].nama_komoditas=komoditas.name;
								dagangan[key].satuan_komoditas=komoditas.satuan;
								counter++;		
							}
						});
					})
					setTimeout(function()
					{
						res.json({status:200,message:'Get data success',data:dagangan,token:req.token});		
					},100);		
			}
			else
			{
				res.json({status:204,message:"No data provided",token:req.token});
			}
		})
}
var postDagangan = function(req,res){
		dagangan = new Dagangan(req.body);
		dagangan.user_id = req.user_id;
	  	var time=moment();
	  	dagangan.datePost 	= 	Date.parse(moment(time).tz('Asia/Jakarta'));
		var imageSaver 		= 	new ImageSaver();
		var pictname		=	req.user_id+"_"+req.body.komoditas_id+"_"+Date.parse(moment(time).tz('Asia/Jakarta'))+".jpg";
	  	if(req.body.picture!=null){
	  		dagangan.picture="https://ph.yippytech.com/uploads/foto_komoditas/"+pictname;	
				imageSaver.saveFile("../public_html/uploads/foto_komoditas/"+pictname, req.body.picture)
					.then((data)=>{
						console.log("upload photo success"); 
			    		})
		    		.catch((err)=>{
						res.json({status:400,message:err});
						})
	  	} 
		dagangan.save(function(err)
		{
			if(!err)
			{
				res.json({status:200,success:true,message:'Input Success',data:dagangan,token:req.token});
			}
			else
			{
				res.json({status:400,success:false,message:'Input Failed',token:req.token});
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
			if(dagangan.user_id==req.user_id){
				var time=moment();
				var imageSaver = new ImageSaver();
				dagangan.komoditas_id 		=	req.body.komoditas_id;
				dagangan.harga				=	req.body.harga;
				dagangan.keterangan			=	req.body.keterangan;
				dagangan.picture			= 	dagangan.picture;
				dagangan.stok				= 	req.body.stok;
				dagangan.datePost 			= 	Date.parse(moment(time).tz('Asia/Jakarta')); 
				var pictname				=	req.user_id+"_"+req.body.komoditas_id+"_"+Date.parse(moment(time).tz('Asia/Jakarta'))+".jpg";
				if(req.body.picture!=null){
					if(dagangan.picture!=null)
					{
						fs.unlinkSync('../public_html/foto_komoditas/'+dagangan.picture);
					}	
			  		dagangan.picture="https://ph.yippytech.com/uploads/foto_komoditas/"+pictname;	
					imageSaver.saveFile("../public_html/uploads/foto_komoditas/"+pictname,req.body.picture)
					.then((data)=>{
						console.log("upload photo success"); 
			    		})
		    		.catch((err)=>{
						res.json({status:400,message:err,token:req.token});
						})	
		  			}
		  		dagangan.save(function(err)
				{
					if(!err)
					{
						res.json({status:200,success:true,message:'Update Success',data:dagangan,token:req.token});
					}
					else
					{
						res.json({status:400,success:false,message:'Update Failed',token:req.token});
					}
				});
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

var delDagangan = function(req,res){
	Dagangan.findOne({dagangan_id:req.body.dagangan_id},function(err,dagangan){
	//	res.json({aspirasi});
	//	console.log(dagangan);
		if(dagangan!=null) 
		{ 
			if(dagangan.user_id==req.user_id || req.role==1)
			{
				if(dagangan.picture!=null && dagangan.user_id==req.user_id)
				{
					fs.unlinkSync('../public_html/'+dagangan.picture);
				}
				dagangan.remove(function(err){
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
		else if(dagangan==null)
		{
			res.status(204).json({status:204,message:"Not Found",token:req.token});
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

	