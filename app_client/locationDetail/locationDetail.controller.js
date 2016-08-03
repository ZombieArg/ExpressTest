/**
 * Created by Zombie on 27/07/2016.
 */

(function () {

    angular.module('loc8rApp').controller('locationDetailCtrl', locationDetailCtrl);


    locationDetailCtrl.$inject = ['$routeParams','$uibModal','loc8rData']; //Inject $routeParams service into controller, protecting against minification

    function locationDetailCtrl($routeParams, $uibModal, loc8rData) { //Pass $routeParams into controller so we can use it

        var vm = this;
        vm.locationid = $routeParams.locationid; //Get locationid from $routeParams and save it into a view model

        loc8rData.locationById(vm.locationid) //Call locationById method passing locationid as parameter
            .success(function (data) {  //If request is successful save returned data in view model
                vm.data = {location:data};
                vm.pageHeader = {
                    title : vm.data.location.name  //Output location name to page header
                };
            })
            .error(function (e) { // IF request isn't succesful output  error message to browser console
                console.log(e);
            });

        vm.popupReviewForm = function () {

            var modalInstance = $uibModal.open({
                templateUrl: '/reviewModal/reviewModal.view.html',
                controller: 'reviewModalCtrl as vm',
                resolve: { //Add resolve option, mapping to object
                    locationData : function () { //Add parameter that maps to function
                        return { //Function should return an object or single value
                            locationid : vm.locationid,
                            locationName: vm.data.location.name
                        };
                    }
                }
            });


           modalInstance.result.then(function (data) {
                vm.data.location.reviews.push(data);
            })
        };

    }

})();