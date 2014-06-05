'use strict';

angular.module('bookmarksApp')
  .factory('TagApi', function ($resource) {
    return $resource("/api/tags/:id", { id: "@_id" },{
        show: { method: 'GET' },
        create: { method: 'POST' },
        update: { method: 'PUT', params: {id: '@_id'} },
        remove: { method: 'DELETE'} 
    });
  });
