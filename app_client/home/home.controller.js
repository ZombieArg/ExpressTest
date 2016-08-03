/**
 * Created by Zombie on 20/07/2016.
 */
(function () {

angular.module('loc8rApp').controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope', 'loc8rData', 'geolocation'];
function homeCtrl($scope, loc8rData, geolocation) {
    var vm = this;
    vm.pageHeader = {
        title : 'Loc8r',
        strapline : 'Find places to work with wifi near you!'
    };

    vm.sidebar = {
        content : 'Looking for wifi and a seat etc etc'
    };

    vm.message = "Checking your location"; //Set default message


    vm.getData = function (position) { //Function to run if geolocation is successful
        var lat = position.coords.latitude,
            lng = position.coords.longitude; //Define variables to hold the latitude and longitude values from position object

        vm.message = "Searching for nearby places"; //Set default msg to let the user knows that we are doing something in bg
        loc8rData.locationByCoords(lat,lng)  //Instead of jus calling loc8rData service name, update code to call new locationByCoords method, passing the lat and lng variables
            .success(function (data) {
                vm.message = data.length > 0 ? "" : "No locations found"; //If request return successfully and there's some data, clear the msg otherwise let user know that nothing was found
                vm.data ={ //On succesful response, pass returned data into the callback function
                    locations : data //Apply this data to the scope
                };
            }).error(function (e) { //If web services returned error, pass error code to callback function
            vm.message = "Sorry, Something'ss gone wrong "; //If asynchronous call returns an error, let user know that something has gone wrong
            console.log(e)
        });

    };

    vm.showError = function (error) { //Function to run if geolocation is supported but not succesful
        $scope.$apply(function () {
            vm.message = error.message;
        })
    };

    vm.noGeo = function () { //Function to run if geolocation isn't  supported by browser
        $scope.$apply(function () {
            vm.message = "Geolocation not supported by this browser";
        })
    };

    geolocation.getPosition(vm.getData, vm.showError, vm.noGeo); //Pass the function to our geolocation services;

    if(window.location.pathname !== '/'){
        window.location.href = '/#' + window.location.pathname;
    }

}

}) ();