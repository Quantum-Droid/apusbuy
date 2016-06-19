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
  controller('Controller_ClientProfile', function ($scope) {
    // write Ctrl here

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
    
    $scope.getSalesmen = function() {
      // GET method that obtains salesmen.
      $http.get(route + '/admins')
      .then(function successCallback(response) {
        $scope.salesmen = response.data;
      }, function errorCallback(response) {
        console.log('Error getting salesmen.');
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
        $http.put(route + '/admin?admin_id=' + id, {
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
          $http.delete(route + '/admin?admin_id=' + id)
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

    $scope.logout = function() {
      // Logout function.
      $http.get(route + '/logout')
      .then(function successCallback(response) {
        state.go('main_menu');
      })
    }

    /* ********************************************
              START OF SUPER USER RIGHTS
       ******************************************** */

    $scope.addHRStatus = '';
    $scope.modifyHRStatus = '';
    $scope.deleteHRStatus = '';
    
    $scope.getSalesmen = function() {
      // GET method that obtains HR admins.
      $http.get(route + '/admins')
      .then(function successCallback(response) {
        $scope.hr = response.data;
      }, function errorCallback(response) {
        console.log('Error getting salesmen.');
      })
    }

    $scope.addHR = function() {
      // POST method that adds a new salesman.
      $http.post(route + '/admin', {
        "name":$scope.new_name,
        "lastName":$scope.new_lastName,
        "email":$scope.new_email,
        "password":$scope.new_password,
        "role":"Recursos Humanos"
      })
      .then(function successCallback(response) {
        $scope.addHRStatus = "El admin de R.H. se agregó exitosamente.";
      }, function errorCallback(response) {
        $scope.addHRStatus = "Error: el admin de R.H. no se pudo agregar.";
      });
    }

    $scope.modifyHR = function() {
      // PUT method to modify an existing Salesman. We start with getting his id.
      $http.get(route + '/admin?email=' + $scope.hrEmailToModify)
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
          "email":$scope.hrEmailToModify, 
          "password":password,
          "role":role
        })
        .then(function successCallback(response2) {
          $scope.modifyHRStatus = "El admin de R.H. se modificó exitosamente.";
        }, function errorCallback(response2) {
          $scope.modifyHRStatus = "Error: el admin de R.H. no se pudo modificar."; 
        });
      }, function errorCallback(response) {
        console.log('Error trying to retrieve admin.');
      });
    }

    $scope.deleteHR = function() {
      // DELETE method to delete an existing HR admin. We start with getting the id.
      $http.get(route + '/admin?email=' + $scope.hrEmailToDelete)
      .then(function successCallback(response) {
        var id = response.data._id;
        // If user actually exists.
        if (!response.data.error) {
          $http.delete(route + '/admin?_id=' + id)
          // Using id to actually delete the backend registry.
          .then(function successCallback(response2) {
            $scope.deleteHRStatus = "El admin de R.H. fue dado de baja exitosamente.";
          }, function errorCallback(response2) {
            $scope.deleteHRStatus = "Error: el admin de R.H. no pudo ser dado de baja.";
          });
        } else {
          $scope.deleteHRStatus = "Error: el admin de R.H. no existe.";
        }
      }, function errorCallback(response) {
        console.log('Error while trying to delete admin.');
      });       
    }
    /* ********************************************
                END OF SUPER USER RIGHTS
       ******************************************** */

    /* ********************************************
                START OF HR ADMIN RIGHTS
       ******************************************** */

    $scope.addSalesmanStatus = '';
    $scope.modifySalesmanStatus = '';
    $scope.deleteSalesmanStatus = '';
    
    $scope.getSalesmen = function() {
      // GET method that obtains salesmen.
      /* Should be replaced with improved API call */
      $http.get(route + '/admins')
      .then(function successCallback(response) {
        $scope.salesmen = response.data;
      }, function errorCallback(response) {
        console.log('Error getting salesmen.');
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

    /* ********************************************
                  END OF HR ADMIN RIGHTS
       ******************************************** */

  }).
  controller('Controller_ProductDetail', function ($scope) {
    // write Ctrl here

  }).
  controller('Controller_ProductAnalysis', function ($scope) {
    // write Ctrl here

  });
