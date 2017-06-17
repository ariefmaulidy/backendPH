var express=require('express')
var dashboardController=require('./../controllers/dashboardController');
var dashboardRouter=express.Router();

// upload photo

dashboardRouter.route('/get')
	.get(dashboardController.countDashboard);
module.exports=dashboardRouter; 