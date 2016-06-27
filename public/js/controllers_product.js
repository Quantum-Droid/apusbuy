'use strict';

var route = "http://localhost:3000/api";

/* Controllers for Products */

angular.module('myApp.controllers_product', []).
  controller('Controller_MainMenu', function ($scope, $http, $state, $stateParams, networkService) {
  	// Controller that is used for displaying the available items when on the main page.
  	$scope.products = null;
    networkService.fetchProducts().then((response) =>{
        $scope.products = response.data;
    })


  }).
  controller('Controller_ProductDetail', function ($scope, $stateParams, networkService, $http, inventoryService, authenticationService) {
    $scope.product = null;
    var id = $stateParams.product_id;

    //Client info
    $scope.client = null;
    authenticationService.client().then((response) =>{
      $scope.client = response.data;
    })


    //Get product info
    networkService.fetchProduct(id).then((response) =>{
      $scope.product = response.data;
    })

    //Get product available units
    $scope.available_ammount = 0;
    inventoryService.search(id).then((response) =>{
      $scope.available_ammount = response.data;
    })

    $scope.loggedIn = function(){      
      return $scope.client
    }


  }).
  controller('Controller_ProductAnalysis', function ($scope) {
    // write Ctrl here

  });
