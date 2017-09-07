/**
*	PAR Service Module
*	Includes the functions used for adding PAR data and getting PAR data to/from the server
*/
'use strict';

(function(){
	angular
		.module("equipmentInventory")
		.factory("PARService",['$http', '$q', '$filter', PARService]);

		function PARService($http, $q, $filter) {

			var PAR_URL = '/api/PAR';
			var FC_URL = '/api/fc';

			var service = {};
			service.getAllPAR = getAllPAR;
			service.getAllPARByFCYear = getAllPARByFCYear;
			service.getPAR = getPAR;
			service.addPAR = addPAR;
			service.updatePARPIC = updatePARPIC;
			return service;

			//Function for getting all the PARs data from the server
			function getAllPAR() {
				var deferred = $q.defer();

				$http.get(PAR_URL)
				.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting all the PARs data  under a fund cluster and within a year from the server
			function getAllPARByFCYear(fund_cluster_name, year) {
				var deferred = $q.defer();

				$http.get(FC_URL+"/"+fund_cluster_name+"/"+$filter('date')(year,'yyyy-MM-dd')+"/pars")
				.success(function(data){
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

				return deferred.promise;
			}

			//Function for getting a single PAR data from the server
			function getPAR(newDRId) {
				var deferred = $q.defer();
				var PAR_ONE_URL = PAR_URL + "/" + newDRId;

				$http.get(PAR_ONE_URL)
					.success(function(data) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});

					return deferred.promise;
			}

			//Function for adding a new PAR data to the server
			function addPAR(newPAR){
				var deferred = $q.defer();
				$http.post(PAR_URL, newPAR)
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

			//Function for updating a PAR's person_in_charge data to the server
			function updatePARPIC(par_id, newPAR){
				var deferred = $q.defer();
				$http.post(PAR_URL+"/update/"+par_id, newPAR)
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
