(function() {
  'use strict';

  angular
    .module('trips')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', 'FlashService', 'RestAPI', 'AuthenticationService', 'ROLE'];

  function RegisterController($location, FlashService, RestAPI, AuthenticationService, ROLE) {
    var vm = this;

    vm.register = register;

    (function initController() {
      AuthenticationService.ClearCredentials();
    })();

    function register() {
      vm.dataLoading = true;
      RestAPI.Register(vm.username, vm.password, ROLE.REGULAR_USER, function(response) {
        if (!response.data.ERROR) {
          FlashService.Success("Successfully registered!");
          vm.currentUser = {};
          vm.currentUser.username = response.data.RESPONSE.username;
          vm.currentUser.id       = +response.data.RESPONSE.id;
          vm.currentUser.role     = +response.data.RESPONSE.role;
          vm.token                = response.data.API_TOKEN;
          AuthenticationService.SetCredentials('currentUser', vm.currentUser);
          AuthenticationService.SetCredentials('token', vm.token);
          vm.dataLoading = false;
          $location.path('/regular-user-home');
        } else {
          var message = "Failed to register! ";
          if (response.data.RESPONSE.username) {
            angular.forEach(response.data.RESPONSE.username, function(value, key) {
              message += value + ' ';
            });
          }
          if (response.data.RESPONSE.password) {
            angular.forEach(response.data.RESPONSE.password, function(value, key) {
              message += value + ' ';
            });
          }
          if (response.data.RESPONSE.user_type) {
            angular.forEach(response.data.RESPONSE.user_type, function(value, key) {
              message += value + ' ';
            });
          }
          FlashService.Error(message);
          vm.dataLoading = false;
        }
      });
    }
  }
})();