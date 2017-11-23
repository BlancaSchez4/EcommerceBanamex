'use strict';
angular.module('softvFrostApp')
  .factory('rolFactory', function ($http, $q, $window, globalService, $localStorage) {
    var factory = {};
    var paths = {
      GetRoleList: '/Role/GetRoleList',
      AddRole: '/Role/AddRole',
      UpdateRole: '/Role/UpdateRole',
      GetRoleCommands: '/Role/GetRoleCommands',
      GetComandos: '/Role/GetComandos',
      GetRoleById:'/Role/GetRoleById'
    };

    factory.GetRoleById = function (idrol) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };

      var Parametros = {
        'IdRol': idrol
      };

      $http.post(globalService.getUrl() + paths.GetRoleById, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    };




    factory.GetRoleCommands = function (idrol) {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };

      var Parametros = {
        'IdRol': idrol
      };

      $http.post(globalService.getUrl() + paths.GetRoleCommands, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    };





    factory.GetRoleList = function () {
      var deferred = $q.defer();
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      $http.get(globalService.getUrl() + paths.GetRoleList, config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    };


    factory.AddRole = function (object) {
      var deferred = $q.defer();
      var Parametros = {
        'objRole': {
          'Nombre': object.Nombre,
          'Descripcion': object.Descripcion,
          'Estado': object.Estado
        }
      };
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      $http.post(globalService.getUrl() + paths.AddRole, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });
      return deferred.promise;

    };





    factory.GetComandos = function (idrol, lista) {

      var deferred = $q.defer();
      var Parametros = {
        'objRol': {
          'IdRol': idrol
        },
        'lstComando': lista
      };
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      $http.post(globalService.getUrl() + paths.GetComandos, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });
      return deferred.promise;

    };




    factory.UpdateRole = function (object) {
      var deferred = $q.defer();
      var Parametros = {
        'objRole': {
          'IdRol': object.IdRol,
          'Nombre': object.Nombre,
          'Descripcion': object.Descripcion,
          'Estado': object.Estado
        }
      };
      var config = {
        headers: {
          'Authorization': $localStorage.currentUser.token
        }
      };
      $http.post(globalService.getUrl() + paths.UpdateRole, JSON.stringify(Parametros), config).then(function (response) {
        deferred.resolve(response.data);
      }).catch(function (data) {
        deferred.reject(data);
      });
      return deferred.promise;

    };

    return factory;
  });
