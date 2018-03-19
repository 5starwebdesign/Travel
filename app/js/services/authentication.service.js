(function() {
  'use strict';

  angular
    .module('trips')
    .factory('AuthenticationService', AuthenticationService);

  AuthenticationService.$inject = ['$http', '$cookieStore', '$timeout', 'API_URL'];

  function AuthenticationService($http, $cookieStore, $timeout, API_URL) {
    var service = {};

    service.SetCredentials    = SetCredentials;
    service.ClearCredentials  = ClearCredentials;
    service.GetCredential     = GetCredential;
    service.CheckCredential   = CheckCredential;

    return service;

    function SetCredentials(field, value) {
      $cookieStore.put(field, value);
    }
    function ClearCredentials() {
      $cookieStore.remove('currentUser');
      $cookieStore.remove('token');
      $http.defaults.headers.common.Authorization = 'Basic';
    }
    function GetCredential(field) {
      return $cookieStore.get(field);
    }
    function CheckCredential() {
      var token = GetCredential('token');
      return !(angular.isUndefined(token) || token === null);
    }
  }
})();