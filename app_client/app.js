/**
 * Created by Zombie on 18/07/2016.
 */

(function () {

angular.module('loc8rApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']); //Add ngRoute as a module dependency

function config($routeProvider, $locationProvider) { //Module config function to hold route definitions //Accept $locationProvider as a parameter in config

    $routeProvider
        .when('/',{
           templateUrl: "home/home.view.html", //Add templateUrl to route config to specify view template to use
           controller: 'homeCtrl',
           controllerAs: 'vm' //Add controllerAs option to route definition, passing variable name as string
        })
        .when('/about',{  //Set new path to about
            templateUrl: "/common/views/genericText.view.html", //Define path for generic view template
            controller: 'aboutCtrl', //Tell route to use controller called 'aboutCtrl'
            controllerAs: 'vm' //Add controllerAs option to route definition, passing variable name as string
        })
        .when('/location/:locationid',{  //Set new path to about
            templateUrl: "/locationDetail/locationDetail.view.html", //Define path for generic view template
            controller: 'locationDetailCtrl', //Tell route to use controller called 'locationDetailCtrl'
            controllerAs: 'vm' //Add controllerAs option to route definition, passing variable name as string
        })
        .when('/register',{  //Set new path to about
            templateUrl: "/auth/register/register.view.html", //Define path for generic view template
            controller: 'registerCtrl', //Tell route to use controller called 'registerCtrl'
            controllerAs: 'vm' //Add controllerAs option to route definition, passing variable name as string
        })
        .when('/login',{  //Set new path to about
            templateUrl: "/auth/login/login.view.html", //Define path for generic view template
            controller: 'loginCtrl', //Tell route to use controller called 'registerCtrl'
            controllerAs: 'vm' //Add controllerAs option to route definition, passing variable name as string
        })
        .otherwise({redirecTo: '/'});

    $locationProvider.html5Mode(true);// Set html5mode to be true
}

angular
    .module('loc8rApp')
    .config(['$routeProvider', '$locationProvider', config]); //Add config to module, passing through $routeProvider as dependency //Add locationProvider as dependency for config
}) ();