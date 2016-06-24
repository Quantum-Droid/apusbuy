'use strict';

var route = "http://localhost:3000/api";

/* Controllers for Clients */

angular.module('myApp.controllers_client', []).
  controller('Controller_MainMenu', function ($scope) {

  }).
  controller('Controller_ClientLogin', function ($scope, $http, $stateParams, $state) {
    // Client login page
    $scope.login = function() {
      $http.post(route + '/clientLogin', {
        "email":$scope.client,
        "password":$scope.password
      })
      .then(function successCallback(response) {
        var id = response.data._id;
        $state.go('client_profile', {
          client_id: id
        });
      }, function errorCallback(response) {
        console.log('Could\'t login client.');
      });
    }
  }).
  controller('Controller_ClientProfile', function ($scope, $http, $stateParams, $state) {
    // Controller for managing a user's profile.
    $scope.client_id = $stateParams.client_id;

    // Get client
    $scope.getClient = function() {
      $http.get(route + '/client?_id=' + $scope.client_id)
      .then(function successCallback(response) {
        $scope.clientName = response.data.name
        $scope.clientLastName = response.data.lastName
        $scope.clientEmail = response.data.email
        var clientIsVerified = response.data.verified
        $scope.clientPassword = response.data.password
        $scope.clientAddressStreet = response.data.address.street
        $scope.clientAddressPostalCode = response.data.address.postalCode
        $scope.clientAddressNumber = response.data.address.number
        $scope.clientAddressState = response.data.address.state
        $scope.clientAddressCity = response.data.address.city
        $scope.clientAddressCreditCards = response.data.cards
        $scope.clientCartOrders = response.data.cart.orders
        $scope.clientCartDiscount = response.data.cart.discount
        $scope.clientNumberOfItemsBought = response.data.boughtItems
        if (clientIsVerified) {
          $scope.clientVerfied = 'Yes';
        } else {
          $scope.clientVerfied = 'No';
        }
      }, function errorCallback (response) {
        console.log('Error while reaching client. ');
      });
    }

    // Save changes to database.
    $scope.saveClientChanges = function() {
      $http.put(route + '/client?_id=' + $scope.client_id, {
        "name":$scope.clientName, 
        "lastName":$scope.clientLastName,
        "email":$scope.clientEmail,
        "password":$scope.clientPassword,
        "street":$scope.clientAddressStreet,
        "postalCode":$scope.clientAddressPostalCode,
        "number":$scope.clientAddressNumber,
        "state":$scope.clientAddressState,
        "city":$scope.clientAddressCity,
        // NOTE --> change once CreditCards are implemented.
        "cards":null
      })
    }

    $scope.getClient();
  }).
  controller('Controller_ClientShoppingCart', function ($scope) {
    // write Ctrl here

  });
  