var express			=	require('express');
var app				=	express();
var User            =	require('./models/userModel');
var jualanRouter	=	require('./routes/jualanRouter.js');
var userRouter		=	require('./routes/userRouter.js');
var authRouter		=	require('./routes/auth.js');
var regRouter		=	require('./routes/regRouter.js');
var aspirasiRouter	=	require('./routes/aspirasiRouter.js');
var produksiRouter	=	require('./routes/produksiRouter.js');
var multer	 		= 	require('multer');
var mongoose		=	require('mongoose');
var bodyParser		=	require('body-parser');
var morgan 			= 	require('morgan');
var fs 				=	require('fs');
var jwt    			= 	require('jsonwebtoken');
var config 			= 	require('./config');
var moment 			=	require('moment');
var tz 				=	require('moment-timezone');


//modul 3 & 4
var masy 			=	require('./routes/masyarakat/masyRouter');
var email			=	require('./routes/mailgun');
var setKomoditas	=	require('./routes/pemerintah/setKomoditasRouter');
var forgetPassword	=	require('./routes/forgetPasswordRouter');
//nyoba sendgrid
//var smtp 		= 	require('./routes/smtp2Router');

var port = process.env.PORT || 5000; // used to create, sign, and verify tokens
var secureRoutes 	=	express.Router();

mongoose.connect(config.connect);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token , login_type");
  next();
});
app.use(morgan('dev'));
app.listen(port);
console.log('Server start at http://localhost:' + port);

// API Routes

app.use('/api',authRouter);
app.use('/register',regRouter);


//Forget Password
app.use('/forgetPassword',forgetPassword);

//untuk masyarakat
app.use('/masyarakat',masy);
app.use('/mailgun',email);
app.use('/setKomoditas',setKomoditas);


// --- JWT Validaltion ---
app.use(function(req,res,next){
	if(req.headers.token){
		if(req.headers.login_type!=null)
		{
				// mobile login
				if(req.headers.login_type==1)
					{
						 jwt.verify(req.headers.token, config.secret, function(err, decoded) {

								    if (err)
								    {
					        			return res.json({ success: false, message: 'Failed to authenticate token.' });
					    	  		}
					    	  		else
					    	  		{
					    	  			req.token='-';
					    	  			req.role = decoded.role;
					    	  			//console.log(decoded);
					    	  			next();
					    	  		}
					    	})
						}

					else if(req.headers.login_type==0)
					{
						// website login
						jwt.verify(req.headers.token, config.secret, function(err, decoded) {
						//console.log(decoded);
						req.role = decoded.role;
								    if (err)
								    {
					        			return res.json({ success: false, message: 'Failed to authenticate token.' });
					    	  		}
					    	  		else
					    	  		{
					      	  			req.token=jwt.sign({id:decoded.id,username:decoded.username,time:decoded.time,role:decoded.role},config.secret, {
					                    expiresIn : 60*20// expires in 24 hours
					                    });
					    	  			next();
					    	  		}
					    	});
					}

		}
		else
		{
			return res.json({ success: false, message: 'Please send login_type' });
		}
		// mobile login
	}
	else
    {
    	return res.json({ success: false, message: 'Please send token' });
    }


});
// -------------upload----------------

app.post('/user/upload_photo',function(req,res,next){

		var ImageSaver = require('image-saver-nodejs/lib');
    	var imageSaver = new ImageSaver();

    	User.findOne({us_id:req.body.us_id},function(err,user){
				if(user){
					if(user.prof_pict!=null){
					fs.unlinkSync('../public_html/'+user.prof_pict);
					}
					var time=moment();
					user.prof_pict='uploads/prof_pict/pp_'+user.username+moment(time).tz('Asia/Jakarta')+".jpg";
					user.save(function(err){
						if(!err){
							imageSaver.saveFile("../public_html/"+user.prof_pict, req.body.string64).then((data)=>{
	    					res.json({status:200,message:'Change profile picture success',prof_pict:user.prof_pict});
    						})
    						.catch((err)=>{
					        	res.json({status:400,message:err});
					    	})
						}
						else
						{
							res.json({status:400,message:err});
						}
					});
				}
				else
				{
					res.json({status:404,message:'User is not found'});
				}
			})

 });
// -----------------------------------------

app.use('/user',userRouter);
app.use('/produksi',produksiRouter);
app.use('/jualan',jualanRouter);
app.use('/aspirasi',aspirasiRouter);
