angular.module('SampleApp.hello').
    factory('helloRestService', ['urlFactory', 'restService',
        function (urlFactory, restService) {
            'use strict';
            var getTestData = function (requestData) {
                return restService.get(urlFactory.getUrl('testendpoint', requestData));
            };
            return {
                getTestData: getTestData
            };
        }]);
