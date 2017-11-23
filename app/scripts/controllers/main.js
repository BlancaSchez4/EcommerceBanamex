'use strict';

/**
 * @ngdoc function
 * @name softvFrostApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the softvFrostApp
 */
angular.module('softvFrostApp')
	.controller('MainCtrl', function($localStorage, $window, $location, rolFactory) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		this.$onInit = function() {
			if ($localStorage.currentUser) {
				vm.menus = $localStorage.currentUser.menu;
				vm.usuario = $localStorage.currentUser.usuario;
				rolFactory.GetRoleList().then(function(data) {
					data.GetRoleListResult.forEach(function(item) {
						if (item.IdRol === $localStorage.currentUser.idRol) {
							vm.rol = item.Nombre;
						}
					});
				});
			} else {
				$location.path('/auth/login');
			}

		};

		function logOut() {
			delete $localStorage.currentUser;
			$window.location.reload();
		}

		var vm = this;
		vm.logOut = logOut;
	});
