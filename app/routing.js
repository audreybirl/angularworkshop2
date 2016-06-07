(function () {

'use strict';

  angular.module('SampleApp', 
    [
    'ngRoute',
    'ngAnimate',
    'SampleApp.core.services.rest',
    'SampleApp.config',
    'SampleApp.hello',
    'SampleApp.features.userdetails',
    'ui.bootstrap'
    ])
  .config([
    '$locationProvider',
    '$routeProvider',

    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      $routeProvider
        .when("/", {
          templateUrl: "./hello/hello.html",
          controller: "HelloController"
        })
        .when('/userdetails', {
		    templateUrl: 'userdetails/userdetails.html',
		    controller: 'UserdetailsController',
		    controllerAs: 'vm'
		    })
        .otherwise({
           redirectTo: '/'
        });
    }
  ]);

}());