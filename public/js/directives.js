'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });

angular.module('myApp').directive('gridDirective', function() {
	return {
		restrict: 'AEC',
		replace: true,
		templateUrl: 'partials/main_menu_grid.html',
		link: function(scope, elem, attrs) {			
		}
	}
});

angular.module('myApp.directives', []).
	directive('ngIf', function() {
    return {
      link: function(scope, element, attrs) {        
        scope.currentUser().then((data) =>{
          scope.client = data.user;
          scope.isAdmin = data.admin;          
          if(scope.$eval(attrs.ngIf)) {
            // remove '<div ng-if...></div>'
            scope = $              
            element.replaceWith(element.children())
          } else {
              element.replaceWith(' ')
          }
        })                
      }
    }
});