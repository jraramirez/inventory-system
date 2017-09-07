/**
*	Fund Cluster Controller Module
*
*/
(function(){

'use strict';

		angular
			.module('equipmentInventory')
			.controller('FCCtrl', ['$filter','$location','FCService', FCCtrl])
			.controller('ItemByFCCtrl', ['ItemService', '$routeParams', '$window', ItemByFCCtrl]);

			//Controller for viewing all the fund clusters
			function FCCtrl($filter, $location, FCService) {

				var vm = this;

				//Storage of array fund clusters
				vm.fcs = [];
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for getting all the fund cluster data from server via fund cluster service function
				vm.initialize = function() {
					FCService
					.getAllFC()
					.then(function(data) {
						vm.fcs = data;
						vm.itemsToDisplay = vm.fcs;
						vm.itemsPerPage = 10;
					});
				}
				vm.initialize();

			}

			//Controller for viewing all the items under a selected fund cluster
			function ItemByFCCtrl(ItemService, $routeParams, $window) {

				var vm = this;
				//name of the selected fund cluster
				vm.name = $routeParams.name;

				//Storage of array items data;
				vm.items = [];
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for getting all the items data by fund cluster name from server via item service function
				vm.initialize = function(name) {
					ItemService
						.getFCItems(name)
						.then(function(data) {
							vm.items = data;
						});

					//Parameters for smart-table
					vm.itemsToDisplay = vm.items;
					vm.itemsPerPage = 10;
				}
				vm.initialize(vm.name);

				vm.goBack = function(){
					$window.history.back();
				}

			}

})();
