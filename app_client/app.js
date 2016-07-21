/**
 * Created by Zombie on 18/07/2016.
 */

(function () {

angular.module('loc8rApp', ['ngRoute']); //Add ngRoute as a module dependency

function config($routeProvider) { //Module config function to hold route definitions

    $routeProvider
        .when('/',{
           templateUrl: "home/home.view.html", //Add templateUrl to route config to specify view template to use
           controller: 'homeCtrl',
           controllerAs: 'vm' //Add controllerAs option to route definition, passing variable name as string
        })
        .otherwise({redirecTo: '/'});
    
}

angular
    .module('loc8rApp')
    .config(['$routeProvider', config]); //Add config to module, passing through $routeProvider as dependency

}) ();