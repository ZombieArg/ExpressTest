/**
 * Created by Zombie on 21/07/2016.
 */

(function () {

angular.module('loc8rApp').service('loc8rData', loc8rData);

//Service

    loc8rData.$inject = ['$http'];
function loc8rData ($http) { //New named function to return data

    var locationByCoords = function (lat, lng) { //Create new function inside service function, accepting two parameters, lat and lng
        return  $http.get('/api/locations?lng='+lng+'&lat='+lat); //Remove hardcoded values in API call and replace with lng and lat variables
    };

    var locationById = function (locationid) { //Create a new locationById method, accepting locationid parameter
        return  $http.get('/api/locations/' + locationid); //That uses locationid in a call to API
    };

    var addReviewById = function (locationid, data) {
        return  $http.post('/api/locations/' + locationid + '/reviews/', data); //That uses locationid in a call to API
    };

    return  {
        locationByCoords: locationByCoords,//Return locationByCoords function making it accesible as method of service
        locationById: locationById, //Expose locationById  methos so we can call it from the controller
        addReviewById: addReviewById
    }
}

function geolocation () { //Create service called geolocaiton
    var getPosition = function (cbSuccess, cbError, cbNoGeo) { //Define function called getPosition that accepts three callback functions for success, error, and not supported
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError); //if geolocation supported, call native method, passing through success and error callbacks
        } else {
            cbNoGeo(); //If geolocation isn't  supported invoke not supportes callback
        }
    };

    return {
        getPosition : getPosition //Return getPosition function so it can be invoked from controller
    }
}

}) ();