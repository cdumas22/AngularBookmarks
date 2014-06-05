'use strict';

describe('Directive: httpPrefix', function () {

  // load the directive's module
  beforeEach(module('bookmarksApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<http-prefix></http-prefix>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the httpPrefix directive');
  }));
});
