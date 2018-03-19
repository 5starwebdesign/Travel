(function() {
  'use strict';

  angular
    .module('trips')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService', 'ROLE', 'RestAPI'];

  function LoginController($location, AuthenticationService, FlashService, ROLE, RestAPI) {
    var vm = this;

    vm.login = login;
    vm.goTo  = goTo;

    (function initController() {
      if (!!AuthenticationService.GetCredential('token')) {
        RestAPI.Logout(function(response) {
          if (!response.resultCode) {
            FlashService.Success('You have been logged out!');
          }
        });
      }
      AuthenticationService.ClearCredentials();
    })();

    function login() {
      vm.dataLoading = true;
      RestAPI.Login(vm.username, vm.password, function(response) {
        if (!response.data.ERROR) {
          vm.currentUser = {};
          vm.currentUser.username = response.data.RESPONSE.username;
          vm.currentUser.id       = +response.data.RESPONSE.id;
          vm.currentUser.role     = +response.data.RESPONSE.user_type;
          vm.token                = response.data.API_TOKEN;
          AuthenticationService.SetCredentials('currentUser', vm.currentUser);
          vm.dataLoading = false;
          switch(vm.currentUser.role) {
            case ROLE.ADMIN:
              $location.path('/admin-home');
              break;
            case ROLE.USER_MANAGER:
              $location.path('/user-manager-home');
              break;
            case ROLE.REGULAR_USER:
              $location.path('/regular-user-home');
              break;
          }
        } else {
          FlashService.Error('Invalid Login Credential!');
          vm.dataLoading = false;
        }
      });
    }

    function goTo (location) {
      $location.path('/' + location);
    }
  }
})();