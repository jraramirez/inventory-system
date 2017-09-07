/**
*	Fund Cluster Service Module
*	Includes the functions used for adding fund clusters data and getting fund clusters data to/from the server
*/
'use strict';

(function(){
	angular
		.module("equipmentInventory")
		.factory("FCService",['$http', '$q', FCService]);

		function FCService($http, $q) {

			var FC_URL = '/api/fc';

			var service = {};
			service.getAllFC = getAllFC;
			service.getFC = getFC;
			service.getAllDRByFC = getAllDRByFC;
			service.updateFC = updateFC;
			return service;

			//Function for getting all the fund clusters data from the server
			function getAllFC() {
				var deferred = $q.defer();

				$http.get(FC_URL)
				.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting a single fund cluster data from the server
			function getFC(fund_cluster_name) {
				var deferred = $q.defer();
				var FC_ONE_URL = FC_URL + "/" + fund_cluster_name;

				$http.get(FC_ONE_URL)
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

					return deferred.promise;
			}

			//Function for getting all the delivery reports data from the server
			function getAllDRByFC(fund_cluster_name) {
				var deferred = $q.defer();

				$http.get(FC_URL+"/"+fund_cluster_name+"/delivery_receipts")
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(data,status) {
					deferred.reject(status);
				});

				return deferred.promise;
			}

			//Function for updating the fund cluster data in the server whenever a new delivery receipt or RIS or ICS or PAR is added
			function updateFC(newDR) {
				var deferred = $q.defer();
				var encoded_fund_cluster_name = encodeURIComponent(newDR.delivery_receipt_fund_cluster_name);
				$http.post(FC_URL+"/update/"+encoded_fund_cluster_name, newDR)
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
