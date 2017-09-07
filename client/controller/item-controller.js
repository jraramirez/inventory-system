/**
* Item Controller Module
*
*/
(function(){

'use strict';
		angular
			.module('equipmentInventory')
			.controller('ItemCtrl', ['$location', '$route', 'ItemService', ItemCtrl])
			.controller('AddItemCtrl', ['$location','ItemService', AddItemCtrl]);

			//Controller for viewing all the items
			function ItemCtrl($location, $route, ItemService) {

				var vm = this;

				vm.items = [];
				//Parameters for smart-table
				vm.itemsToDisplay = [];
				vm.itemsPerPage = 0;
				//Boolean variables for showing/hiding elements
				vm.edit = false;

				//Function for getting all the items from server via item service function
				vm.initialize = function() {
					ItemService
						.getAllNotArchivedItems()
						.then(function(data){
							vm.items = data;
							vm.itemsToDisplay = vm.items;
							vm.itemsPerPage = 10;
							vm.items.forEach(function(element, index) {
								element.isEditing = false;
							});
						});
				}

				vm.editItem = function(editID){
					vm.items.forEach(function(element, index) {
						if(element.id == editID){
							element.isEditing = true;
						}
					});
				}

				vm.saveChanges = function(editID){
					vm.items.forEach(function(element, index) {
						if(element.id == editID){
							ItemService
								.updateItem(element, editID)
								.then(function(data){
									element.isEditing = false;
								})
						}
					});
				}

				vm.deleteItem = function(deleteID){
					vm.items.forEach(function(element, index){
						if(element.id == deleteID){
							ItemService
								.archiveItem(element, deleteID)
								.then(function(data){
									$route.reload();
								})
						}
					});
				}

				vm.initialize();

			}

			//Controller for adding a new item
			function AddItemCtrl($location, ItemService) {

				var vm = this;

				//Storage of the new item to be added
				vm.newItem = {};
				vm.newItem.category = 'Common-Use Supplies';
				vm.newItem.isArchived = 0;
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";


				//Function for sending the new item into the server via item service function
				vm.addItem = function(){
					ItemService
						.addItem(vm.newItem)
						.then(function(data){
							vm.newItem = {};
							$location.path('/item/view');
						})
						.catch(function(data){
							vm.error=true;
						});
				};

				//TODO: Use SQL COUNT()
				//Function for counting the items under a category in preparation for the item code of the new item
				vm.getCategoryCount = function(category){
					ItemService
						.countItemsByCategory(category)
						.then(function(data){
							vm.categoryCount = data.count;
							vm.updateItemCode(vm.categoryCount,vm.newItem.category);
						})
						.catch(function(data){
							vm.error=true;
						});
				};
				vm.getCategoryCount(1);

				//Function for creating the item code for the new item
				vm.updateItemCode = function(count,category){
					switch(category){
						case "Common-Use Supplies":
							vm.newItem.item_code = "16CUS";
							break;
						case "Consumables":
							vm.newItem.item_code = "16C";
							break;
						case "Electrical":
							vm.newItem.item_code = "16CES";
							break;
						case "Janitorial":
							vm.newItem.item_code = "16JS";
							break;
						case "Office Device":
							vm.newItem.item_code = "16COD";
							break;
						case "Office Furnitures":
							vm.newItem.item_code = "16COF";
							break;
						case "Office Equipment":
							vm.newItem.item_code = "16COE";
							break;
					}
					vm.newItem.item_code = vm.newItem.item_code+("0000"+(count+1)).slice(-4	);
				}

				//Function for checking if the CheckDRForm is valid.
				vm.validateAddItemForm = function(AddItemForm){
					if(!vm.newItem.description || !vm.newItem.unit){
						if(!vm.newItem.description)
							AddItemForm.description.$setDirty();
						if(!vm.newItem.unit)
							AddItemForm.unit.$setDirty();
						vm.error=true;
						vm.errorMessage="Please Fill Out the Required Fields";
						return false;
					}
					AddItemForm.$setPristine();
					AddItemForm.$setUntouched();
					vm.error=false;
					return true;
				};

			}

})();
