/**
 * Created by Zombie on 23/08/2016.
 */
(function () {
    angular.module('loc8rApp').service('authentication', authentication); //Register new service with applicaiton


    authentication.$inject = ['$window', '$http']; //Inject $window service

    function authentication($window, $http) {

        var saveToken = function(token){ //Create a saveToken method to save a value to localStorage
            $window.localStorage['Loc8r-token'] = token;
        };
        
        var getToken = function () { //Create a getToken method to read a value from localStorage
            return $window.localStorage['Loc8r-token'];
        };

        var register = function (user) {
            return $http.post('/api/register', user).success(function (data) {
                saveToken(data.token);
             });
        };

        var login = function (user) {
            return $http.post('/api/login', user).success(function (data) {
                saveToken(data.token);
            });
        };

        var logout = function (user) {
            $window.localStorage.removeItem('Loc8r-token');
        };

        var isLoggedIn = function () {
            var token = getToken(); //Get token from storage

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1])); //If token exist get payload decode it, and parse it to JSON

                return payload.exp > Date.now() / 1000; //Validate whether expiry date has passed
            }else{
                return false;
            }
        };

        var currentUser = function () {

            if(isLoggedIn()){
                var token = getToken(); //Get token from storage

                var payload = JSON.parse($window.atob(token.split('.')[1])); //If token exist get payload decode it, and parse it to JSON

                return {
                    email : payload.email,
                    name : payload.name
                };
            }
        };


        return { //Expose method to the application
            saveToken : saveToken,
            getToken : getToken,
            register : register,
            login : login,
            logout : logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser
        };

    }

})();