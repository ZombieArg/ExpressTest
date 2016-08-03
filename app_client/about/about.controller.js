/**
 * Created by Zombie on 26/07/2016.
 */


(function () {

    angular.module('loc8rApp').controller('aboutCtrl', aboutCtrl);

    function aboutCtrl() {
        var vm = this;

        vm.pageHeader = {
            title: 'About'
        };
        vm.main ={
            content : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n Nunc sed lorem ac nisi dignissim accumsan.'
        };
    }

})();