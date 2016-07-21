/**
 * Created by Zombie on 21/07/2016.
 */
(function () {

angular.module('loc8rApp').filter('formatDistance', formatDistance);

var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

function formatDistance () { //To be used as Angular filter formatDistance function must return function that accepts distance parameters rather than accepting it itself
    return function (distance) {//Contents of function remain same and can be copied directly from Express application
        var numDistance, unit;

        if(distance && _isNumeric(distance)){
            if(distance > 1000){
                numDistance = parseFloat(distance / 1000).toFixed(2);
                unit = " km";
            }else{
                numDistance = parseFloat(distance).toFixed(0);
                unit = " m";
            }

            return numDistance + unit;
        }else{
            return "?";
        }
    };
};

}) ();