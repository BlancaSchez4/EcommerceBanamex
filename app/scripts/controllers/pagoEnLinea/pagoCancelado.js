'use strict';
angular.module('softvFrostApp')
    .controller('PagoCanceladoCtrl', function ($uibModal, $state, $rootScope, ngNotify, $localStorage, $window, pagoEnLineaFactory, globalService, $sce,  $http) // servicio
    {
        var vm = this;  
        var ContratoComp;
        var ContratoReal;
        var NombreCliente;
   
      //  vm.openPay = openPay;


        function logOut() {
      
            delete $localStorage.currentUser;
            $window.location.reload();
        }


        this.$onInit = function () {
             ngNotify.set('El pago ha sido cancelado.', 'error');
            logOut();
        }       

    });
