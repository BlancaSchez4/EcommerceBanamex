'use strict';
angular.module('softvFrostApp').config(function ($stateProvider) {
	var states = [{
		name: 'home.provision',
		abstract: true,
		template: '<div ui-view></div>'
	},	
	{
		name: 'home.provision.usuarios',
		data: {
			pageTitle: 'STAR.GO | USUARIOS',
			permissions: {
				only: ['usuariosSelect'],
				options: {
					reload: true
				}
			}
		},
		url: '/provision/usuarios',
		templateUrl: 'views/configuracion/usuarios.html',
		controller: 'UsuariosCtrl',
		controllerAs: '$ctrl'
	},
	{
		name: 'home.provision.permisos',
		data: {
			pageTitle: 'STAR.GO | PERMISOS',
			permissions: {
				only: ['permisosSelect'],
				options: {
					reload: true
				}
			}
		},
		url: '/provision/permisos',
		templateUrl: 'views/configuracion/permisos.html',
		controller: 'PermisosCtrl',
		controllerAs: '$ctrl'
	}	
	];

	states.forEach(function (state) {
		$stateProvider.state(state);
	});
});
