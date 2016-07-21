/**
 * Created by Zombie on 22/06/2016.
 */


angular.module('loc8rApp', []);

//Controller
var locationListCtrl = function ($scope, loc8rData, geolocation) { //Put controller in named functions for better coding practices // acceps $scope parameter to have access to scope //Pass service name into controller function as parameter

   $scope.message = "Checking your location"; //Set default message

    
   $scope.getData = function (position) { //Function to run if geolocation is successful
       var lat = position.coords.latitude,
           lng = position.coords.longitude; //Define variables to hold the latitude and longitude values from position object

       $scope.message = "Searching for nearby places"; //Set default msg to let the user knows that we are doing something in bg
       loc8rData.locationByCoords(lat,lng)  //Instead of jus calling loc8rData service name, update code to call new locationByCoords method, passing the lat and lng variables
           .success(function (data) {
               $scope.message = data.length > 0 ? "" : "No locations found"; //If request return successfully and there's some data, clear the msg otherwise let user know that nothing was found
               $scope.data ={ //On succesful response, pass returned data into the callback function
                   locations : data //Apply this data to the scope
               };
           }).error(function (e) { //If web services returned error, pass error code to callback function
           $scope.message = "Sorry, Something'ss gone wrong "; //If asynchronous call returns an error, let user know that something has gone wrong
           console.log(e)
       });

   };

   $scope.showError = function (error) { //Function to run if geolocation is supported but not succesful
     $scope.$apply(function () {
         $scope.message = error.message;
     })
   };

    $scope.noGeo = function () { //Function to run if geolocation isn't  supported by browser
        $scope.$apply(function () {
            $scope.message = "Geolocation not supported by this browser";
        })
    };

    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo); //Pass the function to our geolocation services;
};


//Service
var loc8rData = function ($http) { //New named function to return data

    var locationByCoords = function (lat, lng) { //Create new function inside service function, accepting two parameters, lat and lng
        return  $http.get('/api/locations?lng='+lng+'&lat='+lat); //Remove hardcoded values in API call and replace with lng and lat variables
    };

    return  {
        locationByCoords: locationByCoords //Return locationByCoords function making it accesible as method of service
    }
};

var geolocation = function () { //Create service called geolocaiton
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
};


var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var ratingStars = function () { //Create a new function ratingStar and return a basic template, binding to rating of location
    return {
        scope:{ //Add scope option to directives definition to create isolate scope
            thisRating: "=rating" //Create new variable thisRating and tell Angunlar to get value from attribute called rating
        },
        templateUrl: "/angular/rating-stars.template.html" //Change template to templateUrl and set path to HTML file we want to use
    }
};

var formatDistance = function () { //To be used as Angular filter formatDistance function must return function that accepts distance parameters rather than accepting it itself
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

angular.module('loc8rApp')
    .controller('locationListCtrl', locationListCtrl) //Get app module and assign controller to myController, include controller code in named function
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars) //Register directives with application
    .service('loc8rData', loc8rData) //Register service application
    .service('geolocation', geolocation);