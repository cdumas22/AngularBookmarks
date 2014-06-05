'use strict';

angular.module('bookmarksApp')
  .directive('popupOptions', function () {
    return {
        
      template: '<div hm-hold="popupOptionsOpenOptions()"></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        element.text('this is the popupOptions directive');
      }
    };
  });
