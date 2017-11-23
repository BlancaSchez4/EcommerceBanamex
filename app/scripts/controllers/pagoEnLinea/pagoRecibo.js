'use strict';
angular.module('softvFrostApp')
    .controller('PagoReciboCtrl', function ($uibModal, $state, $rootScope, ngNotify, $localStorage, $window, pagoReciboFactory, globalService, $sce,  $http) // servicio
    {
        var vm = this;  
        var ContratoComp;
        var ContratoReal;
        var NombreCliente;
   

        function logOut() {
      
            delete $localStorage.currentUser;
            $window.location.reload();
        }


        this.$onInit = function () {

            if ($localStorage.currentPay.userModal == null)
            {
                $localStorage.currentPay.userModal = 0;
                //ngNotify.set('modal primera vez', 'error');
            }          

            if($localStorage.currentPay.userModal == 1)
            {
                //ngNotify.set('TERMINAR SESION', 'error');
                logOut();

            }
            else{
                 



                if( $localStorage.currentPay.logueoAutomatico == 1){
                      
                        pagoReciboFactory.getIdSessionTransaccion( $localStorage.currentUser.contrato, $localStorage.currentPay.resultIndicator).then(function(data) {  
                           
                            $localStorage.currentPay.idSession = data.GetIdSessionTransaccionResult[0].idSession;                  
                        });
                } 

                ngNotify.set('Espere mientras se crea su recibo.', 'warn');

                //console.log('SI ENTRA AL MODAL, ES UN 2');

                pagoReciboFactory.datosMerchant().then(function(data) {           
                    $localStorage.merchantData.merchantId = data.GetDatosMerchantResult[0].merchantId;
                    $localStorage.merchantData.userId = data.GetDatosMerchantResult[0].userId;
                    $localStorage.merchantData.password = data.GetDatosMerchantResult[0].password;
                    $localStorage.merchantData.merchantName = data.GetDatosMerchantResult[0].merchantName;
                    $localStorage.merchantData.addressLine1 = data.GetDatosMerchantResult[0].addressLine1;
                    $localStorage.merchantData.addressLine2 = data.GetDatosMerchantResult[0].addressLine2;
                    $localStorage.merchantData.email = data.GetDatosMerchantResult[0].email;
                    $localStorage.merchantData.descripcionImporte = data.GetDatosMerchantResult[0].descripcionImporte;
              
                });

                if( $localStorage.currentPay.urlCambiada == 0){
                    redireccion();  
                }
                else if ( $localStorage.currentPay.urlCambiada == 1  || $localStorage.currentPay.logueoAutomatico == 1  ){

                    setTimeout( function() {Exec_Retrieve()},1200);               

                }

            }          

        } 



    function Exec_Retrieve(){

        var idSessionCobra = $localStorage.currentPay.clvSessionCobra;// sesion cobra ACTUAL  

                        pagoReciboFactory.banamexRetrieve(
                        $localStorage.merchantData.password, 
                        $localStorage.merchantData.userId, 
                        $localStorage.currentPay.idSession, 
                        $localStorage.merchantData.merchantId).then(function(data) {  

                        vm.objRetrieve = JSON.parse(data.GetRetrieveResult);       
                        var retrieveData = data.GetRetrieveResult;  

                        
                        if( vm.objRetrieve.hasOwnProperty('error')){
                                ngNotify.set(vm.objRetrieve.result + ', '+ vm.objRetrieve.error.cause , 'error');
                        }
                        else if( vm.objRetrieve.hasOwnProperty('sourceOfFunds') ) //Solo existe en pago hecho
                        {       
                           // console.log(vm.objRetrieve.interaction.successIndicator);
                            var successIndicator = $localStorage.currentPay.successIndicator;      
                            var valResultIndicator = $localStorage.currentPay.resultIndicator;

                            if(successIndicator = valResultIndicator ) // PAGO EXITOSO, GUARDAR EN BD
                            {                   
                                if(vm.objRetrieve.interaction.successIndicator = successIndicator )       
                                {                                    
                                    pagoReciboFactory.guardaPagoEnLinea(vm.objRetrieve.order.id, $localStorage.currentUser.contrato).then(function(data) {                     
                                        //console.log(data);                                                                                                 
                                    });    

                                    pagoReciboFactory.guardaReturnData( vm.objRetrieve.order.id, retrieveData, valResultIndicator).then(function(data) {
                                        //console.log(data);                                                                    
                                    });                  
                                
                                    Modal();  
                                }    
                                else {
                                    
                                ngNotify.set('Error al verificar el pago. El pago no fue guardado', 'error');
                                }         
                                      
                            }
                            else {
                                ngNotify.set('Error al verificar el pago. El pago no fue guardado', 'error');
                            }

                         
                        }//fin
                    }); 
    }










        function redireccion(){
          
            //Redireccion por cancelacion
            var urlCancelado =  window.location.href;          
            var n = urlCancelado.indexOf("resultIndicator");          

            if (n == -1){
                // Redirección por cancelación, no existe resultIndicator
            }
            else {              
                // Redirección por refresh o pago hecho

                if ($localStorage.currentPay.idSession != null ) //ID SESSION DEL CHECKOUT
                {         
                    // Get variable from url
                    var urlRedire =  window.location.href; 
                    var url = new URL(urlRedire);
                    $localStorage.currentPay.resultIndicator = url.searchParams.get("resultIndicator");                 
                    $localStorage.currentPay.sessionVersion = url.searchParams.get("sessionVersion");  
                   
                    cambiarUrl();                                       
                }               
            }           
        }


        function cambiarUrl(){
         
            $localStorage.currentPay.urlCambiada = 1;  

            var urlResult =  window.location.href;  
            var afterComma = urlResult.substr(urlResult.indexOf("?")); // Contains 24 //     
            var quitarDeUrl = afterComma.substring(0, afterComma.indexOf("#"));
            
            location.href = location.href.replace(quitarDeUrl, ''); 

            $localStorage.currentPay.userModal = 2;

        }


        vm.Modal = Modal;
        function Modal(){
            
            $localStorage.currentPay.userModal = 1;
  
            vm.animationsEnabled = true;
            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/pagoEnLinea/modalReciboPago.html',
                controller: 'ModalReciboPagoCtrl',
                controllerAs: 'ctrl',
                backdrop: 'static',
                keyboard: false,
                class: 'modal-backdrop fade',
                size: 'lg'                
            });
        }




    });
