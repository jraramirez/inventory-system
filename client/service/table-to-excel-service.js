'use strict';

(function(){
	angular
		.module('equipmentInventory')
		.factory('TableToExcelService', ['FileSaver', 'Blob',TableToExcel]);

		function TableToExcel(FileSaver,Blob){
				return {
						tableToExcel: function(id) {
							var blob = new Blob([document.getElementById(id).innerHTML], {
								type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
							});

							FileSaver.saveAs(blob, "Report.xls");
						}
				};
		}
})();
