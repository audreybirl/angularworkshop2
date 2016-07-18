angular.module('workshopApp.features.user').factory('userRestService', ['urlFactory', 'restService',
  function (urlFactory, restService) {
    'use strict';
    var getUserData = function (requestData) {
      return restService.get(urlFactory.getUrl('testendpoint', requestData));
    };
    var updateUserData = function (requestData) {
      return restService.put(urlFactory.getUrl('testendpoint') + requestData.id, requestData)
    };

    return {
      getUserData: getUserData,
      updateUserData: updateUserData
    };
  }]);
