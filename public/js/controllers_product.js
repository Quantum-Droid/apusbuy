'use strict';

var route = "http://localhost:3000/api";

/* Controllers for Products */

angular.module('myApp.controllers_product', []).
  controller('Controller_MainMenu', function ($scope, $http, $state, $stateParams) {
  	// Controller that is used for displaying the available items when on the main page.

    // Method to get all available products.
    $scope.getProducts = function() {
      $http.get(route + '/products')
      .then(function succeedCallbackFunction(response) {
        $scope.rows = response.data;
        // To order by groups of 3.
        var arrays = [], size = 3;
        while ($scope.rows.length > 0) {
          arrays.push($scope.rows.splice(0, size));
        }
        console.log(arrays[0][0].image);
        $scope.rows = arrays;
      }, function errorCallbackFunction(response) {
        console.log('Couldn\'t make products petition.');
      });
    };

    // Method to view one specific product's details.
    $scope.loadProductDetails = function() {
      $state.go('product_details', {
        product_id: $scope.product_id
      });
    };

    $scope .getProducts();

  }).
  controller('Controller_ProductDetail', function ($scope) {
    // write Ctrl here

  }).
  controller('Controller_ProductAnalysis', function ($scope) {
    // write Ctrl here

  });
