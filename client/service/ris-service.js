/**
*	RIS Service Module
*	Includes the functions used for adding RIS data and getting RIS data to/from the server
*/
'use strict';

(function(){
	angular
		.module("equipmentInventory")
		.factory("RISService",['$http', '$q', '$filter', RISService]);

		function RISService($http, $q, $filter) {

			var RIS_URL = '/api/ris';
			var FC_URL = '/api/fc';

			var service = {};
			service.getAllRIS = getAllRIS;
			service.getAllRISByFCMonth = getAllRISByFCMonth;
			service.getRIS = getRIS;
			service.addRIS = addRIS;
			return service;

			//Function for getting all the RISs data from the server
			function getAllRIS() {
				var deferred = $q.defer();

				$http.get(RIS_URL)
				.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the RISs data  under a fund cluster and within a year-month from the server
			function getAllRISByFCMonth(fund_cluster_name, date) {
				var deferred = $q.defer();

				$http.get(FC_URL+"/"+fund_cluster_name+"/"+$filter('date')(date,'yyyy-MM-dd')+"/riss")
				.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting a single RIS data from the server
			function getRIS(newDRId) {
				var deferred = $q.defer();
				var RIS_ONE_URL = RIS_URL + "/" + newDRId;

				$http.get(RIS_ONE_URL)
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

					return deferred.promise;
			}

			//Function for adding a new RIS data to the server
			function addRIS(newRIS){
				var deferred = $q.defer();
				$http.post(RIS_URL, newRIS)
					.success(function(data,status){
						if(data.success)
							deferred.resolve(data);
						else
							deferred.reject(data);
					})
					.error(function(data,status){
						deferred.reject(data);
					});
				return deferred.promise;
			}
		}
})();
