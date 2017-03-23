var express   =   require('express');
var codeSecret=   require('./../config');
var apiRoutes =   express.Router(); 
var jwt       =   require('jsonwebtoken');
var User      =   require('./../models/userModel');
var fs        =   require('fs');

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/auth', function(req, res) {
  //generate password hash
  generated_hash = require('crypto')
  .createHash('md5')
  .update(req.body.password+'portalharga', 'utf8')
  .digest('hex');
  // find the user
  User.findOne({
    username: req.body.username}, function(err, user) {
      if (err) throw err;

      if (!user) {
        res.json({ status:500,success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {

        // check if password matches
        if (user.password != generated_hash) {
            res.json({ status:500,success: false, message: 'Authentication failed. Wrong password.' });
        } else {
            var dt = new Date();
            var utcDate = dt.toGMTString();
            user.password=generated_hash;
            user.last_login=utcDate;
            user.save(function(err){
            if(err)
              {
                  var saveData = '';
                  res.json({success:false,status:"500",message: "Add Failed"});
              }
              else
              {
                // for website
                if(req.headers.login_type==0)
                {
                  var token = jwt.sign({id:user._id,username:user.username,time:user.last_login,role:user.role},codeSecret.secret, {
                    expiresIn : 60*60// expires in 24 hours
                    });
                      User.findOne({username: req.body.username}, '-_id -__v -password',function(err, result){
                       if(result.prof_pict!=null){
                           if (err) 
                            {
                              return console.log(err);
                            }
                            else 
                            {
                              res.json({success: true,status:200,message: 'Login Success',data : result,token: token});    
                            }
                         }
                       else
                       {
                            res.json({success: true,status:200,message: 'Login Success',data : result,token: token});    
                       }   
                    });
                }

                // for mobile
                else if(req.headers.login_type==1)
                {
                  var token = jwt.sign({id:user._id,username:user.username,time:user.last_login,role:user.role},codeSecret.secret,{});
                   User.findOne({username: req.body.username}, '-_id -__v -password',function(err, result){
                    if(result.prof_pict!=null){
                            if (err) 
                            {
                              return console.log(err);
                            }
                            else 
                            {
                              res.json({success: true,status:200,message: 'Login Success',data : result,token: token});    
                            }
                         }
                       else
                       {
                            res.json({success: true,status:200,message: 'Login Success',data : result,token: token});    
                       }
                  });
                }
                  
                    // return the information including token as JSON
                   
              }
        });
        // if user is found and password is right
        // create a token
        
      }   

    }

  });
});

module.exports=apiRoutes; 