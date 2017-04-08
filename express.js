var express						=	require('express');
var app							=	express();
var User            			=	require('./models/userModel');
var daganganRouter				=	require('./routes/daganganRouter.js');
var userRouter					=	require('./routes/userRouter.js');
var authRouter					=	require('./routes/auth.js');
var registerRouter				=	require('./routes/registerRouter.js');
var aspirasiRouter				=	require('./routes/aspirasiRouter.js');
var produksiRouter				=	require('./routes/produksiRouter.js');
var komoditasRouter 			= 	require('./routes/komoditasRouter');
var laporanHargaRouter 			= 	require('./routes/laporanHargaRouter');
var forgetPasswordRouter		= 	require('./routes/forgetPasswordRouter');
var multer	 					= 	require('multer');
var mongoose					=	require('mongoose');
var bodyParser					=	require('body-parser');
var morgan 						= 	require('morgan');
var fs 							=	require('fs');
var jwt    						= 	require('jsonwebtoken');
var config 						= 	require('./config');
var moment 						=	require('moment');
var tz 							=	require('moment-timezone');
var now 						=	require("date-now")
var fromNow						= 	require('from-now');
var dateFormat 					= 	require('dateformat');

//geocoder
var geocoder = require('geocoder');
var NodeGeocoder = require('node-geocoder');


var port = process.env.PORT || 5000; // used to create, sign, and verify tokens
var secureRoutes 	=	express.Router();

mongoose.connect(config.connect);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if('OPTIONS'==req.method) {
	  res.send(200);
  }else{
	  next();
  }
});
app.use(morgan('dev'));
app.listen(port);
console.log('Server start at http://localhost:' + port);

// User Login Router
app.use('/user/auth',authRouter);

// For registering new user
app.use('/user/add',registerRouter);

//forget password all user
app.use('/user/forgetPassword',forgetPasswordRouter);

//30 ribu data = 16 miliseconds
app.get('/gg',function(req,res){
	var start = new Date();
	var banding = 30000;
	var simpan = [];
	for (var i=0;i<100000000;i++){
		if(i<banding){
			simpan.push(i);
		}
	}
	var time = new Date() - start;
	console.log(time + " milliseconds.");
	
})

// --- JWT Validaltion ---
app.use(function(req,res,next){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
	{	
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function(err, decoded)
		{
			    if (err)
			    {
	    			return res.json({ success: false, message: 'Failed to authenticate token.' });
		  		}
		  		else
		  		{
		  			// for website login
		  			if(decoded.login_type==0)
		  			{
		  				req.user_id=decoded.user_id;
			  			req.role = decoded.role;
	      	  			req.token=jwt.sign({

	      	  									user_id:decoded.user_id,
	                                            username:decoded.username,
	                                            time:decoded.last_login,
	                                            role:decoded.role,

	      	  									

	                                            login_type:decoded.login_type
	                                        }
	                                        ,config.secret, {
						                    expiresIn : 60*60// expires in 24 hours
						                    });
			  			next();
		  			}
		  			//for mobile login
		  			else if(decoded.login_type==1)
		  			{
		  				
		  				req.user_id=decoded.user_id;
		  				req.token='-';
					    req.role = decoded.role;
	    	  			next();
		  			}
		  		}
		})
	}
	else
    {
    	return res.status(400).json({ status:400, message: 'Please send token' });
    }
});


app.use('/user',userRouter);
app.use('/produksi',produksiRouter);
app.use('/dagangan',daganganRouter);
app.use('/aspirasi',aspirasiRouter);

//Cek ROLE

/*
1 = admin
2 = pemerintah
3 = penyuluh
4 = petani
5 = masyarakat
6 = pedagang
*/

app.use('/komoditas',komoditasRouter);
app.use('/laporanHarga',laporanHargaRouter);



app.post('/role',function(req,res){
	res.send("role 5")
});
