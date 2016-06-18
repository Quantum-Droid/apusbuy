'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ui.router'
]).
config(function ($stateProvider, $urlRouterProvider) {
  // States
  $stateProvider.
    // Main Menu
    state('main_menu', {
      url: '/main_menu',
      templateUrl: 'partials/main_menu.html',
      controller: 'Controller_MainMenu'
    }).
    // User
    state('user_login', {
      url: '/user_login',
      templateUrl: '/partials/user_login.html',
      controller: 'Controller_UserLogin'
    }).
    state('user_profile', {
      url: '/user_profile',
      templateUrl: 'partials/user_profile.html',
      controller: 'Controller_UserProfile'
    }).
    state('user_shopping_cart', {
      url: '/user_shopping_cart',
      templateUrl: 'partials/user_shopping_cart.html',
      controller: 'Controller_UserShoppingCart'
    }).
    // Admin
    state('admin_login', {
      url: '/admin_login',
      templateUrl: 'partials/admin_login.html',
      controller: 'Controller_AdminLogin'
    }).
    state('admin_salesmen', {
      url: '/admin_salesmen',
      templateUrl: 'partials/admin_salesmen.html',
      controller: 'Controller_AdminSalesmen'
    }).
    state('admin_hr', {
      url: '/admin_hr',
      templateUrl: 'partials/admin_hr.html',
      controller: 'Controller_AdminHR'
    }).
    state('admin_superuser', {
      url: '/admin_superuser',
      templateUrl: 'partials/admin_superuser.html',
      controller: 'Controller_AdminSuperuser'
    }).
    // Product
    state('product_analysis', {
      url: '/product_analysis',
      templateUrl: 'partials/product_analysis.html',
      controller: 'Controller_ProductAnalysis'
    }).
    state('product_detail', {
      url: '/product_detail',
      templateUrl: 'partials/product_detail.html',
      controller: 'Controller_ProductDetail'
    })

    // For unmatched states
    $urlRouterProvider.otherwise('/main_menu');
});
