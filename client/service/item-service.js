/**
*	Item Service Module
*	Includes the functions used for adding items data and getting items data to/from the server
*/
'use strict';

(function(){
	angular
		.module("equipmentInventory")
		.factory("ItemService",['$http', '$q', ItemService]);

		function ItemService($http, $q) {

			var DR_URL = '/api/dr';
			var FC_URL = '/api/fc';
			var RIS_URL = '/api/ris';
			var ICS_URL = '/api/ics';
			var PAR_URL = '/api/par';
			var ITEM_URL = '/api/items';

			var service = {};
			service.getAllDRsAndRISsOfFCItem = getAllDRsAndRISsOfFCItem;
			service.getAllDRsAndPARsOfFCItem = getAllDRsAndPARsOfFCItem;
			service.getAllItemsByDRID = getAllItemsByDRID;
			service.getAllItemsByRISID = getAllItemsByRISID;
			service.getAllItemsByICSID = getAllItemsByICSID;
			service.getAllItemsByPARID = getAllItemsByPARID;
			service.addItemToDR = addItemToDR;
			service.addItemsToDR = addItemsToDR;
			service.addItemToFC = addItemToFC;
			service.addItemsToFC = addItemsToFC;
			service.updateFCItem = updateFCItem;
			service.getFCItem = getFCItem;
			service.getFCItems = getFCItems;
			service.addItemToRIS = addItemToRIS;
			service.addItemsToRIS = addItemsToRIS;
			service.addItemToICS = addItemToICS;
			service.addItemsToICS = addItemsToICS;
			service.addItemToPAR = addItemToPAR;
			service.addItemsToPAR = addItemsToPAR;
			service.updatePARItem = updatePARItem;
			service.getItemByID = getItemByID;
			service.getAllItems = getAllItems;
			service.getAllNotArchivedItems = getAllNotArchivedItems;
			service.addItem = addItem;
			service.updateItem = updateItem;
			service.archiveItem = archiveItem;
			service.getAllItemsByCategory = getAllItemsByCategory;
			service.countItemsByCategory = countItemsByCategory;
			return service;

			//Function for getting all the delivery receipts and RISs data by item and fund cluster from the server
			function getAllDRsAndRISsOfFCItem(item_id, fund_cluster_name) {
				var deferred = $q.defer();

				$http.get(ITEM_URL+"/"+item_id+"/"+fund_cluster_name+"/drriss")
				.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the delivery receipts and PARs data by item and fund cluster from the server
			function getAllDRsAndPARsOfFCItem(item_id, fund_cluster_name) {
				var deferred = $q.defer();

				$http.get(ITEM_URL+"/"+item_id+"/"+fund_cluster_name+"/drpars")
				.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the items data by a delivery receipt id from the server
			function getAllItemsByDRID(id) {
				var deferred = $q.defer();

				var ITEMS_URL = DR_URL+"/"+id+"/items";
				$http.get(ITEMS_URL)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the items data by a requisition issue slip id from the server
			function getAllItemsByRISID(id) {
				var deferred = $q.defer();

				var ITEMS_URL = RIS_URL+"/"+id+"/items";
				$http.get(ITEMS_URL)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the items data by a inventory custodian slip id from the server
			function getAllItemsByICSID(id) {
				var deferred = $q.defer();

				var ITEMS_URL = ICS_URL+"/"+id+"/items";
				$http.get(ITEMS_URL)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the items data by a inventory custodian slip id from the server
			function getAllItemsByPARID(id) {
				var deferred = $q.defer();

				var ITEMS_URL = PAR_URL+"/"+id+"/items";
				$http.get(ITEMS_URL)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for adding a delivery receipt item to the server
			function addItemToDR(dr_id, newItemToDR){
				var deferred = $q.defer();

				var ITEMS_URL = DR_URL+"/"+dr_id+"/items";
				$http.post(ITEMS_URL,newItemToDR)
					.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

					return deferred.promise;
			}

			//Function for adding all the delivery receipt items  to the server by calling the addItemToDR for each item
			function addItemsToDR(dr_id, items){
				var promises = [];
				items.forEach(function(element, index) {
					if(element.quantity !== 0) {
						promises.push(
							addItemToDR(dr_id,element)
								.then(function(data) {
								})
								.catch(function(data) {
								})
						);
					}
				});

				return $q.all(promises);
			}

			//Function for getting all the items data by a fund cluster name from the server
			function getFCItems(fund_cluster_name) {
				var deferred = $q.defer();

				var ITEMS_URL = FC_URL+"/"+fund_cluster_name+"/items";
				$http.get(ITEMS_URL)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(data,status) {
					deferred.reject(status);
				});

				return deferred.promise;
			}

			//Function for getting a single fund cluster data from the server
			function getFCItem(fund_cluster_name,item_id) {
				var deferred = $q.defer();
				var FC_ONE_URL = FC_URL +"/"+fund_cluster_name+"/"+item_id;

				$http.get(FC_ONE_URL)
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

					return deferred.promise;
			}

			//Function for updating a fund cluster item from the server
			function updateFCItem(fund_cluster_name, item) {
				var deferred = $q.defer();
				$http.post(FC_URL+"/update/"+fund_cluster_name+"/"+item.id, item)
					.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for adding a fund cluster item to the server
			function addItemToFC(fund_cluster_name, newItemToFC){
				var deferred = $q.defer();

				var ITEMS_URL = FC_URL+"/"+fund_cluster_name+"/"+newItemToFC.id;
				$http.post(ITEMS_URL,newItemToFC)
					.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

					return deferred.promise;
			}

			//Function for adding/updating all the delivery receipt items to the fund cluster to the server by calling the addItemToFC or updateFCItem for each item
			function addItemsToFC(fund_cluster_name, items){
				var promises = [];
				items.forEach(function(element, index) {
					getFCItem(fund_cluster_name, element.id)
					.then(function(data){
						if(data.length == 0){
							addItemToFC(fund_cluster_name, element)
							.then(function(data){

							})
						}
						else{
							updateFCItem(fund_cluster_name, element)
							.then(function(data){

							})
						}
					})
				});

				return $q.all(promises);
			}

			//Function for adding a RIS item to the server
			function addItemToRIS(id, newItemToRIS){
				var deferred = $q.defer();
				var ITEMS_URL = RIS_URL+"/"+id+"/items";
				$http.post(ITEMS_URL, newItemToRIS)
					.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

					return deferred.promise;
			}

			//Function for adding all the RIS items  to the server by calling the addItemToRIS for each item
			function addItemsToRIS(id, RISItems){
				var promises = [];
				RISItems.forEach(function(element, index) {
					if(element.quantity_subtracted > 0) {
						promises.push(
							addItemToRIS(id, element)
								.then(function(data) {
								})
								.catch(function(data) {
								})

						);
					}
				});

				return $q.all(promises);
			}

			//Function for adding a ICS item to the server
			function addItemToICS(id, newItemToICS){
				var deferred = $q.defer();
				var ITEMS_URL = ICS_URL+"/"+id+"/items";
				$http.post(ITEMS_URL, newItemToICS)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(data,status) {
					deferred.reject(status);
				});

				return deferred.promise;
			}

			//Function for adding all the ICS items  to the server by calling the addItemToICS for each item
			function addItemsToICS(id, ICSItems){
				var promises = [];
				ICSItems.forEach(function(element, index) {
					if(element.quantity_subtracted > 0) {
						promises.push(
							addItemToICS(id, element)
							.then(function(data) {
							})
							.catch(function(data) {
							})

						);
					}
				});

				return $q.all(promises);
			}

			//Function for adding a PAR item to the server
			function addItemToPAR(id, newItemToPAR){
				var deferred = $q.defer();
				var ITEMS_URL = PAR_URL+"/"+id+"/items";
				$http.post(ITEMS_URL, newItemToPAR)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(data,status) {
					deferred.reject(status);
				});

				return deferred.promise;
			}

			//Function for adding all the PAR items  to the server by calling the addItemToPAR for each item
			function addItemsToPAR(id, PARItems){
				var promises = [];
				PARItems.forEach(function(element, index) {
					if(element.quantity_subtracted > 0) {
						promises.push(
							addItemToPAR(id, element)
							.then(function(data) {

							})
							.catch(function(data) {

							})

						);
					}
				});

				return $q.all(promises);
			}

			//Function for updating a fund cluster item from the server
			function updatePARItem(par_id, item_id, PARItem) {
				var deferred = $q.defer();
				$http.post(PAR_URL+"/update/"+par_id+"/"+item_id, PARItem)
					.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting an item data from the server
			function getItemByID(id) {
				var deferred = $q.defer();

				var ITEMS_URL = ITEM_URL+"/"+id;
				$http.get(ITEMS_URL)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the items data from the server
			function getAllItems() {
				var deferred = $q.defer();

				$http.get(ITEM_URL)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the not archived items data from the server
			function getAllNotArchivedItems() {
				var deferred = $q.defer();

				$http.get(ITEM_URL+"/not-archived")
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for adding the item data to the server
			function addItem(newItem) {
				var deferred = $q.defer();

				$http.post(ITEM_URL, newItem)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for updating the item data to the server
			function updateItem(item, id) {
				var deferred = $q.defer();

				$http.post(ITEM_URL+"/update/"+id, item)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for archiving the item to the server
			function archiveItem(item, id) {
				var deferred = $q.defer();

				$http.post(ITEM_URL+"/archive/"+id, item)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the items under a selected category from the server
			function getAllItemsByCategory(category) {
				var deferred = $q.defer();

				var ITEMS_URL = ITEM_URL+"/category/"+category;
				$http.get(ITEMS_URL)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for counting the items under a category from the server
			function countItemsByCategory(category) {
				var deferred = $q.defer();

				var ITEMS_URL = ITEM_URL+"/category/count/"+category;
				$http.get(ITEMS_URL)
					.success(function(data){
							deferred.resolve(data);
					})
					.error(function(data,status) {
							deferred.reject(status);
					});

				return deferred.promise;
			}

		}
})();
