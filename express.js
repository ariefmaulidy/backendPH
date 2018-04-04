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
var dashboardRouter				=	require('./routes/dashboardRouter.js');
var aspirasiRouter				=	require('./routes/aspirasiRouter.js');
var produksiRouter				=	require('./routes/produksiRouter.js');
var komoditasRouter 			= 	require('./routes/komoditasRouter');
var laporanHargaRouter 			= 	require('./routes/laporanHargaRouter');
var emailRouter         		= 	require('./routes/emailRouter');
var operasiPasarRouter			= 	require('./routes/operasiPasarRouter');
var trendHargaRouter			= 	require('./routes/trendHargaRouter');
var locationRouter  			= 	require('./routes/lokasiRouter');
var kebijakanRouter				= 	require('./routes/kebijakanRouter');
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
var cors 						=	require('cors');
var CronJob 					= 	require('cron').CronJob;
var summary						=	require('./models/summaryModel');
var summaryWeek					=	require('./models/summaryWeekModel');
var kecamatan					=	require('./models/lokasi/kecamatanModel');
var provinsi					=	require('./models/lokasi/provinsiModel');
var komoditas					=	require('./models/komoditasModel');


var port = process.env.PORT || 5000; // used to create, sign, and verify tokens

mongoose.connect(config.connect);

// setup allowed headers for web services
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var job = new CronJob({
	cronTime: '00 00 00 * * *',
	onTick: () => {
		var idkom = [];
		komoditas
			.find()
			.then((id) => {
				for(let i=0; i<id.length; i++) {
					idkom.push(id[i].komoditas_id);
				}
			})
			.catch((err) => {
				console.log('ada err', err);
			})
		provinsi
			.find()
			.then((hasil) => {
				for(let i=0; i<hasil.length; i++) {
					for(let j=0; j<idkom.length; j++) {
						var newSummary = new summaryWeek();
						newSummary.komoditas_id = idkom[j];
						newSummary.provinsiid = hasil[i].id_prov;
						newSummary.date = moment(new Date()).format("YYYY/MM/DD");
						newSummary.month = moment(new Date()).format("MM");
						newSummary.year = moment(new Date()).format("YYYY");
						newSummary.averageHarga = 0;
						newSummary.quantity = 0;
						newSummary.save();
					}
				}
			});
		kecamatan
			.find()
			.then((hasil) => {
				for(let i=0; i<hasil.length; i++) {
					for(let j=0; j<idkom.length; j++) {
						var newSummary = new summary();
						newSummary.komoditas_id = idkom[j];
						newSummary.kecamatanid = hasil[i].id_kec;
						newSummary.date = moment(new Date()).format("YYYY/MM/DD");
						newSummary.month = moment(new Date()).format("MM");
						newSummary.year = moment(new Date()).format("YYYY");
						newSummary.averageHarga = 0;
						newSummary.quantity = 0;
						newSummary.save();
					}
				}
			});
	},
	start: true,
	timeZone: 'Asia/Jakarta'
})
job.start();

app.use(morgan('dev'));
// setup keys and certificate, create https server. request example: https://ph.yippytech.com:5000/API.....

var options = {
  ca: fs.readFileSync('keys/agent-ca.pem'),
  key: fs.readFileSync('keys/agent-key.pem'),
  cert: fs.readFileSync('keys/agent-cert.cert')
};
https.createServer(options, app).listen(port);
// app.listen(port);
console.log('Server start at https://ph.yippytech.com:' + port);

// User Login Router
app.use('/user/auth',authRouter);

// For registering new user
app.use('/user/add',registerRouter);

//forget password all user
app.use('/user/email',emailRouter);

//location
app.use('/lokasi',locationRouter);

// --- JWT Validaltion ---
app.use(function(req,res,next){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
	{
		Blacklist.findOne({token:req.headers.authorization.split(' ')[1]},function(err,blacklist){
			if(blacklist!=null)
			{
	    		return res.status(401).json({ status:401,success: false, message: 'Failed to authenticate token, Token is already expired'});
			}
			else
			{
				var token = req.headers.authorization.split(' ')[1];
				jwt.verify(token, config.secret, function(err, decoded)
				{
					    if (err)
					    {
			    			return res.status(401).json({status:401, success: false, message: 'Failed to authenticate token.' });
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
								                    expiresIn : 60*20// expires in 20 minute
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
    	return res.status(401).json({ status:401, message: 'Failed to authenticate token, please send token' });
    }
});


app.use('/user',userRouter);
app.use('/dashboard',dashboardRouter);
app.use('/produksi',produksiRouter);
app.use('/dagangan',daganganRouter);
app.use('/aspirasi',aspirasiRouter);
app.use('/materi',materiRouter);

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
app.use('/kebijakan', kebijakanRouter);
