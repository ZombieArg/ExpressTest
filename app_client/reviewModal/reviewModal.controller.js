/**
 * Created by Zombie on 02/08/2016.
 */


(function () {

    angular.module('loc8rApp').controller('reviewModalCtrl', reviewModalCtrl);

    reviewModalCtrl.$inject = ['$uibModalInstance','loc8rData','locationData']; //Inject $modalInstance intro controller, Inject new parameter from modal definition

    function reviewModalCtrl($uibModalInstance,loc8rData, locationData) { //Inject loc8rData as a dependency

        vm = this;
        vm.locationData = locationData;  //Save parameter into view model
        vm.modal = { //Create modal.cancel() method and use it to call $modalInstance.dismiss method
            cancel : function () {
                $uibModalInstance.dismiss('cancel');
            },
            close : function (result) {
                $uibModalInstance.close(result); //Create helper method to call modal instance close method passing through supplied data
            }
        };

        vm.onSubmit = function () {
            vm.formError = ""; //Reset any existing errors

            if(!vm.formData.name || !vm.formData.rating || !vm.formData.reviewText){ //IF any form fields are false set an error message
                vm.formError = "All fields are required, please try again";
                return false;
            }else{
                vm.doAddReview(vm.locationData.locationid, vm.formData); //On sucessful form submission send details to new function
            }

        }
        
        vm.doAddReview = function (locationid , formData) {
            loc8rData.addReviewById(locationid, { //New functions formats data and send it to new service method
                author: formData.name,
                rating: formData.rating,
                reviewText: formData.reviewText
            })
                .success(function (data) { //If service return as succesfull outputs a message to console
                    console.log("Success!");
                    vm.modal.close(data); //When new review has been successfully added to database send returned data to modal close helper method
                })
                .error(function () {
                    vm.formError = "Your review has not been saved, try again"; //Otherwise use formError to display an alert message in modal
                });
            return false;
        };

    }
})();