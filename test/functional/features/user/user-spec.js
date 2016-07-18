'use strict';

var mock = require('protractor-http-mock');

describe('User Profile Functionality', function() {

  var userProfile = require('../../pages/user/user.po.js'),
      user;

  beforeEach(function() {
      mock(['user']);
      user = new userProfile(element);
      user.loadUserView();
  });

  afterEach(function () {
      mock.teardown();
  });

  it('on init of user view', function() {
      expect(browser.getCurrentUrl()).toBe('http://localhost:8888/#!/profile');
      expect(user.getFirstName()).toBe('Les');
      expect(user.getLastName()).toBe('Brown');
  });

  it('on click reset btn should empty user details', function() {
      expect(user.getFirstName()).toBe('Les');
      expect(user.getLastName()).toBe('Brown');
      user.reset();
      expect(user.getFirstName()).toBe('');
      expect(user.getLastName()).toBe('');
  });

  it('on click update btn should update the user details', function() {
      expect(user.getFirstName()).toBe('Les');
      expect(user.getLastName()).toBe('Brown');
      user.reset();
      user.setFirstName('Zig');
      user.setLastName('Zigler');
      user.update();
      expect(user.getFirstName()).toBe('Zig');
      expect(user.getLastName()).toBe('Zigler');
  });

});
