'use strict';
angular.module('softvFrostApp')
    .controller('PagoEnLineaCtrl', function ($uibModal, $state, $rootScope, ngNotify, $localStorage, $window, pagoEnLineaFactory, globalService, $sce,  $http) // servicio
    {

        var vm = this;  
        var ContratoComp;
        var ContratoReal;
        var NombreCliente;         
        vm.inputHide = true;   
     


        function checaLogueo(){
         
            //revisamos si es la primera vez que se loguea            

          
            if ($localStorage.currentPay.userLogueado == 0){
        
                //ngNotify.set('es CERO, LOGUEADO PRIMERA VEZ', 'error');
                $localStorage.currentPay.userLogueado = 1;
            }
            else if($localStorage.currentPay.userLogueado == null) 
            {
                //ngNotify.set('es NULL O INDEFINIDO, CERRÓ PAG Y AHORA SE ABRIÓ', 'error');  
                $localStorage.currentPay.userLogueado = 2                            
                logOut();
            }
            else if ($localStorage.currentPay.userLogueado == 1)
            {
                //ngNotify.set('es 1, SALIR DE LA PAGINA', 'error'); 
                logOut();
            }

            if ($localStorage.currentPay.logueoAutomatico == 1)
            {
               // ngNotify.set('LOGGIN AUT', 'warn'); 
                $state.go('home.recibo');
            }else{
                //ngNotify.set('lOGGIN normal', 'info');                
            }
        
        }


        
       function logOut() {
      
            delete $localStorage.currentUser;
            $window.location.reload();
        }
        
   



        this.$onInit = function () {
          //  ngNotify.set('INICIO', 'error');
          //$localStorage.currentPay.userLogueado = 2;
            checaLogueo();

            pagoEnLineaFactory.datosMerchant().then(function(data) {                     
            
                $localStorage.merchantData.merchantId = data.GetDatosMerchantResult[0].merchantId;
                $localStorage.merchantData.userId = data.GetDatosMerchantResult[0].userId;
                $localStorage.merchantData.password = data.GetDatosMerchantResult[0].password;
                $localStorage.merchantData.merchantName = data.GetDatosMerchantResult[0].merchantName;
                $localStorage.merchantData.addressLine1 = data.GetDatosMerchantResult[0].addressLine1;
                $localStorage.merchantData.addressLine2 = data.GetDatosMerchantResult[0].addressLine2;
                $localStorage.merchantData.email = data.GetDatosMerchantResult[0].email;
                $localStorage.merchantData.descripcionImporte = data.GetDatosMerchantResult[0].descripcionImporte;
            });
     
            obtenerContratoCompuesto();        
        }

 

        //--------------------------------------------

        vm.obtenerContratoCompuesto = obtenerContratoCompuesto;
        function obtenerContratoCompuesto()
        {            
            ContratoReal = $localStorage.currentUser.contrato;    
            pagoEnLineaFactory.GetContratoCompuesto(ContratoReal).then(function(data) {      
                    
                vm.Cliente = data.GetContratoCompuestoResult; 
                buscarPorContrato(vm.Cliente.ContratoCompuesto);    
            });    
          
        }
        

        function buscarPorContrato(ContratoComp) {                       
       
                if (ContratoComp !== null) {

                        pagoEnLineaFactory.ValidaSaldoContrato(vm.Cliente.Contrato).then(function(data) {
                           
                                // SI TIENE SALDO O NO
                                if (data.GetValidaSaldoContratoResult.tieneSaldo > 0) { 
                                    vm.ArrastraSaldo = true;
                                                                       
                                    pagoEnLineaFactory.CobraSaldo(vm.Cliente.Contrato).then(function(cobra) { 
                                     
                                      

                                        vm.session = cobra.GetDeepCobraSaldoResult.ClvSession;    
                                        /*
                                        pagoEnLineaFactory.preguntaCajas(vm.Cliente.Contrato, 0).then(function(op1) {
                                           
                                            if (op1.GetDeepuspHaz_PreguntaResult.Pregunta != null) {
                                                abrirModalPregunta(0, op1.GetDeepuspHaz_PreguntaResult.Pregunta, op1.GetDeepuspHaz_PreguntaResult.MesesAdelantados);
                                            }
                                        });  

                                        pagoEnLineaFactory.preguntaCajas(vm.Cliente.Contrato, 2).then(function(op1) {
                                          
                                            if (op1.GetDeepuspHaz_PreguntaResult.Pregunta != null) {
                                                abrirModalPregunta(2, op1.GetDeepuspHaz_PreguntaResult.Pregunta, op1.GetDeepuspHaz_PreguntaResult.MesesAdelantados);
                                            }

                                        });    
                                        pagoEnLineaFactory.preguntaCajas(vm.Cliente.Contrato, 3).then(function(op1) {
                                            
                                            if (op1.GetDeepuspHaz_PreguntaResult.Pregunta != null) {
                                                abrirModalPregunta(3, op1.GetDeepuspHaz_PreguntaResult.Pregunta, op1.GetDeepuspHaz_PreguntaResult.MesesAdelantados);
                                            }
                                        }); 
                                        pagoEnLineaFactory.preguntaCajas(vm.Cliente.Contrato, 900).then(function(op1) {
                                         
                                            if (op1.GetDeepuspHaz_PreguntaResult.Pregunta != null) {
                                                abrirModalPregunta(900, op1.GetDeepuspHaz_PreguntaResult.Pregunta, op1.GetDeepuspHaz_PreguntaResult.MesesAdelantados);
                                            }
                                        });*/
                                      
                                        pagoEnLineaFactory.getObservaciones(vm.Cliente.Contrato).then(function(observa) {
                                            
                                            if (observa.GetDeepConRelClienteObsResult.Obs) {
                                                new PNotify({
                                                    title: 'Observaciones',
                                                    type: 'info',
                                                    text: observa.GetDeepConRelClienteObsResult.Obs,
                                                    hide: false
                                                });
                                            }
                                        });
                                        reloadTables(); 
                                        
                                      
                                        pagoEnLineaFactory.ObtieneEdoCuentaSinSaldar(vm.Cliente.Contrato, vm.session).then(function(detalleEdo) {
                                          
                                            vm.detalleEdo = detalleEdo.GetObtieneEdoCuentaSinSaldarListResult;
                                        });
                                        
                                    });

                                    //-----
                                    pagoEnLineaFactory.dameSession(ContratoReal).then(function(session) {  
                                          
                                        vm.session = session.GetDeepDameClv_SessionResult.IdSession;
                                        $localStorage.currentPay.clvSessionCobra = session.GetDeepDameClv_SessionResult.IdSession;
                                        vm.sessionCobra = $localStorage.currentPay.clvSessionCobra;  
                                    });
                                    //------


                                }                                 
                                else
                                {
                                   // console.log('NO TIENE SALDO');
                                    pagoEnLineaFactory.dameSession(ContratoReal).then(function(session) {      
                                   //Obtiene la session del cobra                               
                                        vm.session = session.GetDeepDameClv_SessionResult.IdSession;
                                        $localStorage.currentPay.clvSessionCobra = session.GetDeepDameClv_SessionResult.IdSession;
                                        vm.sessionCobra = $localStorage.currentPay.clvSessionCobra;                               

                                        /*
                                        pagoEnLineaFactory.preguntaCajas(ContratoReal, 0).then(function(op1) {
                                          
                                            if (op1.GetDeepuspHaz_PreguntaResult.Pregunta != null) {
                                                abrirModalPregunta(0, op1.GetDeepuspHaz_PreguntaResult.Pregunta, op1.GetDeepuspHaz_PreguntaResult.MesesAdelantados);

                                            }
                                        });
                                        pagoEnLineaFactory.preguntaCajas(vm.Cliente.Contrato, 2).then(function(op1) {
                                            if (op1.GetDeepuspHaz_PreguntaResult.Pregunta != null) {
                                               
                                                abrirModalPregunta(2, op1.GetDeepuspHaz_PreguntaResult.Pregunta, op1.GetDeepuspHaz_PreguntaResult.MesesAdelantados);
                                            }
                                        });
                                        pagoEnLineaFactory.preguntaCajas(vm.Cliente.Contrato, 3).then(function(op1) {
                                            if (op1.GetDeepuspHaz_PreguntaResult.Pregunta != null) {
                                          
                                                abrirModalPregunta(3, op1.GetDeepuspHaz_PreguntaResult.Pregunta, op1.GetDeepuspHaz_PreguntaResult.MesesAdelantados);
                                            }
                                        });
                                        pagoEnLineaFactory.preguntaCajas(vm.Cliente.Contrato, 900).then(function(op1) {
                                          
                                            if (op1.GetDeepuspHaz_PreguntaResult.Pregunta != null) {
                                                abrirModalPregunta(900, op1.GetDeepuspHaz_PreguntaResult.Pregunta, op1.GetDeepuspHaz_PreguntaResult.MesesAdelantados);
                                            }
                                        });
                                        */

                                        pagoEnLineaFactory.getObservaciones(vm.Cliente.Contrato).then(function(observa) {
                                           
                                            if (observa.GetDeepConRelClienteObsResult.Obs) {
                                                new PNotify({
                                                    title: 'Observaciones',
                                                    type: 'info',
                                                    text: observa.GetDeepConRelClienteObsResult.Obs,
                                                    hide: false
                                                });
                                            }
                                        });
                                        if (session.GetDeepDameClv_SessionResult.Error == 0) {
                                            reloadTables();
                                            vm.mostrarSuspencion = false;
                                            vm.color = '#ffffff'
                                            vm.colorServicios = '#E2EBEA';
                                        } else {
                                            reloadTables();
                                         
                                            vm.mostrarSuspencion = true;
                                            vm.color = '#D6D9D9';
                                            vm.colorServicios = '#B8BABA';
                                            ngNotify.set(session.GetDeepDameClv_SessionResult.Msg, {
                                                type: 'warn',
                                                sticky: true
                                            });
                                        }
                                    });
                                }

                        });
                        
                       
                        pagoEnLineaFactory.checaRetiro(vm.Cliente.Contrato).then(function(retiro) {
                            if (retiro.GetChecaOrdenRetiroListResult[0].Resultado > 0) {
                                new PNotify({
                                    title: 'Aviso',
                                    text: retiro.GetChecaOrdenRetiroListResult[0].Msg,
                                    hide: false
                                });
                            }
                        });

                        pagoEnLineaFactory.serviciosCliente(vm.Cliente.Contrato).then(function(servicios) {
                            vm.servicios = servicios.GetDameSerDelCliFacListResult;
                        });  
                      
                        pagoEnLineaFactory.dameSuscriptor(vm.Cliente.Contrato).then(function(suscriptor) {
                            vm.Suscriptor = suscriptor.GetDameTiposClientesListResult[0];
                        });
                        pagoEnLineaFactory.damePeriodoCliente(vm.Cliente.Contrato).then(function(dataPeriodo) {
                            vm.periodo = dataPeriodo.GetPeriodoClienteResult[0].Periodo;
                            if (dataPeriodo.GetPeriodoClienteResult[0].Resultado == 0) {
                                vm.showFiscales = false;
                            } else {
                                vm.showFiscales = true;
                            }
                        });
                        vm.muestraCliente = true;       

                } else {
                    ngNotify.set('El usuario no tiene permisos para ver a este cliente ó el contrato no existe.', 'error');
                    reset();
                }     

            resetBusquedas();
            $('.datosCliente').collapse('show');
            $('.conceptosCliente').collapse('show');
        }



        function reloadTables() {

            pagoEnLineaFactory.dameDetallePago(vm.session).then(function(detallePago) {
                
                if (detallePago.GetDameDetalleListResult.length == 0) {
                    vm.blockBaja = true;
                    vm.blockPagar = true;
              
                } else {
                    vm.blockBaja = false;
                    vm.blockPagar = false;
                 
                }
                vm.detallePago = detallePago.GetDameDetalleListResult;
                vm.detallePagoAux = vm.detallePago;
          
            });
        
            pagoEnLineaFactory.dameSumaPago(vm.session).then(function(sumaPago) {     
                vm.sumaPagos = sumaPago.GetSumaDetalleListResult;             
            });

        }

        $rootScope.$on('realoadPagos', function() {
            reloadTables();
        });



    // HOSTED CHEKCOUT SESSION PROCESS --- PAGO DIRECTO CON BANAMEX

    vm.pagar = pagar;

    function pagar() {
                   
           try{
                realizarPagoEnLinea();
           }
           catch(err){          
                delete $localStorage.currentUser;
                $window.location.reload();
           }
    }


    function realizarPagoEnLinea() {
        // Verificar si puede o no pagar      



        pagoEnLineaFactory.validaNoContratoMaestro( $localStorage.currentUser.contrato).then(function(data) {                    
          
            if (data.GetValidaNoContratoMaestroResult[0].PerteneceMaestro == 0){
                                    
                // Insertar movimiento en bd
                pagoEnLineaFactory.guardaMovimiento(vm.sessionCobra, ContratoReal).then(function(data) {  
                             
                });

                importeTotal = document.getElementById("importeTotal").innerText;
              
                var order = {};
                    order.id = vm.sessionCobra.toString(); //'31', obtener el id de pago que se va a enviar al CHECKOUT SESSION       
                    order.amount = importeTotal.substr(1);
                    order.currency = 'MXN';
                    order.reference = vm.Cliente.ContratoCompuesto; //contrato compuesto
                var logoUrl = pdflogoimage.src;
                                            
                if (order.amount == 0.00){
                    ngNotify.set('No puede realizar el pago por ese monto', 'warn'); 
                }
                else{

                    pagoEnLineaFactory.banamex6(
                    $localStorage.merchantData.merchantId, 
                    $localStorage.merchantData.userId, 
                    $localStorage.merchantData.password, order.id, order.amount, order.currency, order.reference,
                    returnUrl, cancelUrl, logoUrl).then(function(data) { 
                    //CREATE CHECKOUT SESSION
                        
                        var ObjCheckoutSession = JSON.parse(data.GetCreateCheckoutSessionResult);                                         
                  
                        if( ObjCheckoutSession.hasOwnProperty('error'))
                        {
                            ngNotify.set( 'Error. ' + ObjCheckoutSession.error.cause , 'error');
                        }
                        else {
                            vm.valCheckout =  ObjCheckoutSession.session.id;  
                            vm.valPassword = $localStorage.merchantData.password;
                            vm.valUserId = $localStorage.merchantData.userId;
                            vm.valMerchantId = $localStorage.merchantData.merchantId; 
                            
                            $localStorage.currentPay  = {                   
                                idSession: ObjCheckoutSession.session.id,
                            //password: password,
                            //userId: userId,
                            //merchantId: merchantId,
                                successIndicator: ObjCheckoutSession.successIndicator,
                                clvSessionCobra:vm.sessionCobra,
                                urlCambiada:0
                            }

                        
                            pagoEnLineaFactory.guardaIdSession(vm.sessionCobra, $localStorage.currentPay.idSession, $localStorage.currentPay.successIndicator).then(function(data) {                   
                             
                            });

                            llamaCheck(order); 
                        }                    
                    }); 
                }                    
            }
            else{
                ngNotify.set("No puede realizar el pago, contacte a su distribuidor.", {
                    type: 'warn',
                    sticky: true
                });
            }
        });
    }


    function llamaCheck(order){

        function completeCallback(resultIndicator, sessionVersion) {
                    
            console.log(resultIndicator, sessionVersion);    
        }

        function errorCallback(error){
            console.log('Ha surgido un error. ', JSON.stringify(error));     
            ngNotify.set('Ha surgido un error', 'error');        
        }

        function cancelCallback(){            
              console.log('Pago cancelado');
              ngNotify.set('Pago cancelado', 'error');    
        }   

            Checkout.configure({
                merchant: $localStorage.merchantData.merchantId,
                session : {
                    id: vm.valCheckout
                },
                order: {
                    amount: order.amount,//order.amount,
                    currency: order.currency,
                    description: $localStorage.merchantData.descripcionImporte,
                    id: order.id,
                    reference: vm.Cliente.ContratoCompuesto
                    //,                    notificationUrl: 'http://localhost:64481/SoftvWCFService.svc/Banamex/GetNotificacion'  
                },
                interaction: {                 
                    merchant: {
                        name: $localStorage.merchantData.merchantName,
                        address: {
                            line1: $localStorage.merchantData.addressLine1,
                            line2: $localStorage.merchantData.addressLine2
                        },
                        email : $localStorage.merchantData.email
                        //,logo : logoUrl                      
                    },
                    //returnUrl:'', 
                    displayControl:{
                        billingAddress:'HIDE',
                        customerEmail:'MANDATORY'
                    },                                      
                }
            });

        Checkout.showPaymentPage();
    }


        //var merchantId = "TEST1079120";
        //var userId  = "merchant." + merchantId; // "merchant.TEST1079120";
        //var password = "35797a9db1e03b3c225dd244c5fcc5d9";  
        var importeTotal ="";
        //var returnUrl = $state.href('home.pagoEnLinea.pago', {}, {absolute: true});
        var returnUrl = $state.href('home.recibo', {}, {absolute: true});
    
        //var merchantName = 'STAR GO CIB';
        //var addresLinea1 ='200 Sample St';
        //var addresLinea2 = '1234 Example Town';
        //var email =  'unmail@gmail.com';
        //var laDescripcion = 'Importe Total';
       // var cancelUrl =  $state.href('login', {}, {absolute: true});
        var cancelUrl =  $state.href('home.cancelado', {}, {absolute: true});
         

    });
