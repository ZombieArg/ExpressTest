/**
 * Created by Zombie on 04/08/2016.
 */

//Require mongoose
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var userSchema = new mongoose.Schema({
    email:{  //Email should be required and unique
        type: String,
        unique: true,
        required: true
    },
    name:{ //Name is also required, but not necessarily unique
        type: String,
        required: true
    },
    hash: String,  //Hash and salt are both just string
    salt: String
});


//var user = new User(); //Create new user

/*user.name = "User's name";  //Set name and email values
user.email = "text@example.com";
user.setPassword = "myPassword";  //Call a  setPassword method to set password
user.save(); //Save new user*/


userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex'); //Create a random string for salt
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex'); //Create encrypted hash
};

userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex'); //Create encrypted hash
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
   var expiry = new Date();
   expiry.setDate(expiry.getDate() + 7); //Create expiry date object and set for seven days

   return jwt.sign({    //Call jwt.sign method and return what it returns
      _id : this._id,    //Pass payload to method
      email : this.email,
      name : this.name,
      exp : parseInt(expiry.getTime() / 1000), //Including exp as Unix time in seconds
   }, process.env.JWT_SECRET); //Send secret for hashing algorithm to use //Don't keep secrets in code; use enviroment variables instead
};

mongoose.model('User', userSchema); //Instantiate user model