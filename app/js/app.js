(function() {
  'use strict';

  angular
    .module('trips', [
      'ngRoute',
      'ngCookies',
      'ngPassword',
      'daterangepicker',
      'ngTable',
      'ui.bootstrap',
      'ngAnimate',
      'ngSanitize',
      'mgcrea.ngStrap',
      'angular-momentjs',
      'angularSpinner'
    ])
    .config(config)
    .constant('ROLE', {
      ADMIN: 0,
      USER_MANAGER: 1,
      REGULAR_USER: 2
    })
    .constant('DATE_FORMAT', 'YYYY-MM-DD')
    .constant('TIME_FORMAT', 'HH:mm')
    .constant('API_URL', 'http://192.168.0.28/api/')
    .factory('httpRequestInterceptor', function () {
      return {
        request: function (config) {
          config.headers['Authorization'] = 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==';
          config.headers['Accept'] = 'application/json;odata=verbose';
          return config;
        }
      };
    });

  config.$inject = ['$routeProvider', '$momentProvider', '$modalProvider'];

  function config($routeProvider, $momentProvider, $modalProvider) {
    $routeProvider
      .when('/admin-home', {
        controller: 'AdminHomeController',
        templateUrl: 'public/views/admin.home.view.html',
        controllerAs: 'vm'
      })
      .when('/user-manager-home', {
        controller: 'UserManagerHomeController',
        templateUrl: 'public/views/usermanager.home.view.html',
        controllerAs: 'vm'
      })
      .when('/regular-user-home', {
        controller: 'RegularUserHomeController',
        templateUrl: 'public/views/regularuser.home.view.html',
        controllerAs: 'vm'
      })
      .when('/login', {
        controller: 'LoginController',
        templateUrl: 'public/views/login.view.html',
        controllerAs: 'vm'
      })
      .when('/register', {
        controller: 'RegisterController',
        templateUrl: 'public/views/register.view.html',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/login'
      });

    $momentProvider
      .asyncLoading(false)
      .scriptUrl('node_modules/moment/min/moment.min.js');

    angular
      .extend($modalProvider.defaults, {
        html: true
      });
  }
})();