(function() {
  'use strict';

  angular
    .module('trips')
    .controller('AdminHomeController', AdminHomeController);

  AdminHomeController.$inject = ['$location', '$scope', 'AuthenticationService', 'RestAPI', 'NgTableParams', '$modal', 'ROLE', '$alert', 'usSpinnerService'];

  function AdminHomeController($location, $scope, AuthenticationService, RestAPI, NgTableParams, $modal, ROLE, $alert, usSpinnerService) {
    var vm = this;
    vm.roles = [
      {
        value: ROLE.ADMIN,
        label: "Admin"
      }, {
        value: ROLE.USER_MANAGER,
        label: "User Manager"
      }, {
        value: ROLE.REGULAR_USER,
        label: "Regular User"
      }
    ];
    vm.gModal = {};
    vm.ROLE = ROLE;
    initController();
    function initController() {
      if (!AuthenticationService.CheckCredential()) $location.path('/login');
      vm.currentUser = AuthenticationService.GetCredential('currentUser');
      vm.currentUser.role = +vm.currentUser.role;
      vm.currentUser.id = +vm.currentUser.id;
      var index = -1;
      RestAPI.GetUsers(function(response) {
        vm.users = response.data.RESPONSE;
        vm.users.forEach(function(user, key) {
          user.id = +user.id;
          if (user.id == vm.currentUser.id) {
            index = key;
          }
        });
        if (index != -1) {
          vm.users.splice(index, 1);
        }
        vm.tableParams = new NgTableParams({}, { dataset: vm.users});
      });
    }
    $scope.showModal = function(data) {
      var modalContent;
      modalContent = {
        scope: $scope,
        templateUrl: 'public/views/',
        show: false,
        backdrop: false
      };
      switch(data.cmd) {
        case 'create':
          modalContent.title = 'Add User';
          modalContent.templateUrl += 'adduser.modal.html';
          break;
        case 'delete':
          modalContent.title = 'Confirmation';
          modalContent.templateUrl += 'deleteuser.modal.html';
          vm.selected_user = data.user;
          break;
        case 'edit':
          modalContent.title = 'Edit User';
          modalContent.templateUrl += 'edituser.modal.html';
          vm.selected_user = data.user;
          vm.edit_user = angular.copy(vm.selected_user);
      }
      vm.gModal = $modal(modalContent);
      vm.gModal.$promise.then(vm.gModal.show);
    }
    $scope.onCreateUser = function(user_data) {
      var data = angular.copy(user_data);
      if (data.hasOwnProperty('confirmPassword')) delete data.confirmPassword;
      usSpinnerService.spin('spinner-modal');
      RestAPI.CreateUser(data, function(response) {
        var message = "";

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

        if (!response.data.ERROR) {
          message = "Successfully created!"
        }
        SetAlert(!response.data.ERROR? 'success' : 'danger', message, true);
        if (!response.data.ERROR) {
          var new_user = response.data.RESPONSE;
          vm.users.unshift(new_user);
          vm.tableParams.reload();
          vm.gModal.$promise.then(vm.gModal.hide);
          vm.new_user = {};
        }
        usSpinnerService.stop('spinner-modal');
      });
    }
    $scope.onEditUser = function(user_data) {
      var data = angular.copy(user_data);
      if (data.hasOwnProperty('confirmPassword')) delete data.confirmPassword;
      usSpinnerService.spin('spinner-modal');
      RestAPI.UpdateUser(data, function(response) {
        var message = "";

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

        if (!response.data.ERROR) {
          message = "Successfully updated!"
        }
        
        SetAlert(!response.data.ERROR ? 'success' : 'danger', message, true);
        if (!response.data.ERROR) {
          response.data.RESPONSE.id = +response.data.RESPONSE.id;
          response.data.RESPONSE.user_type = +response.data.RESPONSE.user_type;
          vm.edit_user = response.data.RESPONSE;
          var index = vm.users.indexOf(vm.selected_user);
          var keys = Object.keys(response.data.RESPONSE);
          keys.forEach(function(key) {
            vm.users[index][key] = response.data.RESPONSE[key];
          })
          vm.tableParams.reload();
          vm.gModal.$promise.then(vm.gModal.hide);
        }
        usSpinnerService.stop('spinner-modal');
      });
    }
    $scope.onDeleteUser = function(user_data) {
      usSpinnerService.spin('spinner');
      RestAPI.DeleteUser(user_data.id, function(response) {
        var message = "Failed to delete!";

        if (!response.data.ERROR) {
          message = "Successfully deleted!"
        }
        SetAlert(!response.data.ERROR ? 'success' : 'danger', message, false);
        if (!response.data.ERROR) {
          var index = vm.users.indexOf(vm.selected_user);
          vm.users.splice(index, 1);
          vm.tableParams.reload();
        }
        usSpinnerService.stop('spinner');
      });
    }
    $scope.onView = function(user_data) {
      $location.path('/regular-user-home').search(user_data);
    }
    $scope.isRegularUser = function(user_data) {
      return (+user_data.user_type) === ROLE.REGULAR_USER;
    }
    $scope.isSelf = function(user_data) {
      return !((+user_data.id) == vm.currentUser['id']);
    }
    $scope.getUserLabel = function(user_data) {
      for (var i = 0; i < vm.roles.length; i ++) {
        if ((+user_data.user_type) == vm.roles[i].value) return vm.roles[i].label;
      }
    }
    function SetAlert(type, message, is_modal) {
      var alert = $alert({
        type: type,
        content: message,
        container: (is_modal && type == 'danger')? '#alerts-modal-container':'#alerts-container',
        placement: 'top',
        show: true,
        duration: (type == 'danger')? 15 : 2,
        animation: 'am-fade-and-slide-top'
      });
    }
  }

})();