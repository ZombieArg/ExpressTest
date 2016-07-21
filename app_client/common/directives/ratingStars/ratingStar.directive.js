/**
 * Created by Zombie on 21/07/2016.
 */
(function () {

angular.module('loc8rApp').directive('ratingStars', ratingStars);

function ratingStars() { //Create a new function ratingStar and return a basic template, binding to rating of location
    return {
        restrict: 'EA',
        scope:{ //Add scope option to directives definition to create isolate scope
            thisRating: "=rating" //Create new variable thisRating and tell Angunlar to get value from attribute called rating
        },
        templateUrl: "/common/directives/ratingStars/rating-stars.template.html" //Change template to templateUrl and set path to HTML file we want to use
    }
};

}) ();