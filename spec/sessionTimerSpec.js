'use strict';

describe('Directive: sessionTimer', function () {

  // load the directive's module
  beforeEach(module('aDoro'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<session-timer></session-timer>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the sessionTimer directive');
  }));
});