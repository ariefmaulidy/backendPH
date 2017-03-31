var express			=	require('express');
var app				=	express();
var User            =	require('./models/userModel');
var daganganRouter	=	require('./routes/daganganRouter.js');
var userRouter		=	require('./routes/userRouter.js');
var authRouter		=	require('./routes/auth.js');
var registerRouter	=	require('./routes/registerRouter.js');
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
//nyoba sendgrid
//var smtp 		= 	require('./routes/smtp2Router');

var port = process.env.PORT || 5000; // used to create, sign, and verify tokens
var secureRoutes 	=	express.Router();

mongoose.connect(config.connect);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(morgan('dev'));
app.listen(port);
console.log('Server start at http://localhost:' + port);

// User Login Router
app.use('/user/auth',authRouter);

// For registering new user
app.use('/user/add',registerRouter);

//untuk masyarakat
app.use('/masyarakat',masy);


//app.use('/smtp',smtp);

// --- JWT Validaltion ---
app.use(function(req,res,next){
	if(req.headers.authorization)
	{
		jwt.verify(req.headers.authorization, config.secret, function(err, decoded) 
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
	      	  									user_id:user.user_id,
	                                            username:user.username,
	                                            time:user.last_login,
	                                            role:user.role,
	                                            login_type:req.body.login_type
	                                        }
	                                        ,config.secret, {
						                    expiresIn : 60*60// expires in 24 hours
						                    });
			  			next();
		  			}
		  			//for mobile login
		  			else if(decoded.login_type==1)
		  			{
		  				console.log(decoded.user_id);
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

