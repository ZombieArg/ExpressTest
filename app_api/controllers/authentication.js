/**
 * Created by Zombie on 10/08/2016.
 */

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');


var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) {
    if(!req.body.name || !req.body.email || !req.body.password){ //Respond with an error status if not all required fields are found
        sendJsonResponse(res, 400, {
            message :'All fields required'
        });
        return;
    }

    var user = new User(); //Create a new user instance and set name and email

    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password); //Use setPassword method to set salt and hash


    user.save(function (err) { //Save new user to MongoDB
        var token;
        if(err){
            sendJsonResponse(res, 404, err);
        }else{
            token = user.generateJwt(); //Generate a JWT using schema method and send it to browser
            sendJsonResponse(res, 200, {
                "token" : token
            });
        }

    });
};

module.exports.login = function (req, res) {

    if(!req.body.email || !req.body.password){ //Respond with an error status if not all required fields are found
        sendJsonResponse(res, 400, {
            message :'All fields required'
        });
        return;
    }

    passport.authenticate('local', function (err, user, info) { //Pass name off strategy and a callback to authenticate method
        var token;

        if(err){
            sendJsonResponse(res, 400, err); //Return an error if Passport returns and error
            return;
        }

        if(user){ //If passport returned a user instance, generate and send a JWT
            token = user.generateJwt();
            sendJsonResponse(res,200, {
                "token" : token
            });
        }else{ //Otherwise return info message (why authentication failed)
            sendJsonResponse(res, 401, info);
        }
    })(req,res); //Make sure req and res are available to passport

};