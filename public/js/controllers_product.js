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
  controller('Controller_ProductAnalysis', function ($scope) {
    // write Ctrl here

  });
