'use strict';
angular.module('softvFrostApp')
	.factory('authFactory', function($http, $q, globalService, $base64, $localStorage, $location, $window, ngNotify) {
		var factory = {};
		var paths = {
			login: '/Usuario/LogOn',
			datosLogueoDelContrato: '/freeAuth/GetDatosLogueo'
		};

		factory.login = function(user, password) {
			var token = $base64.encode(user + ':' + password);
			var deferred = $q.defer();
			var Parametros = {};
			var config = {
				headers: {
					'Authorization': 'Basic ' + token
				}
			};
			$http.post(globalService.getUrl() + paths.login, JSON.stringify(Parametros), config)
				.then(function(response) {
			
					if (response.data.LogOnResult.Token) {
						$localStorage.currentUser = {
							token: response.data.LogOnResult.Token,
							nombre: response.data.LogOnResult.Nombre,
							idRol: response.data.LogOnResult.IdRol,
							idUsuario: response.data.LogOnResult.IdUsuario,
							contrato:response.data.LogOnResult.Contrato,
							login: response.data.LogOnResult.Login,
							menu: response.data.LogOnResult.Menu
						};

						$localStorage.currentPay = {
							userLogueado: 0,
							userModal:0,
							idSession: null,
							logueoAutomatico: 0, //cuando se cerró la sesión pero ya hizo el pago
		                   // password: null,
		                   // userId: null,
		                   //merchantId: null,
		                    successIndicator:null,
		                    clvSessionCobra:null,
		                    resultIndicator:null,
		                    sessionVersion:null,
		                    urlCambiada:null
						};

						$localStorage.merchantData = {
							merchantId: null,
		                    userId: null,
		                    password: null,
		                    merchantName: null,
		                    addressLine1:null,
		                    addressLine2:null,
		                    email:null,
		                    descripcionImporte:null
						};
				
						deferred.resolve(true);

						
					} else {
						deferred.resolve(false);
					}
				})
				.catch(function(response) {
					ngNotify.set('Autenticación inválida, credenciales no válidas.', 'error');
					deferred.reject(response.statusText);
				});
			return deferred.promise;
		};










		factory.datosLogueoDelContrato = function (successIndicator) {		

			var deferred = $q.defer();
			var Parametros = {
				'id': 1,
				'successIndicator': successIndicator
			};				
			
			var config = {
				headers: {
					'Authorization': '123','Unique':'custom'
				}
			};

            
			$http.post(globalService.getUrl() + paths.datosLogueoDelContrato, JSON.stringify(Parametros),config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});
			

			return deferred.promise;
		};


		return factory;
	});
