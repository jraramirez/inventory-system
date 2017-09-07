/**
*	Account Service Module
*	Includes the functions used for logging in and out of accounts
*/
'use strict';

(function(){
	angular
		.module("equipmentInventory")
		.factory("AccountService",['$http', '$q', AccountService]);

		function AccountService($http, $q) {

			var ACCOUNT_URL = '/api/accounts';

			var loggedIn = false;

			var service = {};
			service.login = login;
			service.isLoggedIn = isLoggedIn;
			service.logout = logout;
			service.getLoggedIn = getLoggedIn;
			service.setLoggedIn = setLoggedIn;
			return service;

			//Function for getting the log in status
			function getLoggedIn() {
				return loggedIn;
			}

			//Function for setting the log in status
			function setLoggedIn(value) {
				loggedIn = value;
			}

			//Function for logging in the account
			function login(username,password) {
				var userJSON = {};
				userJSON.username = username;
				userJSON.password = password;

				var deferred = $q.defer();

				$http.post(ACCOUNT_URL+"/login",userJSON)
					.success(function(data,status){
							if(data.success)
								deferred.resolve(data);
							else
								deferred.reject(data);
					})
					.error(function(data,status) {
							deferred.reject(data);
					});

				return deferred.promise;
			}

			//Function for checking if an account is logged in
			function isLoggedIn() {
				var deferred = $q.defer();

				$http.get(ACCOUNT_URL+"/check")
				.success(function(data){
					if(data.success) {
						loggedIn = true;
						deferred.resolve(data);
					}
					else {
						loggedIn = false;
						deferred.reject(data);
					}
				});

				return deferred.promise;
			}

			//Function for logging out the account
			function logout() {
				var deferred = $q.defer();

				$http.get(ACCOUNT_URL+"/logout")
					.success(function(data){
						if(data.success) {
							deferred.resolve(data);
						}
						else
							deferred.reject(data);
					});

				return deferred.promise;
			}
		}
})();
