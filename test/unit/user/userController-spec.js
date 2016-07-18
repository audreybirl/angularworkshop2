describe('workshopApp.features.user', function () {
  'use strict';

  var ctrl,
      $timeout,
      userRestService,
      $controller,
      $rootScope,
      $scope,
      $q,
      mockUser,
      resType;

  // load the dependent modules
  beforeEach(function() {
    module('workshopApp.config');
    module('workshopApp.core.services.rest');
    module('workshopApp.features.user');
  });

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {

    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $timeout = $injector.get('$timeout');
    userRestService = $injector.get('userRestService');
    $scope = $rootScope.$new();

    mockUser = { firstname: "les", lastname: "brown" };

    spyOn(userRestService, 'getUserData').and.callFake(function () {
      return $q.resolve([mockUser]);
    });

    spyOn(userRestService, 'updateUserData').and.callFake(function () {
      if (resType == "success") {
        return $q.resolve([mockUser]);
      } else {
        return $q.reject([mockUser]);
      }
    });

    ctrl = $controller('UserController as ctrl', {
      $scope: $scope
    });

  }));

  //tests
  it('on init of controller', function () {
    expect(ctrl.test).toBe("Angular test");
    expect(userRestService.getUserData).toHaveBeenCalled();
    $scope.$digest();
    expect(ctrl.user).toEqual(mockUser);
  });

  it('on resetting the form', function () {
    ctrl.user = {
      firstname: "Zig",
      lastname: "Zigler"
    };
    ctrl.reset();
    expect(ctrl.user.firstname).toBe("");
    expect(ctrl.user.lastname).toBe("");
  });

  it('on updating the user info - success', function () {
    var user = { firstname: "Zig", lastname: "Zigler" };
    resType = "success";
    ctrl.user = user;
    ctrl.update();
    expect(userRestService.updateUserData).toHaveBeenCalledWith(user);
    $scope.$digest();
    expect(ctrl.response).toEqual({success: "User is created successfully!"});
  });

  it('on updating the user info - error', function () {
    var user = { firstname: "Zig", lastname: "Zigler" };
    resType = "error";
    ctrl.user = user;
    ctrl.update();
    expect(userRestService.updateUserData).toHaveBeenCalledWith(user);
    $scope.$digest();
    expect(ctrl.response).toEqual({error: "Something went wrong. Please bear with us, our top men looking into it!!"});
  });

});
