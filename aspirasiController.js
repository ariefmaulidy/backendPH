// import require model
var Aspirasi=require('./../models/aspirasiModel');
var User=require('./../models/userModel');

// import module //

// time module
var moment=require('moment');
var tz=require('moment-timezone');
var fromNow = require('from-now');

//looping module
var each = require('foreach');


var check = function(role) {
	if(role==1 || role==2 || role==5) return true;
	else return false;
}

// var testAspirasi = function(req,res){
// 	var page=req.params.page=null ? 0:req.params.page;
// 	Aspirasi.find({},'-_id -__v',{sort:{datePost:-1},skip:2*page, limit:2}).lean().exec(function(err,result){
// 	setTimeout(function(){
// 		res.json({data:result});
// 		},100);	
// 	})
// }

// get all aspirasis, sort by last post
var allAspirasi = function(req,res){
	var page=req.params.page=null ? 0:req.params.page;
	Aspirasi.find({},'-_id -__v',{sort:{datePost:-1},skip:2*page, limit:2}).lean().exec(function(err,aspirasi){
	if(aspirasi!='')
	{ 	
		//looping all aspirasi
				each(aspirasi,function(value,key,array)
				{
					// find name, profile picture from user_id
					User.findOne({user_id:aspirasi[key].user_id}).exec(function(err,user){
					aspirasi[key].name=user.name;
					aspirasi[key].picture=user.picture;
					aspirasi[key].time=fromNow(aspirasi[key].datePost);
					aspirasi[key].datePost=moment(aspirasi[key].datePost).format("DD MMMM YYYY hh:mm a");;
					aspirasi[key].total_pendukung=aspirasi[key].pendukung.length;
					//aspirasi[key].datePost= Date.parse('2014-04-03');
					
					// initial value status voted, for checking which user that already voted an aspirasi
					aspirasi[key].status_voted=false;
					// checking voted logic
					for(var i=0;i<aspirasi[key].pendukung.length;i++)
					{
						if(aspirasi[key].pendukung[i].user_id==req.user_id)
						{
							aspirasi[key].status_voted=true;
						}
						else if(aspirasi[key].pendukung.length==0)
						{
							aspirasi[key].status_voted=false;
						}

					}	
					});
				})			
				setTimeout(function()
				{
					res.json({status:200,message:'Get data success',data:aspirasi,token:req.token});				
				},100);
				
		}
		// if there is no aspirasi data 
		else
		{
			res.json({status:204,message:'No data provided'});
		}
			
	});
}

// find all aspirasi from specific user_id
var aspirasiKu = function(req,res){
	Aspirasi.find({user_id:req.params.user_id},'-_id -__v',{sort:{datePost:-1}}).lean().exec(function(err,aspirasi){
		if(aspirasi.length!=0)
		{ 
			//looping all aspirasi
			each(aspirasi,function(value,key,array){
			// find name, profile picture from user_id
				User.findOne({user_id:aspirasi[key].user_id}.sort).exec(function(err,user){
				aspirasi[key].name=user.name;
				aspirasi[key].picture=user.picture;
				// calculate lapse of time when user posted this aspirasi until today
				aspirasi[key].time=fromNow(aspirasi[key].datePost);
				aspirasi[key].datePost=moment(aspirasi[key].datePost).format("DD MMMM YYYY hh:mm a");;
				// count all pendukung from this aspirasi_id
				aspirasi[key].total_pendukung=aspirasi[key].pendukung.length;
				});
			})
			setTimeout(function()
			{
				res.json({status:200,message:'Get data success',data:aspirasi,token:req.token});				
			},100);			
		}
		else
		{
			res.json({status:204,message:'No data provided',token:req.token});
		}
						
	});
}

// to get pendukung data from one aspirasi document
var getPendukung = function(req,res)
{
	//get one aspirasi document of this aspirasi_id
	Aspirasi.findOne({aspirasi_id:req.params.aspirasi_id}).lean().exec(function(err,aspirasi){
	if(aspirasi!=null)
	{ 	
		//initiate an array for collect all pendukung
		var pendukungKu=[];
		//loop all pendukung inside aspirasi model to get their name and profile picture
		each(aspirasi.pendukung,function(value,key,array)
		{
			User.findOne({user_id:value.user_id},'name picture -_id',function(err,user)
			{
				if(user!=null)
				{
					// input user data to array
					pendukungKu.push(user);
				}
			});
		})

		setTimeout(function()
		{
			//if pendukungKu is not empty, show it's values
			if(pendukungKu!='')
			{
				res.json({status:200,message:'Get data success',data:pendukungKu,token:req.token});		
			}
			//if there is no pendukung
			else 
			{
				res.json({status:204,message:'No data provided',token:req.token});		
			}				
		},100);										
	}
	//if API consumer give a wrong aspirasi_id (there is no this aspirasi_id in DB)
	else
	{
		res.json({status:403,message:'Wrong aspirasi_id',token:req.token});
	}	
		
			
	});	
}

// to cancel voted or unvote an aspirasi
var batalDukung = function(req,res){
	if(req.role==1||req.role==4)
	{
		//using $pull to erase data inside array JSON
		Aspirasi.update( 
      { aspirasi_id: req.body.aspirasi_id },
      { $pull: { pendukung : { user_id : req.user_id } } },
      { safe: true },
      function(err, aspirasi) {
        console.log(err);
        if(!err)
        {
	        res.json({status:200,message:'Delete vote success',token:req.token});
        }
        else
        {
        	res.json({status:400,message:err,token:req.token});	
        }  
      });

    }  				
}

// add new aspirasi
var postAspirasi = function(req,res){
	//input data for aspirasi model from body request
	aspirasi = new Aspirasi(req.body);
	// input user_id from decoded JWT
	aspirasi.user_id=req.user_id;
  	// input datePost with today time, in integer for easy sorting purpose 
  	var time=moment();
	aspirasi.datePost = Date.parse(moment(time).tz('Asia/Jakarta')); 
	aspirasi.save(function(err)
	{
		if(!err)
		{
			res.json({status:200,success:true,message:'Input Success',data:aspirasi,token:req.token});
		}
		else
		{

			res.json({status:400,success:false,message:err,token:req.token});
		}
	}); 
}

// update an aspirasi
var updateAspirasi = function(req,res)
{
	Aspirasi.findOne({aspirasi_id:req.body.aspirasi_id},function(err,aspirasi)
	{
		if( aspirasi!=null )
		{
			// for admin and aspirasi owner only 
			if( req.role==1 || ( req.role==4 && aspirasi.user_id==req.user_id ) ) 
			{
				aspirasi.subjek		=	req.body.subjek;
				aspirasi.isi		=	req.body.isi;
				var time 			=	moment();
				aspirasi.datePost 	= 	Date.parse(moment(time).tz('Asia/Jakarta')); 
				aspirasi.save(function(err)
				{
					if(!err)
					{
						res.json({status:200,message:"update success",data:aspirasi,token:req.token});
					}
					else
					{
						res.json({status:400,message:"Bad request",token:req.token});
					}
				})	
			}
			//if user has no access to this request
			else
			{
				res.json({status:403,message:"Forbidden access for this user",token:req.token});
			}	
		}
		//if API consumer give a wrong aspirasi_id (there is no this aspirasi_id in DB)
		else 
		{
				res.json({status:400,message:"Wrong aspirasi_id",token:req.token});	
		}
	})
}

// delete an aspirasi
var delAspirasi = function(req,res){
	Aspirasi.findOne({aspirasi_id:req.body.aspirasi_id},function(err,aspirasi){
	//	res.json({aspirasi});
		if( aspirasi!=null )
		{
			// for admin and aspirasi owner only 
			if( req.role==1 || ( req.role==4 && aspirasi.user_id==req.user_id ) ) 
			{
				aspirasi.remove(function(err){
					if(!err)
					{
						res.status(200).json({status:200,message:"delete success",token:req.token});
					}
					//if user has no access to this request
					else
					{
						res.status(400).json({status:400,message:err,token:req.token});
					}
				})
			}
			else
			{
				res.status(403).json({status:403,message:"Forbidden",token:req.token});
			}
		}
		//if API consumer give a wrong aspirasi_id (there is no this aspirasi_id in DB)
		else 
		{
				res.json({status:400,message:"Wrong aspirasi_id",token:req.token});	
		}
	})
}

// vote an aspirasi
var dukung_aspirasi = function(req,res)
{
	Aspirasi.findOne({aspirasi_id:req.body.aspirasi_id}).exec(function(err,aspirasi)
	{
		if( aspirasi!=null )
		{
			// check user whether he is the owner or not, 
			if( aspirasi.user_id != req.user_id  && ( req.role==1 || req.role==4 ) )
				{ 
					// directly add vote if there is no pendukung
					if(aspirasi.pendukung.length!=0)
					{

						// initiate for checking user vote status, wheter he already voted or not
						status_voted=false;
						each(aspirasi.pendukung,function(value,key,array)
						{
							// check if this user_id same with user_id in pendukung, status_voted become true
							if(value.user_id==req.user_id || aspirasi.user_id==req.user_id)
							{
								status_voted=true;
							}
						})
						setTimeout(function()
						{
							// if user hasn't voted yet (no match this user_id in pendukung), push this user_id into pendukung Json Array.
							if(status_voted==false)
							{	
								aspirasi.pendukung.push({user_id:req.user_id});
									aspirasi.save(function(err)
									{
									if(!err){
										res.status(200).json({status:200,message:"Vote success",data:aspirasi,token:req.token});
									}
									else
									{
										res.status(400).json({status:400,message:err,token:req.token});
									}
								});
							}
							// if user already voted, show this message
							else
							{
								res.status(400).json({status:400,message:"User already voted or user is this aspirasi's owner",token:req.token});
							}				
						},100);
					}
					// directly add vote if there is no pendukung
					else
					{
						aspirasi.pendukung.push({user_id:req.user_id});
						console.log(aspirasi);
							aspirasi.save(function(err)
							{
							if(!err)
							{
								res.status(200).json({status:200,message:"Vote success",data:aspirasi,token:req.token});
							}
							else{
								res.status(400).json({status:400,message:"Bad request",token:req.token});
							}
						});			
					}
				}
				// user has no access for this request, show Forbidden message
				else
				{
					res.status(403).json({status:400,message:"Forbidden, user has no access or user is the owner of this aspirasi",token:req.token});
				}
		}
		else
		{
			//if API consumer give a wrong aspirasi_id (there is no this aspirasi_id in DB)
			res.json({status:400,message:"Wrong aspirasi_id",token:req.token});	
		}
	})
}

module.exports = {
	testAspirasi:testAspirasi,
	allAspirasi:allAspirasi,
	aspirasiKu:aspirasiKu,
	updateAspirasi:updateAspirasi,
	batalDukung:batalDukung,
	getPendukung:getPendukung,
	postAspirasi:postAspirasi,
	delAspirasi:delAspirasi,
	dukung_aspirasi:dukung_aspirasi
}
