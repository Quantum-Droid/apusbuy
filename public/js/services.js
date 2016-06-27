'use strict';

var route = "http://localhost:3000/api";

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

angular.module('myApp.services').service('networkService', function($http){
	/*
	* Returns a promise. 
	* If sucessful, returns an array of all products in the DB. 
	*/
	this.fetchProducts = function(){
		var endpoint = route + '/products';
		return $http.get(endpoint)
			.success((data) =>{
				return data;
			})
			.error (() =>{
				console.log("Error fetching");
				return null;
			})
	};

	/*
	* Return a single product specified by passed id
	*/
	this.fetchProduct = function(id){
		var endpoint = route + '/product?_id=' + id;
		return $http.get(endpoint)
			.success((product) =>{
				return product;
			})
			.error(()=>{
				console.log('Error fetching');
				return null;
			})
	};

})

angular.module('myApp.services').service('authenticationService', function($http){
	/*
	* Returns the current logged in client
	*/
	this.client = function(){
		var endpoint = route + '/client';
		return $http.get(endpoint)
			.success((client) =>{
				return client;
			})
			.error(() =>{
				return null;
			})
	}

		/*
	* Returns the current logged in admin
	*/
	this.admin = function(){
		var endpoint = route + '/admin';
		return $http.get(endpoint)
			.success((admin) =>{
				return admin;
			})
			.error(() =>{
				return null;
			})
	}
})

angular.module('myApp.services').service('inventoryService', function($http){
	
	/*
	* Returns the quantity of a product available in the inventory
	*/
	this.search = function(product_id){
		var endpoint = route + '/inventory?_id=' + product_id;
		return $http.get(endpoint)
			.success((ammount) => {
				return ammount;
			})
			.error(() =>{
				return null;
			})
	}
})
