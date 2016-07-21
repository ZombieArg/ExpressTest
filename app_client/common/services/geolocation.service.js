/**
 * Created by Zombie on 21/07/2016.
 */

(function () {

angular.module('loc8rApp').service('geolocation', geolocation);



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