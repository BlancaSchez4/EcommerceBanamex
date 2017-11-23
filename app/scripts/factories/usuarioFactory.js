'use strict';
angular.module('softvFrostApp')
	.factory('usuarioFactory', function ($http, $q, $window, globalService, $localStorage) {
		var factory = {};
		var paths = {
			getUsuarioList: '/Usuario/GetUsuarioList',
			GetUserDetail: '/Usuario/GetUserListbyIdUser',
			AddUsuario: '/Usuario/AddUsuario',
			UpdateUsuario: '/Usuario/UpdateUsuario',
			BuscaUsuario: '/Usuario/GetUsuario2List',
			existeUsuario: '/Usuario/GetExisteUser'
		};

		factory.existeUsuario = function (usuario) {
			var deferred = $q.defer();
			var Parametros = {
				'Usuario2': usuario,
				'Op':0
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.existeUsuario, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		factory.getUsuarioList = function () {
			var deferred = $q.defer();
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.get(globalService.getUrl() + paths.getUsuarioList, config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		factory.GetUserDetail = function (id) {
			var deferred = $q.defer();
			var Parametros = {
				'IdUsuario': id
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.GetUserDetail, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;

		};

		factory.AddUsuario = function (object) {
			var deferred = $q.defer();
			var Parametros = {

				'objUsuario': {
					'IdRol': object.IdRol,
					'Nombre': object.Nombre,
					'Email': object.Email,
					'Usuario': object.Usuario,
					'Password': object.Password
				}
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.AddUsuario, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;

		};
		factory.UpdateUsuario = function (object) {
			var deferred = $q.defer();
			var Parametros = {

				'objUsuario': {
					'IdUsuario': object.IdUsuario,
					'IdRol': object.IdRol,
					'Nombre': object.Nombre,
					'Email': object.Email,
					'Usuario': object.Usuario,
					'Password': object.Password
				}
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.UpdateUsuario, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;

		};

		factory.BuscaUsuario = function (obj) {
			var deferred = $q.defer();
			var Parametros = {
				'Nombre': obj.Nombre,
				'Contrato': obj.Contrato,
				'Usuario2': obj.Usuario2,
				'Op': obj.Op,
				'IdRol': obj.IdRol
			};
		
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.BuscaUsuario, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;

		};


		return factory;
	});
