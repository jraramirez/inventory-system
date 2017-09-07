/**
*	Property Acknowledgement Receipt Controller Module
*
*/
'use strict';

(function(){
		angular
			.module('equipmentInventory')
			.controller('PARCtrl', ['$filter','$location', 'ItemService', 'PARService', PARCtrl])
			.controller('ItemByPARCtrl', ['ItemService','$route', '$routeParams', ItemByPARCtrl])
			.controller('AddPARCtrl', ['$filter','$location', '$route', 'ItemService', 'FCService', 'PARService', AddPARCtrl])
			.controller('PARCardCtrl', ['$filter', '$route', 'ItemService', 'DRService', 'PARService', PARCardCtrl])
			.controller('PARReportCtrl', ['$filter', '$route', 'ItemService', 'DRService', 'PARService', PARReportCtrl])
			.controller('PARTransferCtrl', ['$routeParams', '$location', 'PARService', PARTransferCtrl]);

			//Controller for viewing all the requisition issue slips
			function PARCtrl($filter,$location,ItemService, PARService) {

				var vm = this;
				//Storage of array requisition issue slips data;
				vm.PARs = [];
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for getting all the PAR data from server via PAR service function
				vm.initialize = function() {
					PARService
						.getAllPAR()
						.then(function(data) {
							vm.PARs = data;
							vm.itemsToDisplay = vm.PARs;
							vm.itemsPerPage = 10;
						});
				}
				vm.initialize();

			}

			//Controller for viewing the items under a selected PAR
			function ItemByPARCtrl(ItemService, $route, $routeParams) {

				var vm = this;
				//id number of the selected requisition issue slip
				vm.id = $routeParams.id;

				//Storage of array items data;
				vm.items = [];
				vm.PARItem = {};
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for getting all the items data by requisition issue slip id from server via item service function
				vm.initialize = function(id) {
					ItemService
						.getAllItemsByPARID(id)
						.then(function(data) {
							vm.items = data;
						});

					//Parameters for smart-table
					vm.itemsToDisplay = vm.items;
					vm.itemsPerPage = 10;
				}

				vm.toggleServiceable = function(par_id, item_id, value){
					vm.PARItem.value = value;
					ItemService
						.updatePARItem(par_id, item_id, vm.PARItem)
						.then(function(data){
							$route.reload();
						})
				}

				vm.initialize(vm.id);

			}

			//Controller for adding a new PAR
			function AddPARCtrl($filter, $location, $route, ItemService, FCService, PARService) {

				var vm = this;

				//Storate of the new PAR
				vm.newPAR = {};
				//initialize values for new PAR
				vm.newPAR.total_quantity = 0;
				vm.newPAR.total_amount = 0;
				vm.newPAR.delivery_receipt_fund_cluster_name = 'RAF 101';
				vm.total_quantity_stock = 0;
				//Storage of array items data within the new PAR
				vm.PARItems = [];
				//Storate of the new item to be added into the new PAR
				vm.newItem = {};
				//Storate of the fund cluster DRs
				vm.DRs = [];
				//Storate of the DR where the new PAR is associated
				vm.tempDR = null;
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				vm.itemError = false;
				vm.itemErrorMessage = "";
				vm.PARError = false;
				vm.PARErrorMessage = "";
				//Boolean variables used for ng-show
				vm.validPAR = false;
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

				//Function for deleting a PAR item that will be added
				vm.removeEntry = function(id){
					vm.PARItems.forEach(function(element, index) {
						if(element.id === id)
							vm.PARItems.splice(index, 1);
					});
					vm.updateTotals();
				}

				//Function for checking if the new PAR is already in the server via PAR service function. If not, the items that can be added are prepared.
				vm.checkPAR = function(){
					PARService
						.getPAR(vm.newPAR.id)
						.then(function(data){
							if(data.length == 0) {
								vm.validPAR = true;
								vm.error = false;
								vm.newPAR.delivery_receipt_id = vm.tempDR.id;
								ItemService
									.getFCItems(vm.newPAR.delivery_receipt_fund_cluster_name)
									.then(function(data) {
										vm.PARItems = data;
										vm.PARItems.forEach(function(element, i){
											element.quantity_subtracted = element.quantity;
											element.par_id = vm.newPAR.id;
											element.item_id = element.id;
											element.property_number = null;
											element.serviceable = 1;
											vm.total_quantity_stock = vm.total_quantity_stock + element.quantity;
										})
										vm.PARItems.forEach(function(element, i){
											if(element.quantity == 0)
												vm.PARItems.splice(i, 1);
										})
										vm.updateTotals();
										vm.itemsToDisplay = vm.PARItems;
										vm.itemsPerPage = 10;
									});
							}
							else {
								vm.validPAR = false;
								vm.error = true;
								vm.errorMessage="Duplicate PAR Number";
							}
						})
						.catch(function(data){
							vm.validPAR = false;
							vm.error = true;
							vm.errorMessage="Error in the System";
						});
						return true;
				}

				//Function for updating the totals of the new PAR after adding an item
				vm.updateTotals= function(){
					vm.newPAR.total_quantity = 0;
					vm.newPAR.total_amount = 0;
					vm.PARItems.forEach(function(element, i){
						if(element.quantity == 0)
						vm.PARItems.splice(i, 1);
					})
					var i;
					for(i=0;i<vm.PARItems.length;i++){
						vm.PARItems[i].amount = vm.PARItems[i].price * vm.PARItems[i].quantity_subtracted;
						vm.newPAR.total_amount = vm.newPAR.total_amount + vm.PARItems[i].amount;
						vm.newPAR.total_quantity = vm.newPAR.total_quantity + vm.PARItems[i].quantity_subtracted;
					}
				}

				//Function for sending the new PAR into the server via PAR service function. This function also adds the items under the PAR and fund cluster and updates the fund cluster
				vm.addPAR = function(){

					//format date before sending to service
					vm.newPAR.date_added = $filter('date')(vm.newPAR.date_added,'yyyy-MM-dd');

					PARService
						.addPAR(vm.newPAR)
						.then(function(data){
							ItemService
								.addItemsToPAR(vm.newPAR.id,vm.PARItems)
								.then(function(data) {
									var i;
									for(i=0;i<vm.PARItems.length;i++){
										vm.PARItems[i].quantity = -vm.PARItems[i].quantity_subtracted;
									}
									ItemService
										.addItemsToFC(vm.newPAR.delivery_receipt_fund_cluster_name, vm.PARItems)
										.then(function(data){
											vm.newPAR.total_quantity = -vm.newPAR.total_quantity;
											vm.newPAR.total_amount = -vm.newPAR.total_amount;
											FCService
												.updateFC(vm.newPAR)
												.then(function(data){
													//redirect to the view page after successfully adding the PAR items
													$location.path('/par/view/');
													vm.PARItems = {};
													vm.newPAR = {};
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

				//Function for checking if the CheckPARForm is valid.
				vm.validateCheckPARForm = function(CheckPARForm){
					if(!vm.tempDR || !vm.newPAR.person_in_charge || !vm.newPAR.id || !vm.newPAR.date_added){
						if(!vm.newPAR.id)
							CheckPARForm.id.$setDirty();
						if(!vm.tempDR)
							CheckPARForm.delivery_receipt_id.$setDirty();
						if(!vm.newPAR.person_in_charge)
							CheckPARForm.person_in_charge.$setDirty();
						if(!vm.newPAR.date_added)
							CheckPARForm.date_added.$setDirty();
						vm.error=true;
						vm.errorMessage="Please Fill Out the Required Fields";
						return false;
					}
					else{
						CheckPARForm.$setPristine();
						CheckPARForm.$setUntouched();
						vm.error=false;
						return true;
					}
				};

				//Function for checking if the PARItemsForm form is valid.
				vm.validatePARItemsForm = function(AddPARItemsForm){
					var i;
					for(i=0; i<vm.PARItems.length;i++){
						if(!(vm.PARItems[i].quantity_subtracted >= 0) || !vm.PARItems[i].property_number){
							if(!(vm.PARItems[i].quantity_subtracted >= 0))
								AddPARItemsForm.quantity_subtracted.$setDirty();
							if(!vm.PARItems[i].property_number)
								AddPARItemsForm.property_number.$setDirty();
							vm.itemError=true;
							vm.itemErrorMessage="Please Fill Out the Required Fields";
							return false;
						}
						if(vm.PARItems[i].quantity_subtracted > vm.PARItems[i].quantity){
							vm.itemError=true;
							vm.itemErrorMessage="Some of the Issued Quantities are Larger than Stock Quantity";
							return false;
						}
					}
					AddPARItemsForm.$setPristine();
					AddPARItemsForm.$setUntouched();
					vm.itemError=false;
					vm.itemErrorMessage="";
					return true;
				}

				vm.getAllDRByFC('RAF 101');
				vm.updateTotals();
			};

			//Controller for viewing the property card of an item
			function PARCardCtrl($filter, $route, ItemService, DRService, PARService) {
				var vm = this;

				//Storage of data needed for the property card
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

				//Function for getting all the delivery receipts and PARs of an item under a selected fund cluster
				vm.getAllDRsAndPARsOfFCItem = function(){
					vm.showCard = true;
					ItemService
						.getAllDRsAndPARsOfFCItem(vm.tempItem.id, vm.fund_cluster_name)
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

			//Controller for viewing the yearly report about all the PARs under a selected fund cluster
			function PARReportCtrl($filter, $route, ItemService, DRService, PARService) {
				var vm = this;

				//Storage of data needed for the yearly report
				vm.year = new Date();
				vm.fund_cluster_name = 'RAF 101';
				vm.PARs = [];
				//Boolean variables for ng-show
				vm.validYear = false;
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				//Parameters for smart table
				vm.itemsPerPage = 0;

				//Function for reloading the page
				vm.startOver = function(){
					$route.reload();
				}

				//Function for getting all the PARs under a selected year-month and fund cluster
				vm.getAllPARByFCYear = function(){
					PARService
						.getAllPARByFCYear(vm.fund_cluster_name, vm.year)
						.then(function(data){
							vm.PARs = data;
							vm.PARs.forEach(function(element, i) {
								ItemService
								.getAllItemsByPARID(element.id)
								.then(function(data) {
									element.items = data;
									vm.itemsToDisplay = vm.PARs;
								});
							});
						})
				}

				//Function for checking if the CheckYearForm is valid
				vm.validateCheckYearForm = function(CheckYearForm){
					if(!vm.year){
						CheckYearForm.year.$setDirty();
						vm.error = true;
						vm.errorMessage = "Please Select a Year.";
						return false;
					}
					CheckYearForm.$setPristine();
					CheckYearForm.$setUntouched();
					vm.validYear = true;
					vm.error = false;
					vm.errorMessage = "";
					return true;

				}

			}

			//Controller for transferring PARs
			function PARTransferCtrl($routeParams, $location, PARService) {

				var vm = this;
				//id number of the selected PAR
				vm.par_id = $routeParams.id;
				//Storage of array items data;
				vm.items = [];
				vm.PAR = [];
				vm.newPAR = {};
				vm.person_in_charge = null;
				vm.remarks = null;
				vm.newPAR.person_in_charge = null;
				vm.newPAR.remarks = null;
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				vm.initialize = function(){
					PARService
					.getPAR(vm.par_id)
					.then(function(data){
						vm.PAR = data;
						vm.person_in_charge = vm.PAR[0].person_in_charge;
						vm.remarks = vm.PAR[0].remarks;
						vm.itemsToDisplay = vm.PAR;
					})
				}

				//Function for checking if the TransferForm is valid
				vm.validateTransferForm = function(TransferForm){
					if(!vm.newPAR.person_in_charge){
						TransferForm.new_person_in_charge.$setDirty();
						vm.error = true;
						vm.errorMessage = "Please Input a New Person In Charge.";
						return false;
					}
					if(!vm.newPAR.remarks){
						TransferForm.new_remarks.$setDirty();
						vm.error = true;
						vm.errorMessage = "Please Input a New Remarks.";
						return false;
					}
					TransferForm.$setPristine();
					TransferForm.$setUntouched();
					vm.error = false;
					vm.errorMessage = "";
					return true;
				}

				vm.transferPAR = function(){
					PARService
						.updatePARPIC(vm.par_id, vm.newPAR)
						.then(function(data){
							$location.path('/par/view/');
						})
				}

				vm.initialize();

			}

})();
