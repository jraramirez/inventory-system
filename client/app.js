/**
*	Main Javascript file for Angular
*/
(function() {
	'use strict';

	angular
		.module('equipmentInventory', ['smart-table','ngRoute','ui.bootstrap','ngFileSaver'])
		.config(['$routeProvider',setRoutes])
		.run(onRouteChange)
		.run(['$templateCache', function ($templateCache) {
		 $templateCache.put('template/smart-table/pagination.html',
		 '<nav ng-if="numPages && pages.length >= 2"><ul class="pagination pagination-table"  >' +
		 '<li ng-class=""><a ng-click="selectPage(1)">First</a></li>' +
		 '<li ng-class=""><a ng-click="selectPage(currentPage-1)"><i class="glyphicon glyphicon-menu-left"></i></a></li>' +
		 '<li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li>' +
		 '<li ng-class=""><a ng-click="selectPage(currentPage+1)"><i class="glyphicon glyphicon-menu-right"></i></a></li>' +
		 '<li ng-class=""><a ng-click="selectPage(numPages)">Last</a></li>' +
		 '</ul></nav>');
		}]);

		function setRoutes($routeProvider) {
			$routeProvider
				.when('/', {
					templateUrl: 'view/home.html'
				})
				.when('/item/add', {
					templateUrl: 'view/item/item-add.html'
				})
				.when('/item/view', {
					templateUrl: 'view/item/item-view.html'
				})
				.when('/dr/view', {
					templateUrl: 'view/dr/dr-view.html'
				})
				.when('/dr/add', {
					templateUrl: 'view/dr/dr-add.html'
				})
				.when('/dr/view/:id/items', {
					templateUrl: 'view/dr/item-by-dr-view.html'
				})
				.when('/ris/view', {
					templateUrl: 'view/ris/ris-view.html'
				})
				.when('/ris/view/:id/items', {
					templateUrl: 'view/ris/item-by-ris-view.html'
				})
				.when('/ris/view/stock-card', {
					templateUrl: 'view/ris/stock-card.html'
				})
				.when('/ris/monthly-report', {
					templateUrl: 'view/ris/monthly-report.html'
				})
				.when('/ris/add', {
					templateUrl: 'view/ris/ris-add.html'
				})
				.when('/ics/view', {
					templateUrl: 'view/ics/ics-view.html'
				})
				.when('/ics/view/:id/items', {
					templateUrl: 'view/ics/item-by-ics-view.html'
				})
				.when('/ics/ics-report', {
					templateUrl: 'view/ics/ics-report.html'
				})
				.when('/ics/add', {
					templateUrl: 'view/ics/ics-add.html'
				})
				.when('/par/view', {
					templateUrl: 'view/par/par-view.html'
				})
				.when('/par/view/:id/items', {
					templateUrl: 'view/par/item-by-par-view.html'
				})
				.when('/par/par-report', {
					templateUrl: 'view/par/par-report.html'
				})
				.when('/par/add', {
					templateUrl: 'view/par/par-add.html'
				})
				.when('/par/view/property-card', {
					templateUrl: 'view/par/property-card.html'
				})
				.when('/par/transfer/:id', {
					templateUrl: 'view/par/transfer.html'
				})
				.when('/fc/view', {
					templateUrl: 'view/fc/fc-view.html'
				})
				.when('/fc/view/:name/items', {
					templateUrl: 'view/fc/item-by-fc-view.html'
				})
				.when('/account/login', {
					templateUrl: 'view/account/login.html'
				})
				.when('/account/register', {
					templateUrl: 'view/account/register.html'
				})
				.otherwise({redirectTo: '/'});
		}

		function onRouteChange($rootScope, $location, $route, $window, AccountService) {
			$rootScope.$on('$routeChangeStart', function (event, next, current) {
				AccountService.isLoggedIn().then(
					function success(){
						
					},
					function failure(){
						$location.path('/account/login');
					});
			});
		}
})();
