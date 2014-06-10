'use strict';

angular.module('bookmarksApp')
    .factory('BookmarkManager', function (BookmarkApi, $http, socket, growl) {
        var bookmarks = BookmarkApi.query();
        
        socket.on("update:bookmark", function(bookmark) {
            bookmark.shares = _.map(bookmark.shares, function(email) { return { email: email };});
            var b = _.find(bookmarks, function(b2) { return b2._id === bookmark._id });
            if(b) {
                angular.extend(b, bookmark);
            }
        });
        socket.on("new:bookmark", function(bookmark) {
            bookmark.shares = _.map(bookmark.shares, function(email) { return { email: email };});
            bookmarks.unshift(bookmark);
        });
        socket.on("delete:bookmark", function(bookmark) {
            bookmark.shares = _.map(bookmark.shares, function(email) { return { email: email };});
            var b = _.find(bookmarks, function(b2) { return b2._id === bookmark._id });
            var removed = bookmarks.splice(bookmarks.indexOf(b),1)[0];
        });
        
        socket.on("delete:sharing", function(bookmark) {
            bookmark.shares = _.map(bookmark.shares, function(email) { return { email: email };});
            var removed = bookmarks.splice(bookmarks.indexOf(bookmark),1)[0];
        });
        socket.on("new:sharing", function(bookmark) {
            bookmark.shares = _.map(bookmark.shares, function(email) { return { email: email };});
            bookmarks.unshift(bookmark);
        });
        
        return {
            bookmarks: bookmarks,
            getBookmarks: function() {
                    var promise = bookmarks;
                    promise.$promise.then(function(){
                        _.each(bookmarks, function(bookmark) {
                            bookmark.shares = _.map(bookmark.shares, function(email) { return { email: email };});
                        });
                    });
                  return promise;
            },
            createBookmark: function(bookmark) {
                bookmark.shares = _.map(bookmark.shares, function(email) { return email.email; });
                return BookmarkApi.create(bookmark);
            },
            updateBookmark: function(bookmark) {
                bookmark.shares = _.map(bookmark.shares, function(share) { return share.email; });
                return BookmarkApi.update(bookmark);
            },
            removeBookmark: function(bookmark) {
                return BookmarkApi.remove({},bookmark);
            },
            removeFollowing: function(bookmark) {
                return $http.delete('/api/bookmarks/removeFollowing/' + bookmark._id);
            }  
        };
    }
);
