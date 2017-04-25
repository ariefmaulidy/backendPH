var User 		=	require('./../models/userModel');
var Materi 		= require('./../models/materiModel');
var ImageSaver 	= require('image-saver-nodejs/lib');
var moment 		= require('moment');
var time		= moment();

var uploadMateri = function(req,res){
	materi = new Materi(req.body);
	materi.user_id 	= req.user_id;	  	
	materi.datePost = Date.parse(moment(time).tz('Asia/Jakarta'));
	var materiSaver = new ImageSaver();
	var materiName	= req.user_id+"_"+req.body.judul+"_"+materi.datePost+".pdf";
	  	if(req.body.file!=null){
	  		materi.file="https://ph.yippytech.com/uploads/materi/"+materiName;	
				materiSaver.saveFile("../public_html/uploads/materi/"+materiName, req.body.file)
					.then((data)=>{
						console.log("upload file success"); 
			    		})
		    		.catch((err)=>{
						res.json({status:400,message:err});
						})
	  	} 
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

module.exports={
	uploadMateri:uploadMateri
};