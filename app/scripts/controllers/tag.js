'use strict';

angular.module('bookmarksApp')
  .controller('TagCtrl', function ($scope, $rootScope, growl, TagManager) {
        $scope.items =  TagManager.tags;
        $scope.search = function(item) {
            $rootScope.search = angular.extend($rootScope.search, {text: item.title, field: 'tags', exact: true});
        }
        $scope.newItem = "";
        $scope.countBookmarksWithTag = TagManager.countBookmarksWithTag;
        $scope.addItem = function() {
            if(_.find($scope.items, function(t) {
                   return t.title === $scope.newItem;
                })) {
                growl.addErrorMessage("Duplicate Tags Not Allowed: " + $scope.newItem);
            }
            else if($scope.newItem.toString().length <= 0){
                growl.addErrorMessage("Tag Title Required");
            } else {
                TagManager.createTag({title: $scope.newItem}).$promise.then(function(resp){ 
                    growl.addSuccessMessage("Created Tag:" + resp.title);
                }).finally(function(){
                    $scope.newItem = "";    
                });
            }
        };
        $scope.update = function(item) {
            TagManager.updateTag(item).$promise.then(function(resp) {
                growl.addSuccessMessage("Updated Tag: " + resp.title);  
            });
        };
        $scope.removeItem = function (index) {
            TagManager.removeTag(index).$promise.then(function() {
                growl.addErrorMessage("Deleted Tag");
            });
        };
  });
