'use strict';

angular.module('bookmarksApp')
    .controller('BookmarkCtrl', function ($scope, $rootScope,growl, $modal, $swipe, Resourcemanager) {
        var emptyItem = { 
            title: "", 
            description:"",
            url:"",
            created: new Date(), 
            updated: new Date(), 
            count:0,
            favicon: "",
            tags:[], 
            user: $rootScope.currentUser 
        };
        var dispayOptions = {
            title: true,
            visits: true,
            description: false,
            tags: true,
            shares: false,
            owner: false,
            updated: false
        };
        var searchOptions = {
            text: "",
            sorting: "title",
            sortAsc: false,
            field: 'All',
            exact: false
        };
        
        $scope.items = Resourcemanager.getBookmarks();
    
        $scope.$watch('search', function() { $scope.$broadcast('masonry.reload');  }, true);
        $scope.$watch('display', function() { $scope.$broadcast('masonry.reload');  }, true);
        
        $scope.search = $rootScope.search = angular.copy(searchOptions);
        $scope.display = angular.copy(dispayOptions);
        
        $scope.viewDetails = function(item) {
            $modal.open({
                templateUrl: 'partials/Bookmarks/view.html',
                controller: 'ViewBookmarkModalController',
                resolve: {
                    item: function() {
                        return item;
                    }
                }
            });
        };
        
        $scope.onDrop = function($event,$data,bookmark){
            if(!_.find(bookmark.tags, function(tag) {return tag.title === $data.title;}) && 
               $rootScope.currentUser._id === bookmark.user._id){
                bookmark.tags.push($data);
                Resourcemanager.updateBookmark(bookmark).$promise.then(function(resp) {
                    $scope.$broadcast('masonry.reload'); 
                    growl.addSuccessMessage("Added Tag: " + $data.title + " to " + resp.title);
                });
            }
        };
        $scope.resetSearch = function() {
            $scope.search = angular.extend($scope.search,  searchOptions); 
            growl.addInfoMessage("Reset Search Parameters"); 
        };
        $scope.resetDisplay = function() {
            $scope.display = angular.extend($scope.display, dispayOptions);  
            growl.addInfoMessage("Reset Field Disply Options"); 
        };
        
        $scope.sortAsc = function(asc) { 
            $scope.search.sortAsc = asc; 
        };
        $scope.sortBy = function(field) { 
            $scope.search.sorting = field; 
        };
        $scope.showSearchField = function() { $scope.mainSearchField.$show();}
        
        $scope.filterBy = function() {
            if($scope.search.field !== 'All' && $scope.search.text !== "") {
                var obj = {};
                obj[$scope.search.field] = $scope.search.text;
                return obj; 
            }
            return $scope.search.text;
        };
        
        $scope.newItem = function () {
            $modal.open({
                templateUrl: 'partials/Bookmarks/edit.html',
                controller: 'EditBookmarkModalController',
                resolve: {
                    item: function() {
                        return angular.copy(emptyItem);
                    }
                }
            }).result.then(function(obj){
                 Resourcemanager.createBookmark(obj.newItem).$promise.then(function(resp){
                    $scope.$broadcast('masonry.reload'); 
                    growl.addSuccessMessage("Created Item: " + resp.title);
                 });
            });
        };
        
        $scope.incrementCounter = function(item) {
            if($rootScope.currentUser._id === bookmark.user._id) {
                item.count += 1;
                Resourcemanager.updateBookmark(item).$promise.then(function(resp) {
                    growl.addSuccessMessage(resp.count + " visits for: " + resp.title);    
                });
            }
        };
    })
    .controller("EditBookmarkModalController", function($scope, $modalInstance, Resourcemanager, item) {
        $scope.item = angular.copy(item);
        
        $scope.loadTags = function($query){
            return Resourcemanager.resources.tags.$promise;
        }
        
        $scope.changed = function() {
            return angular.equals(item, $scope.item);  
        };
        
        $scope.ok = function () {
            $scope.item.updated = new Date();
            angular.extend(item,$scope.item);
            $modalInstance.close({newItem: $scope.item, oldItem:item});
        };
        
        $scope.cancel = $modalInstance.dismiss;
    })
    .controller("ViewBookmarkModalController", function($scope, $rootScope, $modal, $modalInstance, growl, Resourcemanager, item) {
        $scope.item = item;

        $scope.owner = function(bookmark, user) {
            return bookmark.user._id === user._id;
        };
        
        $scope.incrementCounter = function(item) {
            item.count += 1;
            Resourcemanager.updateBookmark(item).$promise.then(function(resp) {
                growl.addSuccessMessage(resp.count + " visits for: " + resp.title);    
            });
        };
        
        $scope.removeFollowing = function(bookmark) {
            Resourcemanager.removeFollowing(bookmark, $rootScope.currentUser).success(function(){
                $scope.$broadcast('masonry.reload'); 
                growl.addErrorMessage("Stopped following bookmark");
                $modalInstance.close();
            });
        };
        
        $scope.removeItem = function (bookmark) {
            Resourcemanager.removeBookmark(bookmark).$promise.then(function(){
                $scope.$broadcast('masonry.reload'); 
                growl.addErrorMessage("Deleted bookmark");
                $modalInstance.close();
            });
        };
        
        $scope.editItem = function (item) {
            $modal.open({
                templateUrl: 'partials/Bookmarks/edit.html',
                controller: 'EditBookmarkModalController',
                resolve: {
                    item: function() {
                        return item;
                    }
                }
            }).result.then(function(result){
                Resourcemanager.updateBookmark(result.newItem).$promise.then(function(resp) {
                    $scope.$broadcast('masonry.reload'); 
                    growl.addSuccessMessage("Updated Item: " + resp.title);
                });
            });
        };
        
        $scope.close = $modalInstance.close;
    });
