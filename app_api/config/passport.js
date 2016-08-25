/**
 * Created by Zombie on 10/08/2016.
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (username, password, done) {
        User.findOne({email : username}, function (err, user) { //Search MongoDB for user with supplied email address
            if(err){ return done(err);}
            if(!user){ //If no user is found, return false and a message
                return done(null, false, {
                    message : 'Incorrect username.'
                });
            }
            if(!user.validPassword(password)){ //Call validPassword method, passing supplied password
                return done(null, false,{ //If password is incorrect, return false and a message
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
    });
}
));