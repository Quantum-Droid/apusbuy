'use strict';

var route = "http://localhost:3000/api";

/* Controllers */

angular.module('myApp.controllers', []).
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

    // Get client
    $scope.getClient = function() {
      $http.get(route + '/_id=' + $scope.client_id)
      .then(function successCallback(response) {
        $scope.prev_clientName = response.data.name
        $scope.prev_clientLastName = response.data.lastName
        $scope.prev_clientEmail = response.data.email
        $scope.prev_clientVerified = response.data.verified
        $scope.prev_clientPassword = response.data.password
        $scope.prev_clientAddressStreet = response.data.address.street
        $scope.prev_clientAddressPostalCode = response.data.address.postalCode
        $scope.prev_clientAddressNumber = response.data.address.number
        $scope.prev_clientAddressState = response.data.address.state
        $scope.prev_clientAddressCity = response.data.address.city
        $scope.prev_clientCreditCards = response.data.cards
        $scope.prev_clientOrders = response.data.cart.orders
        $scope.prev_clientDiscount = response.data.cart.discount
        $scope.prev_clientNumberOfItemsBought = response.data.boughtItems
      }, function errorCallback (response) {
        console.log('Error while reaching client.');
      });
    }
  }).
  controller('Controller_ClientShoppingCart', function ($scope) {
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
  controller('Controller_AdminSalesmen', function ($scope, $http, $stateParams, $state) {
    // Web page so Admin Salesman can manage products.

  }).
  controller('Controller_AdminHR', function ($scope, $http, $stateParams, $state) {
    // Web page so an HR Admin can manage salesmen.

    $scope.addSalesmanStatus = '';
    $scope.modifySalesmanStatus = '';
    $scope.deleteSalesmanStatus = '';

    // Getting the list of salesmen.
    $scope.showSalesmen = function() {
      $http.get(route + '/admins?role=Ventas')
      .then(function successCallback(response) {
        $scope.salesmen = response.data;
      }, function successCallback (response) {
        console.log('Couldn\'t load salesmen.');
      });
    }

    $scope.showSalesmen();

    // Sorting list of salesmen.
    $scope.filterOptions = function(param) {
      $scope.filterOption = param;
    }

    // Logout function
    $scope.logout = function() {
      $http.get(route + '/logout')
      .then(function successCallback(response) {
        $state.go('main_menu');
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
      $http.get(route + '/admin?email=' + $scope.salesmanEmailToModify)
      .then(function successCallback(response) {
        // Getting previous info in case admin does not change a field.
        var id = response.data._id;
        var name = response.data.name;
        var lastName = response.data.lastName;
        var password = response.data.password;
        var role = response.data.role;
        // Checking if user input is neither undefined nor blank.
        if ($scope.existing_name !== undefined && $scope.existing_name.trim() !== '') {
          name = $scope.existing_name;
        }
        if ($scope.existing_lastName !== undefined && $scope.existing_lastName.trim() !== '') {
          lastName = $scope.existing_lastName;
        }
        if ($scope.existing_password !== undefined && $scope.existing_password.trim() !== '') {
          password = $scope.existing_password;
        }
        $http.put(route + '/admin?_id=' + id, {
          // Using id to actually modify the backend registry.
          "name":name,
          "lastName":lastName,
          // #NOTE -> according to specifications, cannot modify email on any user.
          "email":$scope.salesmanEmailToModify, 
          "password":password,
          "role":role
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
      $http.get(route + '/admin?email=' + $scope.salesmanEmailToDelete)
      .then(function successCallback(response) {
        var id = response.data._id;
        // If user actually exists.
        if (!response.data.error) {
          $http.delete(route + '/admin?_id=' + id)
          // Using id to actually delete the backend registry.
          .then(function successCallback(response2) {
            $scope.deleteSalesmanStatus = "El vendedor fue dado de baja exitosamente.";
          }, function errorCallback(response2) {
            $scope.deleteSalesmanStatus = "Error: el vendedor no pudo ser dado de baja.";
          });
        } else {
          $scope.deleteSalesmanStatus = "Error: el vendedor no existe.";
        }
      }, function errorCallback(response) {
        console.log('Error while trying to delete salesman.');
      });       
    }

  }).
  controller('Controller_AdminSuperuser', function ($scope, $http, $stateParams, $state) {
    // Web page so a super user can do everything including HR and Salesman rights, in addition to own super user rights.

    // Getting the list of admins.
    $scope.showAdmins = function() {
      $http.get(route + '/admins')
      .then(function successCallback(response) {
        $scope.admins = response.data;
      }, function successCallback (response) {
        console.log('Couldn\'t load admins.');
      });
    }

    // Filtering list of admins.
    $scope.filterOptions = function(param) {
      $scope.filterOption = param;
    }

    // Logout function
    $scope.logout = function() {
      $http.get(route + '/logout')
      .then(function successCallback(response) {
        $state.go('main_menu');
      })
    }

    /* ********************************************
              START OF SUPER USER RIGHTS
       ******************************************** */

    $scope.addAdminStatus = '';
    $scope.modifyAdminStatus = '';
    $scope.deleteAdminStatus = '';
    
    $scope.addAdmin = function() {
      // POST method that adds a new salesman.
      $http.post(route + '/admin', {
        "name":$scope.new_name,
        "lastName":$scope.new_lastName,
        "email":$scope.new_email,
        "password":$scope.new_password,
        "role":$scope.new_role,
      })
      .then(function successCallback(response) {
        $scope.addAdminStatus = "El admin de R.H. se agregó exitosamente.";
      }, function errorCallback(response) {
        $scope.addAdminStatus = "Error: el admin de R.H. no se pudo agregar.";
      });
    }

    $scope.modifyAdmin = function() {
      // PUT method to modify an existing Salesman. We start with getting his id.
      $http.get(route + '/admin?email=' + $scope.adminEmailToModify)
      .then(function successCallback(response) {
        // Getting previous info in case admin does not change a field.
        var id = response.data._id;
        var name = response.data.name;
        var lastName = response.data.lastName;
        var password = response.data.password;
        var role = response.data.role;
        // Checking if user input is neither undefined nor blank.
        if ($scope.existing_name !== undefined && $scope.existing_name.trim() !== '') {
          name = $scope.existing_name;
        }
        if ($scope.existing_lastName !== undefined && $scope.existing_lastName.trim() !== '') {
          lastName = $scope.existing_lastName;
        }
        if ($scope.existing_password !== undefined && $scope.existing_password.trim() !== '') {
          password = $scope.existing_password;
        }
        $http.put(route + '/admin?_id=' + id, {
          // Using id to actually modify the backend registry.
          "name":name,
          "lastName":lastName,
          // #NOTE -> according to specifications, cannot modify email on any user.
          "email":$scope.adminEmailToModify, 
          "password":password,
          "role":role
        })
        .then(function successCallback(response2) {
          $scope.modifyAdminStatus = "El admin se modificó exitosamente.";
        }, function errorCallback(response2) {
          $scope.modifyAdminStatus = "Error: el admin no se pudo modificar."; 
        });
      }, function errorCallback(response) {
        console.log('Error trying to retrieve admin.');
      });
    }

    $scope.deleteAdmin = function() {
      // DELETE method to delete an existing HR admin. We start with getting the id.
      $http.get(route + '/admin?email=' + $scope.adminEmailToDelete)
      .then(function successCallback(response) {
        var id = response.data._id;
        // If user actually exists.
        if (response.data.error === undefined) {
          $http.delete(route + '/admin?_id=' + id)
          // Using id to actually delete the backend registry.
          .then(function successCallback(response2) {
            $scope.deleteAdminStatus = "El admin fue dado de baja exitosamente.";
          }, function errorCallback(response2) {
            $scope.deleteAdminStatus = "Error: el admin no pudo ser dado de baja.";
          });
        } else {
          $scope.deleteAdminStatus = "Error: el admin no existe.";
        }
      }, function errorCallback(response) {
        console.log('Error while trying to delete admin.');
      });       
    }
    /* ********************************************
                END OF SUPER USER RIGHTS
       ******************************************** */

    // Call showAdmins at beginning of execution.
    $scope.showAdmins();
  }).
  controller('Controller_ProductDetail', function ($scope) {
    // write Ctrl here

  }).
  controller('Controller_ProductAnalysis', function ($scope) {
    // write Ctrl here

  });
