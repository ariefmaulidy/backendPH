var express = require('express');
var jwt = require('jsonwebtoken');
var tokenCheck = function(req,res){
  // check header or url parameters or post parameters for token
  // decode token
   var token = req.headers.token;
   if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'cobain', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        return "true";
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
};
module.exports=
{
    tokenCheck:tokenCheck
}