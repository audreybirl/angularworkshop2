angular.module('SampleApp.config', [])
    .factory('config', [function () { 'use strict';
        var defaultConfig = {
                testEndPoint: '/testendpoint'
        	};

        return defaultConfig;
    }]);
