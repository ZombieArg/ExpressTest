/**
 * Created by Zombie on 01/06/2016.
 */

var mongoose =  require('mongoose');
var loc = mongoose.model('Location');


var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

/*Get Locations*/
module.exports.locationsListByDistance = function (req, res) {
    sendJsonResponse(res, 200, {"status" : "Success"});
};

/*Create Location*/
module.exports.locationsCreate = function (req, res) {

};

/*Read one Location*/
module.exports.locationsReadOne = function (req, res) {
    if(req.params && req.params.locationid){
        loc.findById(req.params.locationid).exec(function (err, location) {
            if(!location){
                sendJsonResponse(res, 404, "locationid not found");
                return;
            } else if (err){
                sendJsonResponse(res, 404, err);
                return;
            }
            sendJsonResponse(res, 200, location);
        });
    }else{
        sendJsonResponse(res, 404, "No locationid in request");
    }
};

/*Update one Location*/
module.exports.locationsUpdateOne = function (req, res) {

};

/*Delete Location*/
module.exports.locationsDeleteOne = function (req, res) {

};