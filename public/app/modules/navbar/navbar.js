(function() {
	'use strict';

	angular.module("app")
		.directive('navBar', navbar)

	;

	function navbar() {
		var directive = {
			restrict: 'EA',
			controller: navbarCtrl,
			replace: true,
			scope: {},
			templateUrl: '/app/modules/navbar/navbar.html',
			link: linkFunc
		};

		return directive;

		function linkFunc(scope, element, attrs){
			var $sidebar = $('.page-sidebar');
			$sidebar.sidebar($sidebar.data());
		}

		function navbarCtrl( $scope, $state ) {
			$scope.state = $state;

		}
	}
})();
