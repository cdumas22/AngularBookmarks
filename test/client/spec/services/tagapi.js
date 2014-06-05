'use strict';

describe('Service: TagApi', function () {

  // load the service's module
  beforeEach(module('bookmarksApp'));

  // instantiate service
  var TagApi;
  beforeEach(inject(function (_TagApi_) {
    TagApi = _TagApi_;
  }));

  it('should do something', function () {
    expect(!!TagApi).toBe(true);
  });

});
