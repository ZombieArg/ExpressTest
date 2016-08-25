/**
 * Created by Zombie on 30/05/2016.
 */
//Require mongoose
var mongoose = require('mongoose');

//Uri Local
var dbURI = 'mongodb://localhost/Loc8r';
var dbURILive = 'mongodb://ZombieArg:32064475Morsi@ds019893.mlab.com:19893/loc8r-dev';

//Connect
mongoose.connect(dbURI);
//var logDB = mongoose.createConnection(dbURILog);

//Connected
mongoose.connection.on('connected',function () {
   console.log('Mongoose connected to ' + dbURI);
});

/*logDB.on('connected',function () {
    console.log('Mongoose connected to ' + dbURILog);
});*/

//Error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

//Disconnected
mongoose.connection.on('disconnected',function () {
    console.log('Mongoose Disconnected');
});

//Close
/*logDB.close(function () {
    console.log('Mongoose log disconnected from ' + dbURILog);
});*/

//Function to close Mongoose Connection
var gracefulShutdown = function (msg, callback) {

    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

//Read Node process

var readLine = require("readline");


if(process.platform === "win32"){
    var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}

//Nodemon restart
process.once('SIGUSR1',function () {
    gracefulShutdown('Nodemon restart ', function () {
        process.kill(process.pid, 'SIGUSR1');
    });
});

//Node Shutdown
process.on('SIGINT',function () {
    gracefulShutdown('App termination', function () {
        process.exit(0);
    });
});

//Heroku Shutdown
process.on('SIGTERM',function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

//Schema
require('./locations');
require('./users');