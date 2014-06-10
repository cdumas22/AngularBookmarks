'use strict';

describe('Service: tagmanager', function () {

  // load the service's module
  beforeEach(module('bookmarksApp'));

  // instantiate service
  var tagmanager;
  beforeEach(inject(function (_tagmanager_) {
    tagmanager = _tagmanager_;
  }));

  it('should do something', function () {
    expect(!!tagmanager).toBe(true);
  });

});
