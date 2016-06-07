(function() {
    'use strict';

    angular
        .module('SampleApp.features.userdetails')
        .directive('userdetails', UserdetailsDirective);

    UserdetailsDirective.$inject = [];
    function UserdetailsDirective() {
        return {
            restrict: 'AE',
            controller: 'UserdetailsController',
            templateUrl: 'userdetails/userdetails.html',
            controllerAs: 'vm'
        };
    }
})();
