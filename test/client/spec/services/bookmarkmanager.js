'use strict';

describe('Service: bookmarkmanager', function () {

  // load the service's module
  beforeEach(module('bookmarksApp'));

  // instantiate service
  var bookmarkmanager;
  beforeEach(inject(function (_bookmarkmanager_) {
    bookmarkmanager = _bookmarkmanager_;
  }));

  it('should do something', function () {
    expect(!!bookmarkmanager).toBe(true);
  });

});
