/**
*	DR Service Module
*	Includes the functions used for adding delivery receipts data and getting delivery receipts data to/from the server
*/
'use strict';

(function(){
	angular
		.module("equipmentInventory")
		.factory("DRService",['$http', '$q', DRService]);

		function DRService($http, $q) {

			var DR_URL = '/api/dr';

			var service = {};
			service.getAllDR = getAllDR;
			service.getDR = getDR;
			service.addDR = addDR;
			return service;

			//Function for getting all the delivery receipts data from the server
			function getAllDR() {
				var deferred = $q.defer();

				$http.get(DR_URL)
				.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting a single delivery report data from the server
			function getDR(newDRId) {
				var deferred = $q.defer();
				var RERORT_ONE_URL = DR_URL + "/" + newDRId;

				$http.get(RERORT_ONE_URL)
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

					return deferred.promise;
			}

			//Function for adding a new delivery report data to the server
			function addDR(newDR){
				var deferred = $q.defer();
				$http.post(DR_URL, newDR)
					.success(function(data,status){
						if(data.success){
							deferred.resolve(data);
						}
						else{
							deferred.reject(data);
						}
					})
					.error(function(data,status){
						deferred.reject(data);
					});
				return deferred.promise;
			}

		}
})();
