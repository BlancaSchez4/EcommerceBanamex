'use strict';

/**
 * @ngdoc overview
 * @name softvFrostApp
 * @description
 * # softvFrostApp
 *
 * Main module of the application.
 */
angular.module('softvFrostApp', [	
		'smart-table',
		'ngSanitize', 
		'ngCsv', 
		'ngTableToCsv',	
		'ngAnimate',
		'ngSanitize',
		'ngNotify',
		'angularValidator',
		'ngStorage',
		'base64',
		'ui.router',
		'angularUtils.directives.dirPagination',
		'ngStorage',
		'ui.bootstrap',
		'blockUI',
		'ngMap',
		'permission', 'permission.ui',
		'ui.mask','ngCsv','fixed.table.header'


	])
	.config(['$provide', '$urlRouterProvider', '$httpProvider', '$qProvider','blockUIConfig', function($provide, $urlRouterProvider, $httpProvider, $qProvider,blockUIConfig) {
		$qProvider.errorOnUnhandledRejections(false);
		
		$urlRouterProvider.otherwise('/auth/login');
		blockUIConfig.templateUrl = 'views/loading.html';
		
		$provide.factory('ErrorHttpInterceptor', function($q, $injector,$localStorage, $location) {
			function notifyError(rejection) {
				var notify = $injector.get('ngNotify');
				if (rejection.data === 'Acceso no autorizado, favor de validar autenticación') {
					delete $localStorage.currentUser;
					notify.set('Acceso no autorizado, por favor inicia sesión nuevamente.', {
						type: 'error',
						duration: 4000
					});
					$location.path('/auth/');
					return;
				}
				var content = '¡Se ha generado un error! \n' + rejection.data;
				notify.set(content, {
					type: 'error',
					duration: 4000
				});
			}
			return {
				requestError: function(rejection) {
					notifyError(rejection);
					return $q.reject(rejection);
				},
				responseError: function(rejection) {
					notifyError(rejection);
					return $q.reject(rejection);
				}
			};
		});
		$httpProvider.interceptors.push('ErrorHttpInterceptor');
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}])
	.constant('APP_CONFIG', window.appConfig)
	.run(['$rootScope', '$state', '$stateParams', '$localStorage', '$location', 'permissionsFactory', 'PermPermissionStore', function($rootScope, $state, $stateParams, $localStorage, $location, permissionsFactory, PermPermissionStore) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		if ($localStorage.currentUser) {
			//$location.path('/auth/login');
			var permissions = permissionsFactory.on();
			PermPermissionStore.definePermission('anonymous', function() {
				return false;
			});
			PermPermissionStore.defineManyPermissions(permissions, function() {
				return true;
			});
		} else {
			$location.path('/auth/login');
			PermPermissionStore.definePermission('anonymous', function() {
				return true;
			});
		}

	}]);
