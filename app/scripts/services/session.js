'use strict';

angular.module('bookmarksApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
