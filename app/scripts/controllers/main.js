'use strict';

angular.module('bookmarksApp')

.factory('bookmarkapi', function($resource) {
    return $resource("/api/bookmarks/:id", { id: "@_id" },{
        show: { method: 'GET' },
        create: { method: 'POST' },
        update: { method: 'PUT', params: {id: '@_id'} },
        remove: { method: 'DELETE'}
    });
})
.factory('tagapi', function($resource) {
    return $resource("/api/tags/:id", { id: "@_id" },{
        show: { method: 'GET' },
        create: { method: 'POST' },
        update: { method: 'PUT', params: {id: '@_id'} },
        remove: { method: 'DELETE'} 
    });
})
.service('resourcemanager', function(tagapi, bookmarkapi) {
    var resources = {};
    resources.bookmarks = bookmarkapi.query();
    resources.tags = tagapi.query();

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
            var promise = tagapi.create(tag);
            promise.$promise.then(function(resp) {
                resources.tags.unshift(resp);  
            });
            return promise;
        },
        updateTag: function(tag) {
            var promise = tagapi.update(tag);
            updateTagOnAllBookmarks(tag);
            return promise;
        },
        removeTag: function(index) {
                var item = resources.tags.splice(index,1)[0];
                removeDeletedTagFromAllBookmarks(item);
                return tagapi.remove({},item);
        },
        countBookmarksWithTag: function(tag) {
            return _.filter(resources.bookmarks, function(bookmark) {
                return _.find(bookmark.tags, function(t) {
                    return t.name === tag.name;
                });
            }).length;
        },
        createBookmark: function(bookmark) {
            var promise = bookmarkapi.create(bookmark);
            promise.$promise.then(function(resp) {
                resources.bookmarks.unshift(bookmark);
            });
            return promise;
        },
        updateBookmark: function(bookmark) {
            return bookmarkapi.update(bookmark);
        },
        removeBookmark: function(bookmark) {
            var item = resources.bookmarks.splice(resources.bookmarks.indexOf(bookmark),1)[0];
            return bookmarkapi.remove({},item);
        }
    };
})
.directive('resize', function ($window) {
    return function (scope, element) {
        var top = element.offset().top;
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return { 'h': w.height() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function () {
                return { 
                    'height': (newValue.h - top) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
})
.directive('ngConfirmClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngConfirmMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngConfirmClick);
                }
            });
        }
    }
}])
.controller("usersController", function($scope, growl){})
.controller("mainCtrl", function($scope){
    alert("here");
})
.controller("tagsController", function($scope, growl, resourcemanager){

    $scope.items =  resourcemanager.resources.tags;

    $scope.newItem = "";
    $scope.countBookmarksWithTag = resourcemanager.countBookmarksWithTag;
    $scope.addItem = function() {
        if(_.find($scope.items, function(t) {
               return t.name === $scope.newItem;
            })) {
            growl.addErrorMessage("Duplicate Tags Not Allowed: " + $scope.newItem);
        }
        else if($scope.newItem.toString().length <= 0){
            growl.addErrorMessage("Tag Name Required");
        } else {
            resourcemanager.createTag({name: $scope.newItem}).$promise.then(function(resp){ 
                growl.addSuccessMessage("Created Tag:" + resp.name);
            }).finally(function(){
                $scope.newItem = "";    
            });
        }
    };
    $scope.update = function(item) {
        resourcemanager.updateTag(item).$promise.then(function(resp) {
            growl.addSuccessMessage("Updated Tag: " + resp.name);  
        });
    };
    $scope.removeItem = function (index) {
        resourcemanager.removeTag(index).$promise.then(function() {
            growl.addErrorMessage("Deleted Tag");
        });
    };
})
.controller("bookmarksController", function($scope, growl, $modal, $swipe, resourcemanager){
    $scope.items = resourcemanager.resources.bookmarks;
    
    $scope.items.sorting = "title";
    $scope.items.sortAsc = false;
    
    $scope.search = {
        text: ""
    };
    
    $scope.onDrop = function($event,$data,bookmark){
        if(!_.find(bookmark.tags, function(tag) {
                return tag.name === $data.name;
            })){
            bookmark.tags.push($data);
            resourcemanager.updateBookmark(bookmark).$promise.then(function(resp) {
                growl.addSuccessMessage("Added Tag: " + $data.name + " to " + resp.title);
            });
        }
    };
    
    $scope.incrementCounter = function(item) {
        item.count += 1;
        resourcemanager.updateBookmark(item).$promise.then(function(resp) {
            growl.addSuccessMessage(resp.count + " visits for: " + resp.title);    
        });
    };
    
    $scope.removeItem = function (bookmark) {
        resourcemanager.removeBookmark(bookmark).$promise.then(function(){
            growl.addErrorMessage("Deleted bookmark");
        });
    };
    
    $scope.editItem = function (item) {
        openEditModal(item).result.then(function(result){
            resourcemanager.updateBookmark(result.newItem).$promise.then(function(resp) {
                growl.addSuccessMessage("Updated Item: " + resp.title);
            });
        });
    };
    
    $scope.newItem = function () {
        openEditModal(angular.copy(emptyItem)).result.then(function(obj){
             resourcemanager.createBookmark(obj.newItem).$promise.then(function(resp){
                growl.addSuccessMessage("Created Item: " + resp.title);
             });
        });
    };
    
    var emptyItem = { title: "", description:"",url:"",created: new Date(), updated: new Date(), count:0,favicon: "",tags:[] }
    
    function openEditModal(item){
        return $modal.open({
            templateUrl: 'editItemModal.tmlp.html',
            controller: 'EditBookmarkModalController',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    }
})
.controller("EditBookmarkModalController", function($scope, $modalInstance, resourcemanager, item) {
    $scope.item = angular.copy(item);
    
    $scope.loadTags = function($query) {
         return resourcemanager.resources.tags.$promise; 
    };
    
    $scope.changed = function() {
        return angular.equals(item, $scope.item);  
    };
    $scope.ok = function () {
        $scope.item.updated = new Date();
        angular.extend(item,$scope.item);
        $modalInstance.close({newItem: $scope.item, oldItem:item});
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})
;
