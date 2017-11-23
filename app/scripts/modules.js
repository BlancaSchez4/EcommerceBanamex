'use strict';
angular.module('softvFrostApp')
	.config(function ($stateProvider) {
		var states = [{
			name: 'home',
			data: {
				pageTitle: 'BIENVENIDO | STAR.GO',
				permissions: {
					except: ['anonymous'],
					options: {
						reload: true
					}
				}
			},
			url: '/home',
			views: {
				'homeview': {
					templateUrl: 'views/main.html',
					controller: 'MainCtrl',
					controllerAs: '$ctrl'
				}
			},
		},
		/*
		{
			name: 'home.dashboard',
			data: {
				pageTitle: 'BIENVENIDO | STAR.GO',
				permissions: {
					except: ['anonymous'],
					options: {
						reload: true
					}
				}
			},
			url: '/dashboard',
			templateUrl: 'views/dashboard.html'
		},*/
		{
			name: 'login',
			url: '/auth/login?esn',
			data: {
				pageTitle: 'BIENVENIDO | STAR.GO'
			},
			views: {
				'loginview': {
					templateUrl: 'views/login/login.html',
					controller: 'LoginCtrl',
					controllerAs: '$ctrl'
				}
			},
		},
		{
			name: 'home.cancelado',
			data: {
				pageTitle: 'CANCELADO | STAR.GO',
				permissions: {
					except: ['anonymous'],
					options: {
						reload: true
					}
				}
			},
			url: '/cancelado',
			templateUrl: 'views/cancelado.html',
			controller: 'PagoCanceladoCtrl',
			controllerAs: '$ctrl'
		},
		{
			name: 'home.recibo',
			data: {
				pageTitle: 'RECIBO | STAR.GO',
				permissions: {
					except: ['anonymous'],
					options: {
						reload: true
					}
				}
			},
			url: '/recibo',
			templateUrl: 'views/recibo.html',
			controller: 'PagoReciboCtrl',
			controllerAs: '$ctrl'
		},
		];

		states.forEach(function (state) {
			$stateProvider.state(state);
		});
	});
