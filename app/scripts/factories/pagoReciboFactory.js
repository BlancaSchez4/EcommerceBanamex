'use strict';
angular.module('softvFrostApp')
	.factory('pagoReciboFactory', function($http, $q,  $base64, $window, globalService, $localStorage) {
		
		var factory = {};		
		var paths = {  					
			datosMerchant: '/Banamex/GetDatosMerchant',
			banamexRetrieve: '/Banamex/GetRetrieve',					
			guardaPagoEnLinea: '/Banamex/GetGuardaPagoEnLinea',
			guardaReturnData: '/Banamex/GetGuarda_ReturnData',
			getIdSessionTransaccion: '/Banamex/GetIdSessionTransaccion'
		};


		factory.getIdSessionTransaccion = function ( contrato, resultIndicator) {
			
			var deferred = $q.defer();
			var Parametros = {
				'contrato': contrato,
				'resultIndicator': resultIndicator
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.getIdSessionTransaccion, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};






	    factory.datosMerchant = function () {
	      var deferred = $q.defer();
	      var config = {
	        headers: {
	          'Authorization': $localStorage.currentUser.token
	        }
	      };
	      $http.get(globalService.getUrl() + paths.datosMerchant, config).then(function (response) {
	        deferred.resolve(response.data);
	      }).catch(function (data) {
	        deferred.reject(data);
	      });
	      return deferred.promise;
	    };

	

		factory.banamexRetrieve = function (password, userid, sessionId, merchantId) {
		
			var token = $base64.encode(userid + ':' + password);

			var deferred = $q.defer();
			var Parametros = {
				'idInt':1234,
				'sessionId' : sessionId,
				'merchantId' : merchantId,
				'token': token				
	            //,'returnUrl':  'http://localhost:9000/#!/home/pagoEnLinea/pago'                 
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.banamexRetrieve, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		



		factory.guardaPagoEnLinea = function ( idSessionCobra, contrato) {
			
			var deferred = $q.defer();
			var Parametros = {
				'clv_Session': idSessionCobra,
				'contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.guardaPagoEnLinea, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};


		factory.guardaReturnData = function (clvSession, retrieveData, resultIndicator ) {			
			
			var deferred = $q.defer();
			var Parametros = {
				'clv_Session': clvSession,
				'retrieveData': retrieveData,
				'resultIndicator':resultIndicator
			};			
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.guardaReturnData, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};











		return factory;

	});