'use strict';

angular.module('bookmarksApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'xeditable',
  'snap',
  'angular-growl', 
  'ui.bootstrap',
  'ngAnimate',
  'ngDragDrop', 
  'ngTouch', 
  'ngResource',
  'ngTagsInput', 
  'wu.masonry',
  'hmTouchEvents',
  'cfp.hotkeys'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider, growlProvider) {
    growlProvider.globalTimeToLive(3000);
    growlProvider.onlyUniqueMessages(false);  
    
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/app', {
        templateUrl: 'partials/Bookmarks/bookmarks',
        controller: 'BookmarkCtrl',
        hotkeys: [
            ['alt+shift+f', 'Focus on Search Field', 'showSearchField()'],
            ['alt+r', 'Reset Search', 'resetSearch()'],
            ['alt+shift+r', 'Reset Display Fields', 'resetDisplay()'],
            ['alt+n', 'Create New Bookmark', 'newItem()'],
            ['alt+up', 'Sort Ascending', 'sortAsc(true)'],
            ['alt+down', 'Sort Descending', 'sortAsc(false)'],
            ['alt+t', 'Sort By Title', 'sortBy("title")'],
            ['alt+shift+d', 'Sort By Description', 'sortBy("description")'],
            ['alt+v', 'Sort By Visit Count', 'sortBy("count")'],
            ['alt+c', 'Sort Create Date', 'sortBy("created")']        
        ]
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth, editableOptions) {
      editableOptions.theme = 'bs3';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });