'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers_client',
  'myApp.controllers_admin',
  'myApp.controllers_product',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ui.router',
	'chart.js'
]).
config(function ($stateProvider, $urlRouterProvider) {
  // States
  $stateProvider.
    // Main Menu
    state('main_menu', {
      url: '/main_menu',
      templateUrl: 'partials/main_menu.html',
      controller: 'Controller_MainMenu' // NOTE --> Controller located in controllers_products.js
    }).
    // Client
    state('client_login', {
      url: '/client_login',
      templateUrl: '/partials/client_login.html',
      controller: 'Controller_ClientLogin'
    }).
    state('client_profile', {
      url: '/client_profile/:client_id',
      templateUrl: 'partials/client_profile.html',
      controller: 'Controller_ClientProfile'
    }).
    state('client_shopping_cart', {
      url: '/client_shopping_cart/:client_id',
      templateUrl: 'partials/client_shopping_cart.html',
      controller: 'Controller_ClientShoppingCart'
    }).
    state('client_register', {
      url: '/client_register',
      templateUrl: 'partials/client_register.html',
      controller: 'Controller_ClientRegister'
    }).
    state('/client_verify', {
      url: '/client_verify',
      templateUrl: 'partials/client_verify.html',
      controller: 'Controller_ClientVerify'
    }).
    // Admin
    state('admin_login', {
      url: '/admin_login/:admin_id',
      templateUrl: 'partials/admin_login.html',
      controller: 'Controller_AdminLogin'
    }).
    state('admin_salesmen', {
      url: '/admin_salesmen/:admin_id',
      templateUrl: 'partials/admin_salesmen.html',
      controller: 'Controller_AdminSalesmen'
    }).
    state('admin_hr', {
      url: '/admin_hr/:admin_id',
      templateUrl: 'partials/admin_hr.html',
      controller: 'Controller_AdminHR'
    }).
    state('admin_superuser', {
      url: '/admin_superuser/:admin_id',
      templateUrl: 'partials/admin_superuser.html',
      controller: 'Controller_AdminSuperuser'
    }).
    // Product
    state('product_analysis', {
      url: '/product_analysis/:product_id',
      templateUrl: 'partials/product_analysis.html',
      controller: 'Controller_ProductAnalysis'
    }).
    state('product_detail', {
      url: '/product_detail/:product_id',
      templateUrl: 'partials/product_detail.html',
      controller: 'Controller_ProductDetail'
    })

    // For unmatched states
    $urlRouterProvider.otherwise('/main_menu');
});
