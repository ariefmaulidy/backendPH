var express=require('express')
var komoditasController=require('./../controllers/komoditasController');
var komoditasRouter=express.Router();
var app = express();

app.use(function(req,res,next){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function(err, decoded){
			var role = decoded.role;
			if(role==1){
				next();	
			}else{
				res.json({status:401,message:"role tidak sesuai",data:"",token:token});
				//next();
			}
			
		});
	}
});

komoditasRouter.route('/add')
	.post(komoditasController.addKomoditas);
komoditasRouter.route('/get')
	.get(komoditasController.allKomoditas);
komoditasRouter.route('/get/:komoditas_id')
	.get(komoditasController.oneKomoditas);
komoditasRouter.route('/update')
	.post(komoditasController.updateKomoditas);
komoditasRouter.route('/delete')
	.post(komoditasController.deleteKomoditas);

module.exports=komoditasRouter; 