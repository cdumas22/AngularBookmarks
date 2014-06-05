'use strict';

angular.module('bookmarksApp')
  .factory('BookmarkApi', function ($resource) {
    return $resource("/api/bookmarks/:id", { id: "@_id" },{
        show: { method: 'GET' },
        create: { method: 'POST' },
        update: { method: 'PUT', params: {id: '@_id'} },
        remove: { method: 'DELETE'}
    });
  });
