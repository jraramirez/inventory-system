/**
*	Requisition Issue Slip Controller Module
*
*/
'use strict';

(function(){
		angular
			.module('equipmentInventory')
			.controller('RISCtrl', ['$filter','$location', 'ItemService', 'RISService', RISCtrl])
			.controller('ItemByRISCtrl', ['ItemService','$routeParams', ItemByRISCtrl])
			.controller('AddRISCtrl', ['$filter','$location', '$route', 'ItemService', 'FCService', 'RISService', AddRISCtrl])
			.controller('RISStockCtrl', ['$filter', '$route', 'ItemService', 'DRService', 'RISService', RISStockCtrl])
			.controller('MonthlyCtrl', ['$filter', '$route', 'ItemService', 'DRService', 'RISService', MonthlyCtrl]);

			//Controller for viewing all the requisition issue slips
			function RISCtrl($filter,$location,ItemService, RISService) {

				var vm = this;
				//Storage of array requisition issue slips data;
				vm.RISs = [];
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for getting all the RIS data from server via RIS service function
				vm.initialize = function() {
					RISService
						.getAllRIS()
						.then(function(data) {
							vm.RISs = data;
							vm.itemsToDisplay = vm.RISs;
							vm.itemsPerPage = 10;
						});
				}
				vm.initialize();

			}

			//Controller for viewing the items under a selected RIS
			function ItemByRISCtrl(ItemService, $routeParams) {

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
						.getAllItemsByRISID(id)
						.then(function(data) {
							vm.items = data;
						});

					//Parameters for smart-table
					vm.itemsToDisplay = vm.items;
					vm.itemsPerPage = 10;
				}
				vm.initialize(vm.id);

			}

			//Controller for adding a new RIS
			function AddRISCtrl($filter, $location, $route, ItemService, FCService, RISService) {

				var vm = this;

				//Storate of the new RIS
				vm.newRIS = {};
				//initialize values for new RIS
				vm.newRIS.total_quantity = 0;
				vm.newRIS.total_amount = 0;
				vm.newRIS.delivery_receipt_fund_cluster_name = 'RAF 101';
				vm.total_quantity_stock = 0;
				//Storage of array items data within the new RIS
				vm.RISItems = [];
				//Storate of the new item to be added into the new RIS
				vm.newItem = {};
				//Storate of the fund cluster DRs
				vm.DRs = [];
				//Storate of the DR where the new RIS is associated
				vm.tempDR = null;
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				vm.itemError = false;
				vm.itemErrorMessage = "";
				vm.RISError = false;
				vm.RISErrorMessage = "";
				//Boolean variables used for ng-show
				vm.validRIS = false;
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

				//Function for deleting a RIS item that will be added
				vm.removeEntry = function(id){
					vm.RISItems.forEach(function(element, index) {
						if(element.id === id)
							vm.RISItems.splice(index, 1);
					});
					vm.updateTotals();
				}

				//Function for checking if the new RIS is already in the server via RIS service function. If not, the items that can be added are prepared.
				vm.checkRIS = function(){
					RISService
						.getRIS(vm.newRIS.id)
						.then(function(data){
							if(data.length == 0) {
								vm.validRIS = true;
								vm.error = false;
								vm.newRIS.delivery_receipt_id = vm.tempDR.id;
								ItemService
									.getFCItems(vm.newRIS.delivery_receipt_fund_cluster_name)
									.then(function(data) {
										vm.RISItems = data;
										vm.RISItems.forEach(function(element, i){
											element.current_quantity = element.quantity;
											element.quantity_subtracted = element.quantity;
											element.ris_id = vm.newRIS.id;
											element.item_id = element.id;
											vm.total_quantity_stock = vm.total_quantity_stock + element.quantity;
										})
										vm.RISItems.forEach(function(element, i){
											if(element.quantity == 0)
												vm.RISItems.splice(i, 1);
										})
										vm.updateTotals();
										vm.itemsToDisplay = vm.RISItems;
										vm.itemsPerPage = 10;
									});
							}
							else {
								vm.validRIS = false;
								vm.error = true;
								vm.errorMessage="Duplicate RIS Number";
							}
						})
						.catch(function(data){
							vm.validRIS = false;
							vm.error = true;
							vm.errorMessage="Error in the System";
						});
						return true;
				}

				//Function for updating the totals of the new RIS after adding an item
				vm.updateTotals= function(){
					vm.newRIS.total_quantity = 0;
					vm.newRIS.total_amount = 0;
					vm.RISItems.forEach(function(element, i){
						if(element.quantity == 0)
						vm.RISItems.splice(i, 1);
					})
					var i;
					for(i=0;i<vm.RISItems.length;i++){
						vm.RISItems[i].amount = vm.RISItems[i].price * vm.RISItems[i].quantity_subtracted;
						vm.newRIS.total_amount = vm.newRIS.total_amount + vm.RISItems[i].amount;
						vm.newRIS.total_quantity = vm.newRIS.total_quantity + vm.RISItems[i].quantity_subtracted;
					}
				}

				//Function for sending the new RIS into the server via RIS service function. This function also adds the items under the RIS and fund cluster and updates the fund cluster
				vm.addRIS = function(){

					//format date before sending to service
					vm.newRIS.date_added = $filter('date')(vm.newRIS.date_added,'yyyy-MM-dd');

					RISService
						.addRIS(vm.newRIS)
						.then(function(data){
							ItemService
								.addItemsToRIS(vm.newRIS.id,vm.RISItems)
								.then(function(data) {
									var i;
									for(i=0;i<vm.RISItems.length;i++){
										vm.RISItems[i].quantity = -vm.RISItems[i].quantity_subtracted;
									}
									ItemService
										.addItemsToFC(vm.newRIS.delivery_receipt_fund_cluster_name, vm.RISItems)
										.then(function(data){
											vm.newRIS.total_quantity = -vm.newRIS.total_quantity;
											vm.newRIS.total_amount = -vm.newRIS.total_amount;
											FCService
												.updateFC(vm.newRIS)
												.then(function(data){
													//redirect to the view page after successfully adding the RIS items
													$location.path('/ris/view/');
													vm.RISItems = {};
													vm.newRIS = {};
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

				//Function for checking if the CheckRISForm is valid.
				vm.validateCheckRISForm = function(CheckRISForm){
					if(!vm.tempDR || !vm.newRIS.responsible || !vm.newRIS.division || !vm.newRIS.id || !vm.newRIS.date_added){
						if(!vm.newRIS.id)
							CheckRISForm.id.$setDirty();
						if(!vm.tempDR)
							CheckRISForm.delivery_receipt_id.$setDirty();
						if(!vm.newRIS.division)
							CheckRISForm.division.$setDirty();
						if(!vm.newRIS.responsible)
							CheckRISForm.responsible.$setDirty();
						if(!vm.newRIS.date_added)
							CheckRISForm.date_added.$setDirty();
						vm.error=true;
						vm.errorMessage="Please Fill Out the Required Fields";
						return false;
					}
					else{
						CheckRISForm.$setPristine();
						CheckRISForm.$setUntouched();
						vm.error=false;
						return true;
					}
				};

				//Function for checking if the RISItemsForm form is valid.
				vm.validateRISItemsForm = function(AddRISItemsForm){
					var i;
					for(i=0; i<vm.RISItems.length;i++){
						if(!(vm.RISItems[i].quantity_subtracted >= 0)){
							AddRISItemsForm.quantity_subtracted.$setDirty();
							vm.itemError=true;
							vm.itemErrorMessage="Please Fill Out the Required Fields";
							return false;
						}
						if(vm.RISItems[i].quantity_subtracted > vm.RISItems[i].quantity){
							vm.itemError=true;
							vm.itemErrorMessage="Some of the Issued Quantities are Larger than Stock Quantity";
							return false;
						}
					}
					AddRISItemsForm.$setPristine();
					AddRISItemsForm.$setUntouched();
					vm.itemError=false;
					vm.itemErrorMessage="";
					return true;
				}

				vm.getAllDRByFC('RAF 101');
				vm.updateTotals();
			};

			//Controller for viewing the stock card of an item
			function RISStockCtrl($filter, $route, ItemService, DRService, RISService) {
				var vm = this;

				//Storage of data needed for the stock card
				vm.tempItem = null;
				vm.items = [];
				vm.DRs = [];
				vm.fund_cluster_name = 'RAF 101';
				//Boolean variables used for ng-show
				vm.showCard = false;
				vm.validItem = false;
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				//Parameters for smart table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for reloading the page
				vm.startOver = function(){
					$route.reload();
				}

				//Function for getting all the items via item service
				vm.initialize = function(){
					ItemService
					.getAllItems()
					.then(function(data){
						vm.items = data;
					});
				}

				//Function for getting all the delivery receipts and RISs of an item under a selected fund cluster
				vm.getAllDRsAndRISsOfFCItem = function(){
					vm.showCard = true;
					ItemService
						.getAllDRsAndRISsOfFCItem(vm.tempItem.id, vm.fund_cluster_name)
						.then(function(data){
							vm.DRs = data;
							vm.itemsToDisplay = data;
							if(vm.DRs.length > 0){
								vm.validItem = true;
							}
							else {
								vm.validItem = false;
							}
						})
				}

				//Function for checking if the SelectItemForm is valid
				vm.validateSelectItemForm = function(SelectItemForm){
					if(!vm.tempItem){
						vm.error = true;
						vm.errorMessage = "No Item Selected. Please Select an Item.";
						return false;
					}
					vm.error = false;
					vm.errorMessage = "";
					return true;
				}

				vm.initialize();

			}

			//Controller for viewing the monthly report about all the RISs under a selected fund cluster
			function MonthlyCtrl($filter, $route, ItemService, DRService, RISService) {
				var vm = this;

				//Storage of data needed for the monthly report
				vm.month = new Date();
				vm.fund_cluster_name = 'RAF 101';
				vm.RISs = [];
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

				//Function for getting all the RISs under a selected year-month and fund cluster
				vm.getAllRISByFCMonth = function(){
					RISService
						.getAllRISByFCMonth(vm.fund_cluster_name, vm.month)
						.then(function(data){
							vm.RISs = data;
							vm.RISs.forEach(function(element, i) {
								ItemService
								.getAllItemsByRISID(element.id)
								.then(function(data) {
									element.items = data;
									vm.itemsToDisplay = vm.RISs;
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
