var express			=	require('express');
var app				=	express();
var User            =	require('./models/userModel')
var userRouter		=	require('./routes/userRouter.js');
var authRouter		=	require('./routes/auth.js');
var aspirasiRouter	=	require('./routes/aspirasiRouter.js');
var produksiRouter	=	require('./routes/produksiRouter.js');

var multer	 		= 	require('multer');
var mongoose		=	require('mongoose');
var bodyParser		=	require('body-parser');
var morgan 			= 	require('morgan');
var fs 				=	require('fs');
var jwt    			= 	require('jsonwebtoken');
var config 			= 	require('./config');

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

app.use('/user',userRouter);
app.use('/api',authRouter);

// --- JWT Validaltion ---
app.use(function(req,res,next){
	if(req.headers.token){
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
		    	  			next();	
		    	  		}
		    	})
			}
		    
		else if(req.headers.login_type==0)
		{
			// website login 
			jwt.verify(req.headers.token, config.secret, function(err, decoded) {     
			console.log(decoded.id); 
					    if (err) 
					    {
		        			return res.json({ success: false, message: 'Failed to authenticate token.' });    
		    	  		}		 
		    	  		else 
		    	  		{

		    	  			req.token=jwt.sign({id:decoded.id,username:decoded.username,time:decoded.time},config.secret, {
		                    expiresIn : 60*60// expires in 24 hours
		                    });
		    	  			next();	
		    	  		}
		    	});
		}
	}
	else
		    {
		    	return res.json({ success: false, message: 'Please send token' }); 
		    }


});
// -------------upload----------------
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public_html/uploads/prof_pict/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

var upload = multer({
	storage:storage,
 fileFilter: function (req, file, callback) {
        var ext = file.mimetype;
        if(ext !== 'image/jpeg' && ext !== 'image/jpg' && ext !== 'image/gif' && ext !== 'image/png') {           
            return callback(JSON.stringify({status:400,message:'Only images are allowed'}));
        }
        callback(null, true)
    }
});
app.post('/user/upload_photo',upload.any(),function(req,res,next){
		User.findOne({us_id:req.body.us_id},function(err,user){
			if(user){
				if(user.prof_pict!=null){
				fs.unlinkSync('../public_html/'+user.prof_pict);
				}
				user.prof_pict='uploads/prof_pict/'+req.files[0].filename;
				user.save(function(err){
					if(!err){
						res.json({status:200,message:'Change profile picture success'});
					}
					else
					{
						res.json({error:err});
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

app.use('/produksi',produksiRouter);
app.use('/aspirasi',aspirasiRouter);

