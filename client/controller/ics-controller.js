/**
*	Invetory Custodian Slip Controller Module
*
*/
'use strict';

(function(){
		angular
			.module('equipmentInventory')
			.controller('ICSCtrl', ['$filter','$location', 'ItemService', 'ICSService', ICSCtrl])
			.controller('ItemByICSCtrl', ['ItemService','$routeParams', ItemByICSCtrl])
			.controller('AddICSCtrl', ['$filter','$location', '$route', 'ItemService', 'FCService', 'ICSService', AddICSCtrl])
			.controller('ICSReportCtrl', ['$filter', '$route', 'ItemService', 'DRService', 'ICSService', ICSReportCtrl]);

			//Controller for viewing all the requisition issue slips
			function ICSCtrl($filter,$location,ItemService, ICSService) {

				var vm = this;
				//Storage of array requisition issue slips data;
				vm.ICSs = [];
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for getting all the ICS data from server via ICS service function
				vm.initialize = function() {
					ICSService
						.getAllICS()
						.then(function(data) {
							vm.ICSs = data;
							vm.itemsToDisplay = vm.ICSs;
							vm.itemsPerPage = 10;
						});
				}
				vm.initialize();

			}

			//Controller for viewing the items under a selected ICS
			function ItemByICSCtrl(ItemService, $routeParams) {

				var vm = this;
				//id number of the selected requisition issue slip
				vm.id = $routeParams.id;

				//Storage of array items data;
				vm.items = [];
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for getting all the items data by requisition issue slip id from server via item service function
				vm.initialize = function(id) {
					ItemService
						.getAllItemsByICSID(id)
						.then(function(data) {
							vm.items = data;
						});

					//Parameters for smart-table
					vm.itemsToDisplay = vm.items;
					vm.itemsPerPage = 10;
				}
				vm.initialize(vm.id);

			}

			//Controller for adding a new ICS
			function AddICSCtrl($filter, $location, $route, ItemService, FCService, ICSService) {

				var vm = this;

				//Storate of the new ICS
				vm.newICS = {};
				//initialize values for new ICS
				vm.newICS.total_quantity = 0;
				vm.newICS.total_amount = 0;
				vm.newICS.delivery_receipt_fund_cluster_name = 'RAF 101';
				vm.total_quantity_stock = 0;
				//Storage of array items data within the new ICS
				vm.ICSItems = [];
				//Storate of the new item to be added into the new ICS
				vm.newItem = {};
				//Storate of the fund cluster DRs
				vm.DRs = [];
				//Storate of the DR where the new ICS is associated
				vm.tempDR = null;
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				vm.itemError = false;
				vm.itemErrorMessage = "";
				vm.ICSError = false;
				vm.ICSErrorMessage = "";
				//Boolean variables used for ng-show
				vm.validICS = false;
				vm.addingNewItem = false;
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for reloading the page
				vm.startOver = function(){
					$route.reload();
				}

				//Function for getting all the delivery receipt data under a fund cluster from the server via fund cluster service
				vm.getAllDRByFC = function(fund_cluster_name){
					FCService
						.getAllDRByFC(fund_cluster_name)
						.then(function(data){
							vm.DRs = data;
							vm.tempRD = null;
						})
				}

				//Function for deleting a ICS item that will be added
				vm.removeEntry = function(id){
					vm.ICSItems.forEach(function(element, index) {
						if(element.id === id)
							vm.ICSItems.splice(index, 1);
					});
					vm.updateTotals();
				}

				//Function for checking if the new ICS is already in the server via ICS service function. If not, the items that can be added are prepared.
				vm.checkICS = function(){
					ICSService
						.getICS(vm.newICS.id)
						.then(function(data){
							if(data.length == 0) {
								vm.validICS = true;
								vm.error = false;
								vm.newICS.delivery_receipt_id = vm.tempDR.id;
								ItemService
									.getFCItems(vm.newICS.delivery_receipt_fund_cluster_name)
									.then(function(data) {
										vm.ICSItems = data;
										vm.ICSItems.forEach(function(element, i){
											element.quantity_subtracted = element.quantity;
											element.ics_id = vm.newICS.id;
											element.item_id = element.id;
											vm.total_quantity_stock = vm.total_quantity_stock + element.quantity;
										})
										vm.ICSItems.forEach(function(element, i){
											if(element.quantity == 0)
												vm.ICSItems.splice(i, 1);
										})
										vm.updateTotals();
										vm.itemsToDisplay = vm.ICSItems;
										vm.itemsPerPage = 10;
									});
							}
							else {
								vm.validICS = false;
								vm.error = true;
								vm.errorMessage="Duplicate ICS Number";
							}
						})
						.catch(function(data){
							vm.validICS = false;
							vm.error = true;
							vm.errorMessage="Error in the System";
						});
						return true;
				}

				//Function for updating the totals of the new ICS after adding an item
				vm.updateTotals= function(){
					vm.newICS.total_quantity = 0;
					vm.newICS.total_amount = 0;
					vm.ICSItems.forEach(function(element, i){
						if(element.quantity == 0)
						vm.ICSItems.splice(i, 1);
					})
					var i;
					for(i=0;i<vm.ICSItems.length;i++){
						vm.ICSItems[i].amount = vm.ICSItems[i].price * vm.ICSItems[i].quantity_subtracted;
						vm.newICS.total_amount = vm.newICS.total_amount + vm.ICSItems[i].amount;
						vm.newICS.total_quantity = vm.newICS.total_quantity + vm.ICSItems[i].quantity_subtracted;
					}
				}

				//Function for sending the new ICS into the server via ICS service function. This function also adds the items under the ICS and fund cluster and updates the fund cluster
				vm.addICS = function(){

					//format date before sending to service
					vm.newICS.date_added = $filter('date')(vm.newICS.date_added,'yyyy-MM-dd');

					ICSService
						.addICS(vm.newICS)
						.then(function(data){
							ItemService
								.addItemsToICS(vm.newICS.id,vm.ICSItems)
								.then(function(data) {
									var i;
									for(i=0;i<vm.ICSItems.length;i++){
										vm.ICSItems[i].quantity = -vm.ICSItems[i].quantity_subtracted;
									}
									ItemService
										.addItemsToFC(vm.newICS.delivery_receipt_fund_cluster_name, vm.ICSItems)
										.then(function(data){
											vm.newICS.total_quantity = -vm.newICS.total_quantity;
											vm.newICS.total_amount = -vm.newICS.total_amount;
											FCService
												.updateFC(vm.newICS)
												.then(function(data){
													//redirect to the view page after successfully adding the ICS items
													$location.path('/ics/view/');
													vm.ICSItems = {};
													vm.newICS = {};
												})
										})
								})
								.catch(function(data){
									vm.error = true;
									vm.errorMessage = "Some Error"; //TODO
								});
						})
						.catch(function(data){
							vm.error=true;
							vm.errorMessage=data.errorMessage;
						});

				};

				//Function for checking if the CheckICSForm is valid.
				vm.validateCheckICSForm = function(CheckICSForm){
					if(!vm.tempDR || !vm.newICS.responsible || !vm.newICS.division || !vm.newICS.id || !vm.newICS.date_added){
						if(!vm.newICS.id)
							CheckICSForm.id.$setDirty();
						if(!vm.tempDR)
							CheckICSForm.delivery_receipt_id.$setDirty();
						if(!vm.newICS.division)
							CheckICSForm.division.$setDirty();
						if(!vm.newICS.responsible)
							CheckICSForm.responsible.$setDirty();
						if(!vm.newICS.date_added)
							CheckICSForm.date_added.$setDirty();
						vm.error=true;
						vm.errorMessage="Please Fill Out the Required Fields";
						return false;
					}
					else{
						CheckICSForm.$setPristine();
						CheckICSForm.$setUntouched();
						vm.error=false;
						return true;
					}
				};

				//Function for checking if the ICSItemsForm form is valid.
				vm.validateICSItemsForm = function(AddICSItemsForm){
					var i;
					for(i=0; i<vm.ICSItems.length;i++){
						if(!(vm.ICSItems[i].quantity_subtracted >= 0)){
							AddICSItemsForm.quantity_subtracted.$setDirty();
							vm.itemError=true;
							vm.itemErrorMessage="Please Fill Out the Required Fields";
							return false;
						}
						if(vm.ICSItems[i].quantity_subtracted > vm.ICSItems[i].quantity){
							vm.itemError=true;
							vm.itemErrorMessage="Some of the Issued Quantities are Larger than Stock Quantity";
							return false;
						}
					}
					AddICSItemsForm.$setPristine();
					AddICSItemsForm.$setUntouched();
					vm.itemError=false;
					vm.itemErrorMessage="";
					return true;
				}

				vm.getAllDRByFC('RAF 101');
				vm.updateTotals();
			};

			//Controller for viewing the monthly report about all the ICSs under a selected fund cluster
			function ICSReportCtrl($filter, $route, ItemService, DRService, ICSService) {
				var vm = this;

				//Storage of data needed for the monthly report
				vm.month = '6';
				vm.startMonth = new Date();
				vm.endMonth = new Date();
				vm.startMonth.setMonth('0');
				vm.endMonth.setMonth('6');
				vm.fund_cluster_name = 'RAF 101';
				vm.ICSs = [];
				//Boolean variables for ng-show
				vm.validMonth = false;
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				//Parameters for smart table
				vm.itemsPerPage = 0;

				//Function for reloading the page
				vm.startOver = function(){
					$route.reload();
				}

				vm.setDate = function(){
					vm.endMonth.setMonth(vm.month);
					if(vm.month == '6'){
						vm.startMonth.setMonth('0');
					}
					else{
						vm.startMonth.setMonth('7');
					}
				}

				//Function for getting all the ICSs under a selected year-month and fund cluster
				vm.getAllICSByFCMonth = function(){
					vm.setDate();
					ICSService
						.getAllICSByFCMonth(vm.fund_cluster_name, vm.startMonth, vm.endMonth)
						.then(function(data){
							vm.ICSs = data;
							vm.ICSs.forEach(function(element, i) {
								ItemService
								.getAllItemsByICSID(element.id)
								.then(function(data) {
									element.items = data;
									vm.itemsToDisplay = vm.ICSs;
								});
							});
						})
				}

				//Function for checking if the CheckMonthForm is valid
				vm.validateCheckMonthForm = function(CheckMonthForm){
					if(!vm.month){
						CheckMonthForm.month.$setDirty();
						vm.error = true;
						vm.errorMessage = "Please Select a Month.";
						return false;
					}
					CheckMonthForm.$setPristine();
					CheckMonthForm.$setUntouched();
					vm.validMonth = true;
					vm.error = false;
					vm.errorMessage = "";
					return true;

				}

			}

})();
