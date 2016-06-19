'use strict';

var route = "http://localhost:3000/api";

/* Controllers */

angular.module('myApp.controllers', []).
  controller('Controller_MainMenu', function ($scope) {

  }).
  controller('Controller_UserLogin', function ($scope) {
    // write Ctrl here

  }).
  controller('Controller_AdminLogin', function ($scope, $http, $stateParams, $state) {
    // Admin login function (for all admins).
    $scope.adminLogin = function() {
      $http.post(route + '/adminLogin', 
        {
          "email":$scope.admin, 
          "password":$scope.password
        })
      .then(function successCallback(response) {
        // Before actually logging admin in, check which type he/she is, and go to corresponding page.
        var role = response.data.role;
        var id = response.data._id;
        if (role === 'Ventas') {
          $state.go('admin_salesmen', {
            admin_id: id
          });
        } else if (role === 'Recursos Humanos') {
          $state.go('admin_hr', {
            admin_id: id
          });
        } else if (role === 'Super User') {
          $state.go('admin_superuser', {
            admin_id: id
          });
        } else if (role === undefined) {
          console.log('User undefined.')
        }
      }, function errorCallback(response) {
        console.log('Couldn\'t make login request!');
      });
    }
  }).
  controller('Controller_UserProfile', function ($scope) {
    // write Ctrl here

  }).
  controller('Controller_ProductDetail', function ($scope) {
    // write Ctrl here

  }).
  controller('Controller_UserShoppingCart', function ($scope) {
    // write Ctrl here

  }).
  controller('Controller_AdminSalesmen', function ($scope, $http, $stateParams, $state) {
    // Web page so Admin Salesman can manage products.

  }).
  controller('Controller_HR', function ($scope) {
    // Web page so an HR Admin can manage salesmen.
    
    $scope.getSalesmen = function() {
      // GET method that obtains salesmen.
      /* Should be replaced with improved API call */
      $http.get(route + '/admins')
      .then(function successCallback(response) {
        $scope.salesmen = response.data;
      }, function errorCallback(response) {
        console.log('Error getting salesmen.');
      })
    }

    $scope.addSalesman = function() {
      // POST method that adds a new salesman.
      $http.post(route + '/admin', {
        "name":$scope.new_name,
        "lastName":$scope.new_lastName,
        "email":$scope.new_email,
        "password":$scope.new_password,
        "role":"Ventas"
      })
      .then(function successCallback(response) {
        $scope.addSalesmanStatus = "El vendedor se agregó exitosamente.";
      }, function errorCallback(response) {
        $scope.addSalesmanStatus = "Error: el vendedor no se pudo agregar.";
      });
    }

    $scope.modifySalesman = function() {
      // PUT method to modify an existing Salesman. We start with getting his id.
      $http.get(route + '/admin?email=' + $scope.modifySalesmanEmail)
      .then(function successCallback(response) {
        var id = response.data._id;
        $http.put(route + '/admin?admin_id=' + id, {
          // Using id to actually modify the backend registry.
          "name":$scope.new_name,
          "lastName":$scope.new_lastName,
          "email":$scope.new_email,
          "password":$scope.new_password,
          "role":"Ventas"
        })
        .then(function successCallback(response2) {
          $scope.modifySalesmanStatus = "El vendedor se modificó exitosamente.";
        }, function errorCallback(response2) {
          $scope.modifySalesmanStatus = "Error: el vendedor no se pudo modificar."; 
        });
      }, function errorCallback(response) {
        console.log('Error trying to retrieve admin.');
      });
    }

    $scope.deleteSalesman = function() {
      // DELETE method to delete an existing Salesman. We start with getting the id.
      $http.get(route + '/admin?email=' + $scope.deleteSalesmanEmail)
      .then(function successCallback(response) {
        var id = response.data._id;
        $http.delete(route + '/admin?admin_id=' + id)
        // Using id to actually delete the backend registry.
        .then(function successCallback(response2) {
          $scope.deleteSalesmanStatus = "El vendedor fue dado de baja exitosamente."
        }, function errorCallback(response2) {
          $scope.deleteSalesmanStatus = "Error: el vendedor no pudo ser dado de baja."
        });
      }, function errorCallback(response) {
        console.log('Error while trying to delete salesman.');
      });
    }

  }).
  controller('Controller_Superuser', function ($scope) {
    // write Ctrl here

  }).
  controller('Controller_ProductAnalysis', function ($scope) {
    // write Ctrl here

  });
