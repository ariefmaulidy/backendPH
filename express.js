var express						=	require('express');
var app							=	express();
var https 						= 	require('https');
var User            			=	require('./models/userModel');
var Blacklist          			=	require('./models/blacklistTokenModel');
var daganganRouter				=	require('./routes/daganganRouter.js');
var materiRouter				=	require('./routes/materiRouter.js');
var userRouter					=	require('./routes/userRouter.js');
var authRouter					=	require('./routes/auth.js');
var registerRouter				=	require('./routes/registerRouter.js');
var aspirasiRouter				=	require('./routes/aspirasiRouter.js');
var produksiRouter				=	require('./routes/produksiRouter.js');
var komoditasRouter 			= 	require('./routes/komoditasRouter');
var laporanHargaRouter 			= 	require('./routes/laporanHargaRouter');
var emailRouter         		= 	require('./routes/emailRouter');
var operasiPasarRouter			= 	require('./routes/operasiPasarRouter');
var trendHargaRouter			= 	require('./routes/trendHargaRouter');
var locationRouter  			= 	require('./routes/lokasiRouter');
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


var port = process.env.PORT || 5000; // used to create, sign, and verify tokens

mongoose.connect(config.connect);

// setup allowed headers for web services 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

// bypass option method 
  if('OPTIONS'==req.method) {
	  res.send(200);
  }else{
	  next();
  }
});

app.use(morgan('dev'));
// setup keys and certificate, create https server. request example: https://ph.yippytech.com:5000/API.....
var options = {
  key: fs.readFileSync('keys/agent-key.pem'),
  cert: fs.readFileSync('keys/agent-cert.cert')
};
https.createServer(options, app).listen(port);
/*app.listen(port);*/
console.log('Server start at https://ph.yippytech.com:' + port);

// User Login Router
app.use('/user/auth',authRouter);

// For registering new user
app.use('/user/add',registerRouter);

//forget password all user
app.use('/user/email',emailRouter);


// --- JWT Validaltion ---
app.use(function(req,res,next){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
	{	
		Blacklist.findOne({token:req.headers.authorization.split(' ')[1]},function(err,blacklist){
			if(blacklist!=null)
			{
	    		return res.json({ status:403,success: false, message: 'Token is already expired'});
			}
			else
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
			      	  									user_data:decoded.user_data,
			      	  									user_id:decoded.user_id,
			                                            username:decoded.username,
			                                            time:decoded.last_login,
			                                            role:decoded.role,

			      	  									

			                                            login_type:decoded.login_type
			                                        }
			                                        ,config.secret, {
								                    expiresIn : 60*20// expires in 20 mins
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
		})
	}
	else
    {
    	return res.status(400).json({ status:400, message: 'Please send token' });
    }
});


app.use('/user',userRouter);
app.use('/materi',materiRouter);
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
app.use('/operasiPasar',operasiPasarRouter);
app.use('/trendHarga',trendHargaRouter);

//location
app.use('/lokasi',locationRouter);
