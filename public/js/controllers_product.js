'use strict';

var route = "http://localhost:3000/api";

/* Controllers for Products */

angular.module('myApp.controllers_product', []).
  controller('Controller_MainMenu', function ($scope, $http, $state, $stateParams, networkService) {
  	// Controller that is used for displaying the available items when on the main page.

    // Method to get all available products.
    $scope.getProducts = function() {
      $http.get(route + '/products')
      .then(function succeedCallbackFunction(response) {
        $scope.rows = response.data;
        // To order by groups of 3.
        //var arrays = [], size = 3;
        //while ($scope.rows.length > 0) {
        //  arrays.push($scope.rows.splice(0, size));
        //}        
        //$scope.rows = arrays;
      }, function errorCallbackFunction(response) {
        console.log('Couldn\'t make products petition.');
      });
    };

    // Method to view one specific product's details.
    $scope.loadProductDetails = function(product_id) {
      $scope.product_id = product_id;
      $state.go('product_details', {
        product_id: $scope.product_id
      });
    };

    $scope.getProducts();

  }).
  controller('Controller_ProductDetails', function ($state, $scope, $stateParams, networkService, $http, inventoryService, authenticationService) {
    // Controller used for showing, modifying and deleting a product.

    $scope.product = null;    
    var id = $stateParams.product_id;
    $scope.selectedQuantity = 1;



    $scope.currentUser = function(){
      return authenticationService.currentUser();
    }
    
    $scope.currentUser().then((data) =>{
      $scope.client = data.user      
      $scope.isAdmin = data.admin;
      //console.log(data)
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

    //Adds the product to the client's cart
    $scope.addItem = function(){      
      $http.put(route + '/cart', {
        product: id,
        ammount: $scope.selectedQuantity,
        action: "add"
      }).success((res) =>{
        console.log('success')
        console.log(res)
      }).error((err) =>{
        console.log('error')
        console.log(err)
      });
    }

    //Updates the product's info
    $scope.updateProduct = function(){
      console.log('Updating');
      $http.put(route + '/product?_id=' + id, {
        description: $scope.product.description,
        image: $scope.product.image,
        price: $scope.product.price
      }).success((res) =>{
        console.log(res);
      }).error((res) =>{
        console.log('Error :(')
        console.log(res)
      });
    }

    //Removes the product from the DB
    $scope.deleteProduct = function(){
      console.log('Deleting')
      $http.delete(route + '/product?_id=' + id)
        .success((res) =>{
          console.log(res);
        }).error((res) =>{
          console.log(res);
        });
    }

    // Loads client login page.
    $scope.loadClientLogin = function() {
      console.log('Going to client login');
      $state.go('client_login');
    }

  }).
  controller('Controller_ProductAnalysis', function ($scope, $http) {
    $scope.bestSellersData = [];
		$scope.bestSellersLabels = [];
		$scope.ageRangeData = [];
		$scope.ageRangeLabels = ["Under 12","12-17","18-24","25-34","35-44","45-54","55-64","65-74","75 or more"];
		$scope.salesPerHourData = [];
		$scope.salesPerHourLabels = ["00:00:00~00:59:59","01:00:00~01:59:59","02:00:00~02:59:59",
																 "03:00:00~03:59:59","04:00:00~04:59:59","05:00:00~05:59:59",
																 "06:00:00~06:59:59","07:00:00~07:59:59","08:00:00~08:59:59",
																 "09:00:00~09:59:59","10:00:00~10:59:59","11:00:00~11:59:59",
																 "12:00:00~12:59:59","13:00:00~13:59:59","14:00:00~14:59:59",
																 "15:00:00~15:59:59","16:00:00~16:59:59","17:00:00~17:59:59",
																 "18:00:00~18:59:59","19:00:00~19:59:59","20:00:00~20:59:59",
																 "21:00:00~21:59:59","22:00:00~22:59:59","23:00:00~23:59:59"];
		
		$http.get(route + '/bestSellers')
		.then(function successCallback(response){
			$scope.bestSellersData = response.data.bestSellersData;
			$scope.bestSellersLabels = response.data.bestSellersLabels;
		}, function errorCallback(response) {
      console.log('Could\'t get best seller information.');
    });

		$http.get(route + '/ageRanges')
		.then(function successCallback(response){
			$scope.ageRangeData = response.data.ageRangeData
		}, function errorCallback(response) {
      console.log('Could\'t get information about the age of the users.');
    });

		$http.get(route + '/salesPerHour')
		.then(function successCallback(response){
			$scope.salesPerHourData = response.data.salesPerHourData;
		}, function errorCallback(response) {
      console.log('Could\'t get information about the sales per hour.');
    });
		
  });
