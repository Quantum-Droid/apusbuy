'use strict';

var route = "http://localhost:3000/api";

/* Controllers for Clients */

angular.module('myApp.controllers_client', []).
  controller('Controller_MainMenu', function ($scope) {

  }).
  controller('Controller_ClientLogin', function ($scope, $http, $stateParams, $state) {
    // Controller for managing a client's login; it can also redirect to register page.

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

    // Redirect to client register.
    $scope.loadRegister = function() {
      $state.go('client_register');
    }

    // Redirect to admin login.
    $scope.loadAdminLogin = function() {
      $state.go('admin_login');
    }
  }).
  controller('Controller_ClientProfile', function ($scope, $http, $stateParams, $state) {
    // Controller for managing a user's profile.
    $scope.client_id = $stateParams.client_id;
    $scope.prev_clientPassword = null;

    // Logout function
    $scope.logout = function() {
      $http.get(route + '/logout')
      .then(function successCallback(response) {
        $state.go('client_login');
      })
    }

    // Get client
    $scope.getClient = function() {
      $http.get(route + '/client?_id=' + $scope.client_id)
      .then(function successCallback(response) {
        $scope.clientName = response.data.name
        $scope.clientLastName = response.data.lastName
        $scope.clientEmail = response.data.email
        $scope.clientBirthdate = response.data.birthdate
        var clientIsVerified = response.data.verified
        $scope.prev_clientPassword = response.data.password
        $scope.clientAddressStreet = response.data.address.street
        $scope.clientAddressPostalCode = response.data.address.postalCode
        $scope.clientAddressNumber = response.data.address.number
        $scope.clientAddressState = response.data.address.state
        $scope.clientAddressCity = response.data.address.city
        $scope.clientAddressCreditCards = response.data.cards
        $scope.clientCartOrders = response.data.cart.orders
        $scope.clientCartDiscount = response.data.cart.discount
        $scope.clientNumberOfItemsBought = response.data.boughtItems
        if (clientIsVerified) {
          $scope.clientVerified = 'Sí';
        } else {
          $scope.clientVerified = 'No';
        }
      }, function errorCallback (response) {
        console.log('Error while reaching client.');
      });
    }

    // Save changes to database.
    $scope.saveClientChanges = function() {
      if ($scope.confirmPassword === $scope.prev_clientPassword) {
        if ($scope.clientNewPassword === $scope.clientNewPasswordRepeat) {
          $http.put(route + '/client?_id=' + $scope.client_id, {
            "name":$scope.clientName, 
            "lastName":$scope.clientLastName,
            "birthdate":$scope.clientBirthdate,
            "email":$scope.clientEmail,
            "password":$scope.clientNewPassword,
            "street":$scope.clientAddressStreet,
            "postalCode":$scope.clientAddressPostalCode,
            "number":$scope.clientAddressNumber,
            "state":$scope.clientAddressState,
            "city":$scope.clientAddressCity
            // NOTE --> change once CreditCards are implemented.
            //"cards":
          })
          .then(function successCallback(response) {
            $scope.saveClientChangesStatus = 'Datos guardados exitosamente.';
          }, function errorCallback(response) {
            $scope.saveClientChangesStatus = 'Error al enviar información.';
          });
        } else {
          $scope.saveClientChangesStatus = 'Las nuevas contraseñas no coinciden.'
        }
      } else {
        $scope.saveClientChangesStatus = 'Contraseña incorrecta.';
      }
    }

    // Delete client account.
    $scope.deleteClient = function() {
      $http.delete(route + '/client')
      .then(function successCallback(response) {
        $state.go('client_account_deleted');
        console.log('Account deleted.');
      }, function errorCallback(response) {
        console.log('Couldn\'t delete account.');
      });
    }

    $scope.getClient();
  }).
  controller('Controller_ClientRegister', function ($scope, $http, $state, $stateParams) {
    // Controller for registering a new client.

    // To start register, must check if account (email) is already taken. If not, we cal the POST method.
    $scope.registerClient = function() {
      $http.get(route + '/clients?email=' + $scope.clientEmail)
      .then(function successCallback(response) {
        // If response.data !== 0, it means there are already accounts with that email.
        if (response.data === '0') {
          $scope.makeClientPOST();
        } else {
          $scope.clientRegisterStatus = 'Esta cuenta de correo ya está siendo utilizada.';
        }
      }, function errorCallback(response) {
        $scope.clientRegisterStatus = 'No se logró hacer la petición.'
      });
    }

    // Register client POST method.
    $scope.makeClientPOST = function() {
      if (($scope.clientPassword !== $scope.clientPasswordRepeat) || (
            $scope.clientEmail === '' || $scope.clientEmail === undefined ||
            $scope.clientName === '' || $scope.clientName === undefined ||
            $scope.clientLastName === '' || $scope.clientLastName === undefined ||
            $scope.clientBirthdate === '' || $scope.clientBirthdate === undefined ||
            $scope.clientAddressStreet === '' || $scope.clientAddressStreet === undefined ||
            $scope.clientAddressNumber === '' || $scope.clientAddressNumber === undefined ||
            $scope.clientAddressState === '' || $scope.clientAddressState === undefined ||
            $scope.clientAddressCity === '' || $scope.clientAddressCity === undefined ||
            $scope.clientAddressPostalCode === '' || $scope.clientAddressPostalCode === undefined ||
            $scope.clientPassword === '' || $scope.clientPassword === undefined
            //$scope.clientProfilePicture === '' || $scope.clientProfilePicture === undefined ||
          )) {
        $scope.clientRegisterStatus = 'Las contraseñas no coinciden y/o hay datos faltantes.';
      } else {
        $http.post(route + '/register', {
          "email":$scope.clientEmail,
          "name":$scope.clientName,
          "lastName":$scope.clientLastName,
          "birthdate":$scope.clientBirthdate,
          "street":$scope.clientAddressStreet,
          "number":$scope.clientAddressNumber,
          "state":$scope.clientAddressState,
          "city":$scope.clientAddressCity,
          "postalCode":$scope.clientAddressPostalCode,
          "password":$scope.clientPassword
          // NOTE --> Uncomment when available.
          //"profilePicture":$scope.clientProfilePicture
        })
        .then(function successCallback(response) {
          $scope.clientRegisterStatus = 'Tu cuenta se ha creado exitosamente. \nPor favor revisa tu correo para verificarla.'
        }, function errorCallback(response) {
          $scope.clientRegisterStatus = 'Error al crear la cuenta.'
        });
      }
    }
  }).
  controller('Controller_ClientShoppingCart', function ($scope, authenticationService, $http, networkService, $state) {

    const visaUrl = "http://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/Visa-icon.png";
    const masterCardUrl = "http://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/Master-Card-icon.png"
    const americanExpressUrl = "http://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/American-Express-icon.png";
    const cardThumbs = [visaUrl, masterCardUrl, americanExpressUrl];

    $scope.currentUser = function(){
      return authenticationService.currentUser();
    }
    //get current user. May be client or admin
    $scope.currentUser().then((data) =>{
      $scope.client = data.user      
      $scope.isAdmin = data.admin;      
    })

    //get client's cart
    networkService.fetchCart().then((response) =>{
      if(response.status === 200)
        $scope.cart = response.data;
    })

    /*
    * Turns the credit card number from 
    * 1234567890123456 to ****3456
    */
    $scope.secureCard = function(card){
      return "****" + card.number.slice(12,16)
    }

    //Gets a random credit card image
    $scope.randomCardImage = function(){
      // var r = Math.floor(Math.random() * (3 - 0 + 1)) + 0;      
      return cardThumbs[2];
    }
    //Redirects to client profile
    $scope.goToUpdate = function(){
      $state.go('client_profile');
    }
    //Redirects to login
    $scope.goToLogin = function(){
      $state.go('client_login');
    }

    //Performs a checkout of the client's products
    $scope.checkout = function(){
      $http.post(route + '/checkout', {})
        .success((ans) =>{
          console.log(ans)
        })
        .error((err) =>{
          console.log(err)
        })
    }


  }).
  controller('Controller_ClientVerify', function ($scope, $state) {
    // For redirecting clients to main menu.
    $scope.loadMainMenu = function() {
      $state.go('main_menu');
    }
  });
  