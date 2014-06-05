'use strict';

describe('Service: Resourcemanager', function () {

  // load the service's module
  beforeEach(module('bookmarksApp'));

  // instantiate service
  var Resourcemanager;
  beforeEach(inject(function (_Resourcemanager_) {
    Resourcemanager = _Resourcemanager_;
  }));

  it('should do something', function () {
    expect(!!Resourcemanager).toBe(true);
  });

});
