 (function () {
  //Load controller
  angular.module('SampleApp.hello', [])

  .controller('HelloController', [
    '$scope',
    'helloRestService',
    function($scope, helloRestService) {
      $scope.test = "Testing...";

      helloRestService.getTestData().
                then(function (results) {
                    $scope.created = results;
                });

    }
  ]);

}());