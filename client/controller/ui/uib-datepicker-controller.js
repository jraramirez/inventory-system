

(function(){
		'use strict';

		angular
			.module('equipmentInventory')
			.controller('UIBDatePickerCtrl',[UIBDatePickerCtrl]);

			function UIBDatePickerCtrl() {
				var vm = this;

				vm.isOpen = false;

				vm.options = {
					minMode: 'day',
					maxMode: 'year'
				};

				vm.setMinMode = function(mode){
					vm.options.minMode = mode;
				}

				vm.setMaxMode = function(mode){
					vm.options.maxMode = mode;
				}

				vm.open = function() {
					vm.isOpen = true;
				}

				vm.openInMonths = function() {
					vm.setMinMode('month');
					vm.isOpen = true;
				}

				vm.openInYears = function() {
					vm.setMinMode('year');
					vm.isOpen = true;
				}

			}
})();
