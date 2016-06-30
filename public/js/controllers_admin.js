'use strict';

var route = "http://localhost:3000/api";

/* Controllers for Admins */

angular.module('myApp.controllers_admin', []).
  controller('Controller_MainMenu', function ($scope) {

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
    $scope.addProductStatus = '';

    // Logout function
    $scope.logout = function() {
      $http.get(route + '/logout')
      .then(function successCallback(response) {
        $state.go('admin_login');
      })
    }

    // Get all available products.
    $scope.showProducts = function() {
      $http.get(route + '/products')
      .then(function succeedCallbackFunction(response) {
        $scope.products = response.data;
      }, function errorCallbackFunction(response) {
        console.log('Couldn\'t make products petition.');
      });
    };

    // Add new product.
    $scope.addProduct = function() {
      var categoriesArray = [];
      var split = $scope.new_categories.split(',');
      for (var i = 0; i<split.length; i++) {
        categoriesArray.push(split[i].trim());
      }
      // POST method that adds a new salesman.
      $http.post(route + '/product', {
        "name":$scope.new_name,
        "description":$scope.new_description,
        "price":$scope.new_price,
        "image":$scope.new_imageURL,
        "categories":categoriesArray,
        "ammount":$scope.new_ammount
      })
      .then(function successCallback(response) {
        $scope.addProductStatus = "El producto se agregó exitosamente.";
      }, function errorCallback(response) {
        $scope.addProductStatus = "Error: el producto no se pudo agregar.";
      });
    }

    $scope.showProducts();

  }).
  controller('Controller_AdminHR', function ($scope, $http, $stateParams, $state) {
    // Web page so an HR Admin can manage salesmen.

    $scope.addSalesmanStatus = '';
    $scope.modifySalesmanStatus = '';
    $scope.deleteSalesmanStatus = '';

    // Logout function
    $scope.logout = function() {
      $http.get(route + '/logout')
      .then(function successCallback(response) {
        $state.go('admin_login');
      })
    }

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
        $state.go('admin_login');
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
        $state.go('admin_login');
      }, function errorCallback(response) {
        console.log('Couldn\'t log out.');
      });
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

    // Delete client account.
    $scope.deleteClient = function() {
      $http.delete(route + '/client?email=' + $scope.clientEmailToDelete)
      .then(function successCallback(response) {
        if (!response.data.error) {
          $scope.deleteClientStatus = 'Cliente dado de baja exitosamente.';
          console.log('Account deleted.');
        } else {
          console.log('Something went wrong!');
        }
      }, function errorCallback(response) {
        $scope.deleteClientStatus = 'No se pudo establecer contacto con el servidor.';
        console.log('Couldn\'t delete account.');
      });
    }
    /* ********************************************
                END OF SUPER USER RIGHTS
       ******************************************** */

    // Call showAdmins at beginning of execution.
    $scope.showAdmins();
  });
