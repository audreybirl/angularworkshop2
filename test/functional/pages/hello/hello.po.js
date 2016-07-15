var AngularHomepage = function() {
  var firstName = element(by.model('user.firstname'));
  var lastName = element(by.model('user.lastname'));
  var updateBtn = element(by.css('.btn btn-primary'));
  var resetBtn = element(by.css('.btn btn-link'));


  this.get = function() {
    browser.get('http://www.angularjs.org');
  };

  this.setName = function(name) {
    nameInput.sendKeys(name);
  };

  this.getGreeting = function() {
    return greeting.getText();
  };
};
