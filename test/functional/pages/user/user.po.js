'use strict';

var _ = require('lodash');

function userProfile(el) {
  this.el = el;
  this.firstName = this.el(by.model('vm.user.firstname'));
  this.lastName = this.el(by.model('vm.user.lastname'));
  this.updateBtn = this.el(by.css('[ng-click="vm.update()"]'));
  this.resetBtn = this.el(by.css('[ng-click="vm.reset()"]'));
}


_.assign(userProfile.prototype, {

  loadUserView : function() {
    return browser.get('/#!/profile');
  },

  getFirstName : function() {
    return this.firstName.getAttribute('value');
  },

  getLastName : function() {
    return this.lastName.getAttribute('value');
  },

  setFirstName : function(firstName) {
    this.firstName.sendKeys(firstName);
  },

  setLastName : function(lastName) {
    this.lastName.sendKeys(lastName);
  },

  update : function() {
    this.updateBtn.click();
  },

  reset : function() {
    this.resetBtn.click();
  }

});

module.exports = userProfile;

