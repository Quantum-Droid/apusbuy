'use strict';

var route = "http://localhost:3000/api";

/* Controllers for Products */

angular.module('myApp.controllers_product', []).
  controller('Controller_MainMenu', function ($scope, $http, $state, $stateParams) {
  	// Controller that is used for displaying the available items when on the main page.
  	$scope.items = [];

  }).
  controller('Controller_ProductDetail', function ($scope) {
    // write Ctrl here

  }).
  controller('Controller_ProductAnalysis', function ($scope) {
    // write Ctrl here

  });
