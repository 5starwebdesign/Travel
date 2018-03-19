(function() {
  'use strict';

  angular
    .module('trips')
    .factory('RestAPI', RestAPI);

  RestAPI.$inject = ['$http', '$location', '$window', 'API_URL', 'AuthenticationService'];

  function RestAPI($http, $location, $window, API_URL, AuthenticationService) {
    var service = {};

    service.Login     = Login;
    service.Logout    = Logout;
    service.Register  = Register;
    service.CreateUser = CreateUser;
    service.GetUsers  = GetUsers;
    service.GetUserTrips = GetUserTrips;
    service.UpdateUser = UpdateUser;
    service.DeleteUser = DeleteUser;
    service.DeleteTrips = DeleteTrips;
    service.UpdateTrips = UpdateTrips;
    service.CreateTrips = CreateTrips;
    service.FilterTrips = FilterTrips;

    return service;

    function Login(username, password, callback) {
      var data = {
        username: username,
        password: password
      };
      $http({
        method: 'POST',
        url: API_URL + 'user/authenticate',
        data: $.param(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
        AuthenticationService.SetCredentials('token', response.data.API_TOKEN);
        callback(response);
      }, function(error) {
        callback(error);
      });
      
    }
    function Register(username, password, role, callback) {
      var data = {
        username: username,
        password: password,
        user_type: role
      };
      $http({
        method: 'POST',
        url: API_URL + 'user/register',
        data: $.param(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
        AuthenticationService.SetCredentials('token', response.data.API_TOKEN);
        callback(response);
      }, function(error) {
        callback(error);
      });
    }
    function Logout(callback) {
      $http({
        method: 'GET',
        url: API_URL + 'user/logout',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + AuthenticationService.GetCredential('token')
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        callback(error);
      });
    }
    function CreateUser(user_data, callback) {
      var data = {
        username: user_data.username,
        password: user_data.password,
        user_type: user_data.role
      };
      $http({
        method: 'POST',
        url: API_URL + 'user',
        data : $.param(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + AuthenticationService.GetCredential('token')
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        callback(error);
      });
    }
    function UpdateUser(user_data, callback) {
      $http({
        method: 'PUT',
        url: API_URL + 'user/' + user_data.id,
        data: $.param(user_data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + AuthenticationService.GetCredential('token')
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        callback(error);
      });
    }
    function DeleteUser(user_id, callback) {
      $http({
        method: 'DELETE',
        url: API_URL + 'user/' + user_id,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + AuthenticationService.GetCredential('token')
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        callback(error);
      });
    }
    function GetUsers(callback) {
      $http({
        method: 'GET',
        url: API_URL + 'user',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + AuthenticationService.GetCredential('token')
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        callback(error);
      });
    }
    function GetUserTrips(user_id, callback) {
      $http({
        method: 'GET',
        url: API_URL + 'trip/' + user_id,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + AuthenticationService.GetCredential('token')
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        callback(error);
      });
    }
    function UpdateTrips(trips_data, callback) {
      var trips_id = trips_data.id;
      $http({
        method: 'PUT',
        url: API_URL + 'trip/' + trips_id,
        data: $.param(trips_data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + AuthenticationService.GetCredential('token')
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        callback(error);
      });
    }
    function DeleteTrips(trips_id, callback) {
      $http({
        method: 'DELETE',
        url: API_URL + 'trip/' + trips_id,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + AuthenticationService.GetCredential('token')
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        callback(error);
      });
    }
    function CreateTrips(trips, callback) {
      $http({
        method: 'POST',
        url: API_URL + 'trip/' + trips.user_id,
        data: $.param(trips),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + AuthenticationService.GetCredential('token')
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        callback(error);
      });
    }

    function FilterTrips(user_id, filterData, callback) {
      var url = API_URL + 'trip/' + user_id + '?1=1';
      if (filterData.date.startDate && filterData.date.endDate) {
        url += '&start_date=' + filterData.date.startDate + '&end_date=' + filterData.date.endDate;
      }
      if (filterData.destination) {
        url += '&destination=' + filterData.destination;
      }
      if (filterData.comment) {
        url += '&comment=' + filterData.comment;
      }

      $http({
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Token ' + AuthenticationService.GetCredential('token')
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        callback(error);
      });
    }
  }
})();