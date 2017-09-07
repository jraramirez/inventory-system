/**
*	ICS Service Module
*	Includes the functions used for adding ICS data and getting ICS data to/from the server
*/
'use strict';

(function(){
	angular
		.module("equipmentInventory")
		.factory("ICSService",['$http', '$q', '$filter', ICSService]);

		function ICSService($http, $q, $filter) {

			var ICS_URL = '/api/ics';
			var FC_URL = '/api/fc';

			var service = {};
			service.getAllICS = getAllICS;
			service.getAllICSByFCMonth = getAllICSByFCMonth;
			service.getICS = getICS;
			service.addICS = addICS;
			return service;

			//Function for getting all the ICSs data from the server
			function getAllICS() {
				var deferred = $q.defer();

				$http.get(ICS_URL)
				.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the ICSs data  under a fund cluster and within a year-month from the server
			function getAllICSByFCMonth(fund_cluster_name, startMonth, endMonth) {
				var deferred = $q.defer();

				$http.get(FC_URL+"/"+fund_cluster_name+"/"+$filter('date')(startMonth,'yyyy-MM-dd')+"/"+$filter('date')(endMonth,'yyyy-MM-dd')+"/icss")
				.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting a single ICS data from the server
			function getICS(newDRId) {
				var deferred = $q.defer();
				var ICS_ONE_URL = ICS_URL + "/" + newDRId;

				$http.get(ICS_ONE_URL)
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

					return deferred.promise;
			}

			//Function for adding a new ICS data to the server
			function addICS(newICS){
				var deferred = $q.defer();
				$http.post(ICS_URL, newICS)
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
