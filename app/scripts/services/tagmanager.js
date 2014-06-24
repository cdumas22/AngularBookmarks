'use strict';

angular.module('bookmarksApp')
    .factory('TagManager', function (BookmarkManager, TagApi, socket) {
        var tags = TagApi.query();
        
        var removeDeletedTagFromAllBookmarks = function(item) {
            for(var b in BookmarkManager.bookmarks) {
                var bookmark = BookmarkManager.bookmarks[b];
                for(var t in bookmark.tags) {
                    var tag = bookmark.tags[t];
                    if(tag._id === item._id){
                        bookmark.tags.splice(t,1);
                    }
                }
            }
        };
        var updateTagOnAllBookmarks = function(item) {
            for(var b in BookmarkManager.bookmarks) {
                var bookmark = BookmarkManager.bookmarks[b];
                for(var t in bookmark.tags) {
                    var tg = bookmark.tags[t];
                    if(tg._id === item._id) {
                        angular.extend(tg, item);   
                    }
                }
            }
        };
        
        
        socket.on("update:tag", function(tag) {
            var t = _.find(tags, function(t2) { return t2._id === tag._id });
            if(t) {
                var t = angular.extend(t, tag);
                updateTagOnAllBookmarks(t);
            }
        });
        socket.on("new:tag", function(tag) {
            tags.unshift(tag);
        });
        socket.on("delete:tag", function(tag) {
            var t = _.find(tags, function(t2) { return t2._id === tag._id });
            var removed = tags.splice(tags.indexOf(t),1)[0];
            removeDeletedTagFromAllBookmarks(removed);
        });
        
        return {
            tags: tags,
            createTag: function(tag) {
                return TagApi.create(tag);
            },
            updateTag: function(tag) {
                return TagApi.update(tag);
            },
            removeTag: function(index) {
                return TagApi.remove({},tags[index]);
            },
            countBookmarksWithTag: function(tag) {
                return _.filter(BookmarkManager.bookmarks, function(bookmark) {
                    return _.find(bookmark.tags, function(t) {
                        return t.title === tag.title;
                    });
                }).length;
            }
        };
    }
);
