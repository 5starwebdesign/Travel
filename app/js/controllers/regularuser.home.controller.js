(function() {
  'use strict';

  angular
    .module('trips')
    .controller('RegularUserHomeController', RegularUserHomeController);

  RegularUserHomeController.$inject = ['$location', '$scope', '$window', 'AuthenticationService', 'RestAPI', 'NgTableParams', '$cookieStore', '$moment', '$modal', '$alert', 'DATE_FORMAT', 'ROLE', 'usSpinnerService'];

  function RegularUserHomeController($location, $scope, $window, AuthenticationService, RestAPI, NgTableParams, $cookieStore, $moment, $modal, $alert, DATE_FORMAT, ROLE, usSpinnerService) {
    var vm = this;
    vm.currentUser = {};
    vm.trips = [];
    vm.isAdmin = false;
    vm.new_trips = {id: null, destination: null, start_date: null, end_date: null, comment: null, user_id: null};
    vm.selected_trips = null;
    vm.edit_trips = null;
    vm.filterData = {
      destination: null,
      date: {
        startDate: null,
        endDate: null
      },
      comment: null
    };
    vm.user_id = -1;
    vm.gModal = {};

    initController();

    function initController() {
      if (!AuthenticationService.CheckCredential()) $location.path('/login');
      vm.currentUser = AuthenticationService.GetCredential('currentUser');
      var params = $location.search();
      params.id = +params.id;
      params.role = +params.role;
      vm.isAdmin = (vm.currentUser.role === ROLE.ADMIN);
      vm.user_id = vm.isAdmin ? params.id : vm.currentUser.id;
      if (vm.isAdmin) vm.currentUser = params;
      RestAPI.GetUserTrips(vm.user_id, function(response) {
        if (response.data.ERROR) {
          console.log("http response error! There is no trips!");
        } else {
          vm.trips = response.data.RESPONSE;
          angular.forEach(vm.trips, function(value, key){
            value.day_count = calcDayCount(new Date(value.start_date), new Date());
          }); 
          vm.tableParams = new NgTableParams({}, { dataset: vm.trips});
        }
      });
    }
    $scope.showModal = function(data) {
      var modalContent;
      modalContent = {
        scope: $scope,
        templateUrl: 'public/views/',
        show: false,
        backdrop: false,
        dateFormat: 'dd/MM/yyyy'
      };
      switch(data.cmd) {
        case 'create':
          modalContent.title = 'Add New Trip';
          modalContent.templateUrl += 'addtrip.modal.html';
          break;
        case 'delete':
          modalContent.title = 'Confirmation';
          modalContent.templateUrl += 'deletetrip.modal.html';
          vm.selected_trips = data.trips;
          break;
        case 'edit':
          modalContent.title = 'Edit Trip';
          modalContent.templateUrl += 'edittrip.modal.html';
          vm.selected_trips = data.trips;
          vm.edit_trips = angular.copy(vm.selected_trips);
      }
      vm.gModal = $modal(modalContent);
      vm.gModal.$promise.then(vm.gModal.show);
    };
    $scope.onEditTrips = function(trips) {
      trips.start_date = $moment(trips.start_date).format(DATE_FORMAT);
      trips.end_date = $moment(trips.end_date).format(DATE_FORMAT);
      trips.user_id = vm.currentUser.id;
      usSpinnerService.spin('spinner-modal');
      RestAPI.UpdateTrips(trips, function(response) {
        var message = "";

        if (response.data.RESPONSE.destination) {
          angular.forEach(response.data.RESPONSE.destination, function(value, key) {
            message += value + ' ';
          });
        }
        if (response.data.RESPONSE.start_date) {
          angular.forEach(response.data.RESPONSE.start_date, function(value, key) {
            message += value + ' ';
          });
        }
        if (response.data.RESPONSE.end_date) {
          angular.forEach(response.data.RESPONSE.end_date, function(value, key) {
            message += value + ' ';
          });
        }
        if (response.data.RESPONSE.comment) {
          angular.forEach(response.data.RESPONSE.comment, function(value, key) {
            message += value + ' ';
          });
        }

        if (!response.data.ERROR) {
          message = "Successfully updated!"
        }

        SetAlert(response.data.ERROR? 'danger' : 'success', message, true);
        if (!response.data.ERROR) {
          var new_trips = response.data.RESPONSE;
          new_trips.id = +new_trips.id;
          new_trips.user_id = +new_trips.user_id;
          new_trips.day_count = calcDayCount(new Date(new_trips.start_date), new Date());
          var keys = Object.keys(new_trips);
          keys.forEach(function(key) {
            vm.selected_trips[key] = new_trips[key];
          });
          vm.tableParams.reload();
          $scope.filter();
          vm.gModal.$promise.then(vm.gModal.hide);
        }
        usSpinnerService.stop('spinner-modal');
      });
    }
    $scope.onDeleteTrips = function(trips) {
      usSpinnerService.spin('spinner');
      RestAPI.DeleteTrips(trips.id, function(response) {
        var message = "Failed to delete! ";

        if (!response.data.ERROR) {
          message = "Successfully deleted!"
        }
        SetAlert(!response.data.ERROR ? 'success' : 'danger', message, false);
        if (!response.data.ERROR) {
          vm.trips.splice(vm.trips.indexOf(vm.selected_trips), 1);
          vm.tableParams.reload();
        }
        usSpinnerService.stop('spinner');
      });
    }
    $scope.onCreateTrips = function(trips) {
      trips.start_date = $moment(trips.start_date).format(DATE_FORMAT);
      trips.end_date = $moment(trips.end_date).format(DATE_FORMAT);
      trips.user_id = vm.currentUser.id;
      usSpinnerService.spin('spinner-modal');
      RestAPI.CreateTrips(trips, function(response) {
        var message = "";

        if (response.data.RESPONSE.destination) {
          angular.forEach(response.data.RESPONSE.destination, function(value, key) {
            message += value + ' ';
          });
        }
        if (response.data.RESPONSE.start_date) {
          angular.forEach(response.data.RESPONSE.start_date, function(value, key) {
            message += value + ' ';
          });
        }
        if (response.data.RESPONSE.end_date) {
          angular.forEach(response.data.RESPONSE.end_date, function(value, key) {
            message += value + ' ';
          });
        }
        if (response.data.RESPONSE.comment) {
          angular.forEach(response.data.RESPONSE.comment, function(value, key) {
            message += value + ' ';
          });
        }

        if (!response.data.ERROR) {
          message = "Successfully created!"
        }

        SetAlert(response.data.ERROR? 'danger' : 'success', message, true);
        if (!response.data.ERROR) {
          var new_trips = response.data.RESPONSE;
          new_trips.id = +new_trips.id;
          new_trips.user_id = +new_trips.user_id;
          new_trips.day_count = calcDayCount(new Date(new_trips.start_date), new Date());
          vm.trips.unshift(new_trips);
          vm.tableParams.reload();
          $scope.filter();
          vm.new_trips = {};
          vm.gModal.$promise.then(vm.gModal.hide);
        }
        usSpinnerService.stop('spinner-modal');
      });
    }
    $scope.filter = function() {
      if (!AuthenticationService.CheckCredential()) $location.path('/login');
      vm.currentUser = AuthenticationService.GetCredential('currentUser');
      usSpinnerService.spin('spinner');
      var params = $location.search();
      params.id = +params.id;
      params.role = +params.role;
      vm.isAdmin = (vm.currentUser.role === ROLE.ADMIN);
      if (vm.isAdmin) vm.currentUser = params;
      if (vm.filterData.date.startDate && vm.filterData.date.endDate) {
        vm.filterData.date.startDate = $moment(vm.filterData.date.startDate).format(DATE_FORMAT);
        vm.filterData.date.endDate = $moment(vm.filterData.date.endDate).format(DATE_FORMAT);
      }
      RestAPI.FilterTrips(vm.currentUser.id, vm.filterData, function(response) {
        if (response.data.ERROR) {
          console.log("http response error! There is no trips!");
        } else {
          vm.trips = response.data.RESPONSE;
          angular.forEach(vm.trips, function(value, key){
            value.day_count = calcDayCount(new Date(value.start_date), new Date());
          }); 
          vm.tableParams = new NgTableParams({}, { dataset: vm.trips});
        }
        usSpinnerService.stop('spinner');
      });
    }

    $scope.print = function(user_id) {
        // token of current user, this may be different if you are admin and printing another user's trips.
       var token = AuthenticationService.GetCredential('token');
       var url = 'http://toptal.longlian.com/api/print/' + user_id + '?token=' + token;
       $window.open(url);
    }

    $scope.goTo = function (location) {
      $location.path('/' + location);
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

    function calcDayCount(toDate, fromDate) {
      var dayDiff = Math.ceil((toDate - fromDate) / (1000*60*60*24));
      if (angular.isNumber(dayDiff) && dayDiff >= 0) {
        return dayDiff;
      } else {
        return 'N/A';
      }
    }
  }
})();