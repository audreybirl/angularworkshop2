(function () {
  //Load controller
  angular.module('workshopApp.features.user')
  .controller('UserController', [
        '$timeout',
        'userRestService',
        function ($timeout, userRestService) {

          var vm = this;

          vm.test = "Angular test";

          userRestService.getUserData().then(function (results) {
            console.log(results[0]);
            vm.user = results[0];
          });

          vm.reset = function () {
            vm.user.firstname = vm.user.lastname = "";
          };

          vm.update = function () {
              userRestService.updateUserData(vm.user).then(function(response) {
                vm.response = {
                  success : "User is created successfully!"
                };
                $timeout(function() {
                  vm.response = {};
                }, 3000);
              }).catch(function(error){
                //handle the error
                vm.response = {
                  error : "Something went wrong. Please bear with us, our top men looking into it!!"
                };
                $timeout(function() {
                  vm.response = {};
                }, 3000);
              });
          };

        }
      ]);

}());
