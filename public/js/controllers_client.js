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
        // Emit a login event
        $scope.$emit('loginEvent');
        // Go to main_menu
        $state.go('main_menu');
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
    

/*    // Logout function
    $scope.logout = function() {
      $http.get(route + '/logout')
      .then(function successCallback(response) {
        $state.go('client_login');
      })
    }
*/
    // Get client
    $scope.getClient = function() {      
      $http.get(route + '/client')
      .then(function successCallback(response) {        
        $scope.clientName = response.data.name
        $scope.clientLastName = response.data.lastName
        $scope.clientEmail = response.data.email
        $scope.clientBirthdate = response.data.birthdate
        $scope.clientProfilePicture = response.data.avatar
        var clientIsVerified = response.data.verified
        $scope.prev_clientPassword = response.data.password        
        $scope.clientAddressCreditCards = response.data.cards
        $scope.clientCartOrders = response.data.cart.orders
        $scope.clientCartDiscount = response.data.cart.discount        
        $scope.clientNumberOfItemsBought = response.data.boughtItems
        $scope.clientAddressStreet = response.data.address.street
        $scope.clientAddressPostalCode = response.data.address.postalCode
        $scope.clientAddressNumber = response.data.address.number
        $scope.clientAddressState = response.data.address.state
        $scope.clientAddressCity = response.data.address.city
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
            "avatar":$scope.clientProfilePicture,
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

    $scope.goToWallet = function(){
      $state.go('wallet')
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
  controller('Controller_ClientShoppingCart', function ($rootScope, $scope, authenticationService, $http, networkService, $state) {

    var visaUrl = "http://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/Visa-icon.png";
    var masterCardUrl = "http://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/Master-Card-icon.png"
    var americanExpressUrl = "http://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/American-Express-icon.png";
    var cardThumbs = [visaUrl, masterCardUrl, americanExpressUrl];

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

    $scope.goToWallet = function(){
      $state.go('wallet');
    }

    //Redirects to login
    $scope.goToLogin = function(){
      $state.go('client_login');
    }

    $scope.getTotal = function(){
      var total = 0
      $scope.cart.orders.forEach((order, i) =>{
        total += order.product.price * order.ammount
      })
      if($scope.client.cart.discount)
        total -= total *($scope.client.cart.discount/100)

      return total
    }

    //Performs a checkout of the client's products
    $scope.checkout = function(){
      $http.post(route + '/checkout', {})
        .success((ans) =>{
          $state.reload();          
          console.log(ans)
          if(!ans.error){
            $rootScope.itemsInCart = 0;
          }
        })
        .error((err) =>{
          console.log(err)
        })
    }

    $scope.removeItem = function(order){      
      $http.put(route + '/cart', {
        product: order.product._id,
        ammount: order.ammount,
        action: "remove"
      }).success((ans) =>{
        $rootScope.itemsInCart --;
        console.log(ans);
        $state.reload();
      }).error((err) =>{
        console.log(err);
      })
    }


  }).
  controller('Controller_ClientVerify', function ($scope, $state) {
    // For redirecting clients to main menu.
    $scope.loadMainMenu = function() {
      $state.go('main_menu');
    }
  }).
  controller('Controller_ClientWallet', function($scope, $http, $state, authenticationService){
    $scope.visa = "http://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/Visa-icon.png";
    $scope.masterCard = "http://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/Master-Card-icon.png"
    $scope.americanExpress = "http://icons.iconarchive.com/icons/designbolts/credit-card-payment/256/American-Express-icon.png";
    $scope.cardThumbs = [$scope.visa, $scope.masterCard, $scope.americanExpress];
    $scope.cardNumber = null;
    $scope.expirationDate = null;
    $scope.cardType = null;

    $scope.currentUser = function(){
      return authenticationService.currentUser();
    }
    //get current user. May be client or admin
    $scope.currentUser().then((data) =>{
      $scope.client = data.user      
      $scope.isAdmin = data.admin;      
    })

    $scope.goToLogin = function(){
      $state.go('client_login')
    }

    $scope.mapCard = function(card){
      switch (card.cardType) {
        case "master card":
          return $scope.masterCard
        case "visa":
          return $scope.visa;
        case "american express":
          return $scope.americanExpress;

        default:
          return $scope.visa          
      }
    }

    $scope.removeCard = function(card){
      $http.delete(route + '/wallet?number=' + card.number)
      .success((res) =>{
        console.log(res)
        $state.reload();
      }).error((err) =>{
        console.log(err);
      })
    }

    $scope.addCard = function(){    
      console.log($scope.cardNumber)
      console.log($scope.expirationDate)
      console.log($scope.cardType);
      $http.put(route + '/wallet', {
        number:  $scope.cardNumber ,        
        expirationDate: $scope.expirationDate,
        type: $scope.cardType
      }).success((ans) =>{
        if(!ans.error)
          $state.reload()
      }).error((err)=>{
        console.log(err);
      })
    }


  });
  