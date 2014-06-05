'use strict';

describe('Service: BookmarkApi', function () {

  // load the service's module
  beforeEach(module('bookmarksApp'));

  // instantiate service
  var BookmarkApi;
  beforeEach(inject(function (_BookmarkApi_) {
    BookmarkApi = _BookmarkApi_;
  }));

  it('should do something', function () {
    expect(!!BookmarkApi).toBe(true);
  });

});
