/**
*	Account Controller Module
*
*/
'use strict';

(function(){
		angular
			.module('equipmentInventory')
			.controller('AccountCtrl', ['$location','AccountService',AccountCtrl]);

			function AccountCtrl($location,AccountService) {

				var vm = this;

				//Storage of the account data
				vm.account = {};
				//Parameters for the errors
				vm.error = false;
				vm.errorMessage = "";

				//Function for checking if the account is logged in via account service
				vm.checkLoggedIn = function () {
					return AccountService.getLoggedIn();
				};

				//Function for logging in the account via account service
				vm.login = function () {
				 AccountService
					.login(vm.account.username,vm.account.password)
					.then(function(){
						AccountService.setLoggedIn(true);
						vm.error = false;
						vm.errorMessage = "";
						//redirect to the view page after successfully logging in
						$location.path('/');
						vm.account = {};
					})
					.catch(function(){
						vm.error = true;
						vm.errorMessage = "Invalid username and/or password";
						AccountService.setLoggedIn(false);
						vm.account = {};
					});
				}

				//Function for logging out the account
				vm.logout = function() {
				 AccountService.logout().then(function(){
					 $location.path('/account/login');
					 AccountService.setLoggedIn(false);
					 vm.account = {};
				 });
				}

				//Function for checking if the LoginForm is valid.
				vm.validateLoginForm = function(LoginForm){
					if(!vm.account.username || !vm.account.password){
						if(!vm.account.username)
							LoginForm.username.$setDirty();
						if(!vm.account.password)
							LoginForm.password.$setDirty();
						vm.error=true;
						vm.errorMessage="Please Fill Out the Required Fields";
						return false;
					}
					else{
						LoginForm.$setPristine();
						LoginForm.$setUntouched();
						vm.error=false;
						return true;
					}
				};

		 }
})();
