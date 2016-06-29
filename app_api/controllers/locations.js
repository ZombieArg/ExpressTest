/**
 * Created by Zombie on 01/06/2016.
 */

var mongoose =  require('mongoose');
var loc = mongoose.model('Location');


var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

var theEarth = (function () {
    var earthRadius = 6371;

    var getDistanceFromRads = function (rads) {
        return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    };

    var getMetersFromDistanceInKm = function (distanceKM) {
        var earthRadiusMeters = earthRadius * 1000;

        return parseFloat((distanceKM * earthRadiusMeters) / earthRadius);
    };

    var getKmFromDistanceInMeters = function (distanceMeters) {
        var metrosEnKm = 1000;

        return parseFloat((distanceMeters * 1) / metrosEnKm).toFixed(2);
    };


    //Expose functions
    return {
        getDistanceFromRads : getDistanceFromRads,
        getRadsFromDistance : getRadsFromDistance,
        getMetersFromDistanceInKm: getMetersFromDistanceInKm,
        getKmFromDistanceInMeters: getKmFromDistanceInMeters
    };
})();

/*Get Locations*/
module.exports.locationsListByDistance = function (req, res) {

    //Get coordinates from query string and convert from strings to numbers
    var lng= parseFloat(req.query.lng);
    var lat= parseFloat(req.query.lat);

    //Create geoJSON point
    var point = {
        type: "Point",
        coordinates: [lng , lat]
    };

    //Create options object, including setting maximum distance to 20km
    var geoOptions = {
      spherical: true,
      maxDistance: theEarth.getMetersFromDistanceInKm(20), //This option parameter recieve meters
      num: 10
    };

    //Check lng and lat query parameters exist in right format; return a 404 error and message if not
    if ((!lng && lng!==0) || (!lat && lat !==0)){
        sendJsonResponse(res, 404, {'Message': 'lng and lat query parameter are required'});
        return;
    }

    //Update geoNear function to use geoOptions object
    loc.geoNear(point, geoOptions, function (err, results, stats) {
        //Create new array to hold processed results data
        var locations = [];

        //If geoNear query returns error, send this as response with 404 status
        if(err){
            sendJsonResponse(res, 404, err);
        } else{

            //Loop through geoNear query results
            results.forEach(function (doc) {
                locations.push({
                    distanceKm : theEarth.getKmFromDistanceInMeters(doc.dis), //Get distance and conver from meters to km
                    distanceMeters : doc.dis, //Get distance in meters
                    //Push rest of the data to the return object
                    name: doc.obj.name,
                    address: doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id: doc.obj._id
                });
            });

            sendJsonResponse(res, 200, locations); //send processed data back as JSON response
        }
    });


};

/*Create Location*/
module.exports.locationsCreate = function (req, res) {


    var newDocument = {
        name: req.body.name,
        address: req.body.address,
        //Create array of facilities by splitting a comma separated list
        facilities: req.body.facilities.split(","),
        //Parse coordinates from strings to numbers
        coords: [parseFloat(req.body.lng),parseFloat(req.body.lat)],
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1
        },{
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
        }]
    };

    //Apply create method model
    loc.create(newDocument, function (err, location) {
        //Supply callback function containing appropiate response for success and failure
        if(err){
            sendJsonResponse(res, 404, err);
        }else{
            sendJsonResponse(res, 202, location);
        }
    });

};

/*Read one Location*/
module.exports.locationsReadOne = function (req, res) {
    //Check that locationid exist in request parameters
    if(req.params && req.params.locationid){

        //Get locationid from URL parameters and give it to findById method
        loc.findById(req.params.locationid).exec(function (err, location) {
            if(!location){

                //If mongoose doesn't return a location, send 404 message  and exit function scope using return statement
                sendJsonResponse(res, 404, "locationid not found");
                return;
            } else if (err){
                //If mongoose return a error, send 404 message  and exit function scope using return statement
                sendJsonResponse(res, 404, err);
                return;
            }

            //If mongoose didn't error, continue as before and send location object in a 200 response
            sendJsonResponse(res, 200, location);
        });
    }else{
        //If request parameters didn't include locationid, send  appropriate 404 response
        sendJsonResponse(res, 404, "No locationid in request");
    }
};

/*Update one Location*/
module.exports.locationsUpdateOne = function (req, res) {
    if(!req.params.locationid){
        sendJsonResponse(res, 404, {'message': 'Not found, locationid is required'});
        return;
    }

    //Find location document by given ID
    loc.findById(req.params.locationid).select('-reviews -rating').exec(function (err, location) {
        if (!location){
            sendJsonResponse(res, 404, {'message': 'Location not found'});
            return;
        }else if (err){
            sendJsonResponse(res, 404, err);
            return;
        }

        //Update path with value form submitted form
        location.name = req.body.name;
        location.address = req.body.address;
        location.facilities = req.body.facilities.split(",");
        location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
        location.openingTimes = [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1
        },{
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
        }];

        //Save instance
        location.save(function (err, location) {
            if(err){
                sendJsonResponse(res, 404, err);
            }else{
                sendJsonResponse(res, 200, location);
            }
        })

    });
};

/*Delete Location*/
module.exports.locationsDeleteOne = function (req, res) {

    var locationid = req.params.locationid;

    if(locationid){

        //Call findByIdAndRemove method passing locationid and executed method
        loc.findByIdAndRemove(locationid).exec( function (err, location) {
            if(err){
                sendJsonResponse(res, 404, err);
            }else{
                sendJsonResponse(res, 204, null);
            }
        })

    }else{
        sendJsonResponse(res, 404, {'message': 'Not locationid'});

    }

};