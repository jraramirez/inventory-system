'use strict';

(function(){
	angular
		.module('equipmentInventory')
		.controller('TableToExcelCtrl', ['$timeout','TableToExcelService', TableToExcelCtrl]);

	function TableToExcelCtrl($timeout,TableToExcelService){
		var vm = this;

		vm.exportToExcel=function(tableId){ // ex: '#my-table'
			TableToExcelService.tableToExcel(tableId);
		}
	}
})();
