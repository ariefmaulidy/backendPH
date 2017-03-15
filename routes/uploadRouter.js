var express=require('express');
var uploadController=require('./../controllers/uploadController');

var uploadRouter=express.Router();
uploadRouter.route('')
  .post(uploadController.upl);
/*
  .post(moviesController.add);
moviesRouter.route('/del/:id')
  .get(moviesController.del);
moviesRouter.route('/:id')
    .get(moviesController.getById)
    .put(moviesController.update)
    .patch(moviesController.patch);
*/
module.exports=uploadRouter; 
