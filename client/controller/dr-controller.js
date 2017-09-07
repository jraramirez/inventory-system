/**
*	Delivery Receipt Controller Module
*
*/
(function(){

'use strict';

		angular
			.module('equipmentInventory')
			.controller('AddDRCtrl', ['$filter','$location','$route', 'DRService','FCService','ItemService', AddDRCtrl])
			.controller('DRCtrl', ['$filter','$location','DRService', DRCtrl])
			.controller('ItemByDRCtrl', ['ItemService', '$routeParams', ItemByDRCtrl]);

			//Controller for adding a new delivery receipt
			function AddDRCtrl($filter, $location, $route, DRService, FCService, ItemService) {

				var vm = this;

				//Storage of the new delivery receipt to be added
				vm.newDR = {};
				vm.newDR.fund_cluster_name = "RAF 101";
				//Initialize the totals to zero at the start where no items are added yet.
				vm.newDR.total_quantity = 0;
				vm.newDR.total_amount = 0;
				//Storage of the new delivery receipt's items to be added
				vm.newDRItems = [];
				vm.count = 0;
				vm.newItem = {};
				vm.newTempItem = null;
				//Storage of all the items that can be added into the delivery receipt
				vm.items = [];
				//Parameters for the errors
				vm.DRError = false;
				vm.DRErrorMessage = "";
				vm.error = false;
				vm.errorMessage = "";
				vm.ItemError = false;
				vm.ItemErrorMessage = "";
				//Boolean variables used for ng-show
				vm.validDR = false;
				vm.addingNewItem = false;
				//Parameters for smart-table
				vm.newDRItemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for reloading the page
				vm.startOver = function(){
					$route.reload();
				}

				//Function for hiding/showing the form for adding an item or the form for adding the delivery receipt
				vm.toggleAddingNewItem = function(){
					vm.addingNewItem = !vm.addingNewItem;
				}

				//Function for deleting a delivery receipt item that will be added
				vm.removeEntry = function(id){
					vm.newDRItems.forEach(function(element, index) {
						if(element.id === id)
							vm.newDRItems.splice(index, 1);
					});
				}

				//Function for checking if the new delivery receipt is already in the server via delivery receipt service function
				vm.checkDR = function(){
					DRService
					.getDR(vm.newDR.id)
					.then(function(data) {
						if(data.length == 0) {
							vm.validDR = true;
							vm.error = false;
							ItemService
								.getAllItems()
								.then(function(data){
									vm.items = data;
								});
						}
						else {
							vm.validDR = false;
							vm.error = true;
							vm.errorMessage="Duplicate Delivery Receipt Number";
						}
					});
					return true;
				};

				//Funcion for adding the selected item to the new delivery receipt items JSON
				vm.pushNewDRItem = function(){
					vm.newItem.id = vm.newTempItem.id;
					vm.newItem.category = vm.newTempItem.category;
					vm.newItem.description = vm.newTempItem.description;
					vm.newItem.item_code = vm.newTempItem.item_code;
					vm.newItem.unit = vm.newTempItem.unit;
					vm.newItem.amount = vm.newItem.quantity_added * vm.newItem.price;
					vm.newDRItems.push(vm.newItem);
					vm.count = vm.count+1;
					vm.updateTotals();
					vm.toggleAddingNewItem();
					vm.DRError=false;
					vm.DRErrorMessage="";
					vm.newItem = {};
					vm.newTempItem = null;
					return true;
				}

				//Function for updating the totals whenever a new item is added to the delivery receipt items JSON
				vm.updateTotals = function(id){
					var i;
					vm.newDR.total_quantity = 0;
					vm.newDR.total_amount = 0;
					for(i=0;i<vm.newDRItems.length;i++){
						if(vm.newDRItems[i].quantity_added >= 0 && vm.newDRItems[i].price >= 0){
							vm.newDRItems[i].amount = vm.newDRItems[i].quantity_added*vm.newDRItems[i].price;
							vm.newDR.total_quantity =  vm.newDR.total_quantity + parseInt(vm.newDRItems[i].quantity_added);
							vm.newDR.total_amount = vm.newDR.total_amount + vm.newDRItems[i].amount;
						}
					}
				};

				//Function for sending the new delivery receipt into the server via delivery receipt service function
				vm.addDR = function(){

					if(vm.newDRItems.length === 0){
						vm.DRError=true;
						vm.DRErrorMessage="At Least One Item Must be Addded to the Delivery Receipt";
					}
					else{
						//format date before sending to service
						vm.newDR.date_added = $filter('date')(vm.newDR.date_added,'yyyy-MM-dd');

						DRService
						.addDR(vm.newDR)
						.then(function(data){
							//call function for adding delivery receipt items into the server
							ItemService
								.addItemsToDR(vm.newDR.id,vm.newDRItems)
								.then(function(data){
									var i;
									for(i=0;i<vm.newDRItems.length;i++){
										vm.newDRItems[i].quantity = vm.newDRItems[i].quantity_added;
									}
									ItemService
										.addItemsToFC(vm.newDR.fund_cluster_name, vm.newDRItems)
										.then(function(data){
											vm.newDR.delivery_receipt_fund_cluster_name = vm.newDR.fund_cluster_name;
											FCService
												.updateFC(vm.newDR)
												.then(function(data){
													$location.path('/dr/view/'+vm.newDR.id+'/items');
													vm.newDR = {};
													vm.newDRItems = [];
												})
										})
								})
						})
						.catch(function(data){
							vm.error=true;
							vm.errorMessage=data.errorMessage;
						});
					}
				};

				//Function for checking if the CheckDRForm is valid.
				vm.validateCheckDRForm = function(CheckDRForm){
					if(!vm.newDR.id || !vm.newDR.fund_cluster_name || !vm.newDR.date_added){
						if(!vm.newDR.id)
							CheckDRForm.id.$setDirty();
						if(!vm.newDR.fund_cluster_name)
							CheckDRForm.fund_cluster_name.$setDirty();
						if(!vm.newDR.date_added)
							CheckDRForm.date_added.$setDirty();
						vm.error=true;
						vm.errorMessage="Please Fill Out the Required Fields";
						return false;
					}
					else{
						CheckDRForm.$setPristine();
						CheckDRForm.$setUntouched();
						vm.error=false;
						return true;
					}
				};

				//Function for checking if the AddItemForm is valid. This function also checks if the item added is a duplicate.
				vm.validateAddItemForm = function(AddItemForm){
					if(!(vm.newTempItem) || !(vm.newItem.quantity_added >=0) || !(vm.newItem.price >=0 )){
						if(!(vm.newTempItem))
							AddItemForm.description.$setDirty();
						if(!(vm.newItem.quantity_added >=0 ))
							AddItemForm.quantity_added.$setDirty();
						if(!(vm.newItem.price >=0 ))
							AddItemForm.price.$setDirty();
						vm.ItemError=true;
						vm.ItemErrorMessage="Please Fill Out the Required Fields";
						return false;
					}
					var i;
					for(i=0;i<vm.newDRItems.length;i++)
						if(vm.newDRItems[i].id == vm.newTempItem.id){
							vm.ItemError=true;
							vm.ItemErrorMessage="You Have Already Added This Item to the Delivery Receipt. Select a Different Item.";
							return false;
						}
					AddItemForm.$setPristine();
					AddItemForm.$setUntouched();
					vm.ItemError=false;
					vm.ItemErrorMessage="";
					return true;
				}

			}

			//Controller for viewing all the delivery receipts
			function DRCtrl($filter, $location, DRService) {

				var vm = this;

				//Storage of array delivery receipts
				vm.drs = [];
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//function for getting all the delivery receipts data from server via delivery receipt service function
				vm.initialize = function() {
					DRService
					.getAllDR()
					.then(function(data) {
						vm.drs = data;
						vm.itemsToDisplay = vm.drs;
						vm.itemsPerPage = 10;
					});

				}
				vm.initialize();

			}

			//Controller for viewing all the items under a delivery receipt
			function ItemByDRCtrl(ItemService, $routeParams) {

				var vm = this;
				//id number of the selected delivery receipt
				vm.id = $routeParams.id;

				//Storage of array items data;
				vm.items = [];
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;

				//Function for getting all the items data by delivery receipt id from server via item service function
				vm.initialize = function(id) {
					ItemService
						.getAllItemsByDRID(id)
						.then(function(data) {
							vm.items = data;
						});

					//Parameters for smart-table
					vm.itemsToDisplay = vm.items;
					vm.itemsPerPage = 10;
				}
				vm.initialize(vm.id);

			}

})();
