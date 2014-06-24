'use strict';

angular.module('bookmarksApp')
  .factory('socket', function (socketFactory, Auth) {
      var socket = socketFactory();
      socket.on('connect', function() {
          Auth.currentUser().$promise.then(function(user) {
              if(!user) {
                console.error("user is not set, could not connect session");
                return null;
              }
              socket.emit("setUser", user);
          });
      });
      
      return socket;
  });
