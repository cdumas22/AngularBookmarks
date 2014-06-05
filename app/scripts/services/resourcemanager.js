'use strict';

angular.module('bookmarksApp')
    .factory('Resourcemanager', function (BookmarkApi, TagApi, $http) {
        var resources = {};
        resources.bookmarks = BookmarkApi.query();
        resources.tags = TagApi.query();
    
        var removeDeletedTagFromAllBookmarks = function(item) {
            for(var b in resources.bookmarks) {
                var bookmark = resources.bookmarks[b];
                for(var t in bookmark.tags) {
                    var tag = bookmark.tags[t];
                    if(tag._id === item._id){
                        bookmark.tags.splice(t,1);
                    }
                }
            }
        };
        var updateTagOnAllBookmarks = function(item) {
            for(var b in resources.bookmarks) {
                var bookmark = resources.bookmarks[b];
                for(var t in bookmark.tags) {
                    var tg = bookmark.tags[t];
                    if(tg._id === item._id) {
                        angular.extend(tg, item);   
                    }
                }
            }
        };

        return {
            resources: resources,
            createTag: function(tag) {
                var promise = TagApi.create(tag);
                promise.$promise.then(function(resp) {
                    resources.tags.unshift(resp);  
                });
                return promise;
            },
            updateTag: function(tag) {
                var promise = TagApi.update(tag);
                updateTagOnAllBookmarks(tag);
                return promise;
            },
            removeTag: function(index) {
                    var item = resources.tags.splice(index,1)[0];
                    removeDeletedTagFromAllBookmarks(item);
                    return TagApi.remove({},item);
            },
            countBookmarksWithTag: function(tag) {
                return _.filter(resources.bookmarks, function(bookmark) {
                    return _.find(bookmark.tags, function(t) {
                        return t.title === tag.title;
                    });
                }).length;
            },
            getBookmarks: function() {
                    var promise = resources.bookmarks;
                    resources.bookmarks.$promise.then(function(){
                        _.each(resources.bookmarks, function(bookmark) {
                            bookmark.shares = _.map(bookmark.shares, function(email) { return { email: email };});
                        });
                    });
                  return promise;
            },
            createBookmark: function(bookmark) {
                bookmark.shares = _.map(bookmark.shares, function(email) { return email.email; });
                var promise = BookmarkApi.create(bookmark);
                promise.$promise.then(function(resp) {
                    resources.bookmarks.unshift(resp);
                });
                return promise;
            },
            updateBookmark: function(bookmark) {
                bookmark.shares = _.map(bookmark.shares, function(share) { return share.email; });
                return BookmarkApi.update(bookmark);
            },
            removeBookmark: function(bookmark) {
                var item = resources.bookmarks.splice(resources.bookmarks.indexOf(bookmark),1)[0];
                return BookmarkApi.remove({},item);
            },
            removeFollowing: function(bookmark, user) {
                return $http.delete('/api/bookmarks/removeFollowing/' + bookmark._id).success(function() {
                     resources.bookmarks.splice(resources.bookmarks.indexOf(bookmark),1)[0]
                });
            }
        };
    });
