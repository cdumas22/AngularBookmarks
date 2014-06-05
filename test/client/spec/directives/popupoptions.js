'use strict';

describe('Directive: popupOptions', function () {

  // load the directive's module
  beforeEach(module('bookmarksApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<popup-options></popup-options>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the popupOptions directive');
  }));
});
