/**
 * Created by Zombie on 25/07/2016.
 */
(function () {

    angular.module('loc8rApp').directive('footerGeneric', footerGeneric);
    
    function footerGeneric() {
        return {
            restrict : 'EA',
            templateUrl : '/common/directives/footerGeneric/footerGeneric.template.html'
        };
    }

})();