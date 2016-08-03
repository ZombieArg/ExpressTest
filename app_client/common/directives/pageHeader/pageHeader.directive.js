/**
 * Created by Zombie on 25/07/2016.
 */

(function () {

    angular.module('loc8rApp').directive('pageHeader', pageHeader);


    function pageHeader() {
        return{
          restrict : 'EA',
          scope : {
              content: '=content' //Define isolated scope passing through content object
          },
          templateUrl : '/common/directives/pageHeader/pageHeader.template.html'
        };
    }

})();