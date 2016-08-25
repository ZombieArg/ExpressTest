/**
 * Created by Zombie on 25/08/2016.
 */

(function () {
    angular.module('loc8rApp').controller('navigationCtrl', navigationCtrl);


    navigationCtrl.$inject = ['$location', 'authentication'];

    function navigationCtrl($location, authentication) {
        var vm = this;

        vm.currentPath = $location.path();

        vm.isLoggedIn = authentication.isLoggedIn(); //Find out whether visitor is logged in

        vm.currentUser = authentication.currentUser(); //Get current user's name

        vm.logout = function () { //Create a logout function redirect to homepage when complete
            authentication.logout();
            $location.path('/');
        };
    }


})();