/**
 * Created by Zombie on 24/08/2016.
 */

(function () {

    angular.module('loc8rApp').controller('registerCtrl',registerCtrl);

    registerCtrl.$inject = ['$location', 'authentication']; //Inject $location and authentication services into controller

    function registerCtrl($location, authentication) {
        var vm = this;

        vm.pageHeader = {
            title: 'Create a new Loc8r account.'
        };

        vm.credentials = { //Instantiate credentials
            name: "",
            email: "",
            password: ""
        };

        vm.returnPage = $location.search().page || '/'; //Get page to return to from query string
        
        vm.onSubmit = function () { //Create a placeholder for onSubmit function
            vm.formError = "";

            if(!vm.credentials.name || !vm.credentials.email || !vm.credentials.password){ //If any credentials are missin, show an error
                vm.formError = "All fields required, please try again";
                return false;
            }else{
                vm.doRegister(); //Otherwise continue to register
            }
        };

        vm.doRegister = function () {
            vm.formError = "";

            authentication //Call authentication register method, passing credentials
                .register(vm.credentials)
                .error(function (err) {
                    vm.formError = err; //Show an error if registration fails
                })
                .then(function () {
                    $location.search('page', null); //If registration was succesfull clear query string and redirect user
                    $location.path(vm.returnPage);
                })
        };

    }

})();