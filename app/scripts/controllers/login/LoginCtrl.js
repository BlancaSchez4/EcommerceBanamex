'use strict';
angular.module('softvFrostApp').controller('LoginCtrl', LoginCtrl);

function LoginCtrl(authFactory, pagoReciboFactory, ngNotify, $state, $localStorage, $stateParams, $window, $location) {
	var vm = this;
	vm.login = login;
	
	this.$onInit = function () {

		//Revisar si existen las variables en el navegador
	
		redireccion();

		if ($localStorage.currentUser) {
			if ($stateParams.esn != undefined) {
				$state.go('home.provision.activacion', {
					'esn': $stateParams.esn
				});
			} else {
				
				$state.go('home.pagoEnLinea.pago');
		
			}
		}
		
	}



	function login() {
		authFactory.login(vm.user, vm.password).then(function (data) {
			$localStorage.currentPay.logueoAutomatico = 0;	
			if (data) {
				$window.location.reload();
			} else {
				ngNotify.set('Datos de acceso erróneos', 'error');
			}
		});
	}


	function loginAutomatico(login, pass, result_success) {
		authFactory.login(login, pass).then(function (data) {
		
			$localStorage.currentPay.resultIndicator = result_success;
			$localStorage.currentPay.successIndicator = result_success;
			$localStorage.currentPay.logueoAutomatico = 1;	
			if (data) {
				//remover las variables del navegador
			
				cambiarUrl(); //$window.location.reload();
			
			} else {
				ngNotify.set('Datos de acceso erróneos', 'error');
			}
		});
	}



    function redireccion(){
        	
            var urlCancelado =  window.location.href;          
            var n = urlCancelado.indexOf("resultIndicator");          
 
            if (n == -1){
                // No existe resultIndicator
               
            }
            else {              
                // Redirección por PAGO hecho
              
                    // Get variable from url
                    var urlRedire =  window.location.href; 
                    var url = new URL(urlRedire);
                    var result_success =  url.searchParams.get("resultIndicator");              
                    var sV =  url.searchParams.get("sessionVersion");                         
                    var loginUsuarioAutomatico = 0;         
					var pasaporteUsuarioAutomatico = 0; 

					authFactory.datosLogueoDelContrato(result_success).then(function(data) { 
									      
				        loginUsuarioAutomatico = data.GetDatosLogueoResult[0].Login;
				        pasaporteUsuarioAutomatico = data.GetDatosLogueoResult[0].Pasaporte;				      
				        loginAutomatico(loginUsuarioAutomatico, pasaporteUsuarioAutomatico, result_success);
				    
				    });  
				    
            }       	     
     }





    function cambiarUrl(){         

        var urlResult =  window.location.href;  
        var afterComma = urlResult.substr(urlResult.indexOf("?")); // Contains 24 //     
        var quitarDeUrl = afterComma.substring(0, afterComma.indexOf("#"));            
        location.href = location.href.replace(quitarDeUrl, ''); 
	
    }


}
