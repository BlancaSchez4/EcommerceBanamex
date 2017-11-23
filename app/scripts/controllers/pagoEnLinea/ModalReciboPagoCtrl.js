'use strict';
angular
	.module('softvFrostApp')
	.controller('ModalReciboPagoCtrl', 
		function($uibModal, $uibModalInstance, pagoReciboFactory,  $localStorage, ngNotify, $window) {
	
		var password = $localStorage.merchantData.password;
		var userId = $localStorage.merchantData.userId;
		var merchantId = $localStorage.merchantData.merchantId;	
		var idSession = $localStorage.currentPay.idSession;			
		var successIndicator = $localStorage.currentPay.successIndicator;
		//var contrato = $localStorage.currentUser.contrato;	 
		var img = new Image();  
		

		


		function init() {
	    	
	    	getImageDataURL();
			dameFecha();	
			
            pagoReciboFactory.banamexRetrieve(password, userId, idSession, merchantId).then(function(data) { 
             
                vm.objRetrieve = JSON.parse(data.GetRetrieveResult); 
           
             	
                if( vm.objRetrieve.hasOwnProperty('error')){
					ngNotify.set(vm.objRetrieve.result + ', '+ vm.objRetrieve.error.cause , 'error');
                }
                else{

                	var cardNumber = vm.objRetrieve.sourceOfFunds.provided.card.number             
					vm.cardRes = 'xxxxxxxxxxxx' + cardNumber.substring(12, 16);	
				    //var urlResult =  window.location.href;
		        
		        	var valResultIndicator = $localStorage.currentPay.resultIndicator;
		       		    

	            	if(successIndicator == valResultIndicator) 
	            	{			
	            								        
							var doc = new jsPDF({
					        orientation: 'portrait',
					        format: 'Letter'
					        });				    				     

					        doc.addImage(img, 'jpeg', 12, 10, 48, 18);
						
					        doc.setFontSize(14); 
					        doc.setFontType("bold");
	        				
	        				var reportHeaderPdf = "Recibo de transacción";
					        var fontSize = doc.internal.getFontSize(); // Get current font size
					        var pageWidth = doc.internal.pageSize.width; 
					        var txtWidth = doc.getStringUnitWidth(reportHeaderPdf) * fontSize / doc.internal.scaleFactor;
					        var x = ( pageWidth - txtWidth ) / 2;    // Calculate text's x coordinate    
					        doc.text(reportHeaderPdf, x, 20);   // Posición text at x,y

					        doc.setFontSize(10); 
	        				reportHeaderPdf = "Gracias por realizar su pago. Pago hecho correctamente";
					        fontSize = doc.internal.getFontSize(); // Get current font size
					        pageWidth = doc.internal.pageSize.width; 
					        txtWidth = doc.getStringUnitWidth(reportHeaderPdf) * fontSize / doc.internal.scaleFactor;
					        x = ( pageWidth - txtWidth ) / 2;    // Calculate text's x coordinate    
					        doc.text(reportHeaderPdf, x, 30);   // Posición text at x,y
					          
					        //-----------------------
					        jsPDF.autoTableSetDefaults({					        
					            bodyStyles: { fontSize: 10 }
					        });
					       
					        var columns1 = [ {title: "", dataKey: "name"} ];

					        var rows1 = [
					            { "name": vm.objRetrieve.interaction.merchant.name},
					            { "name": vm.objRetrieve.interaction.merchant.address.line1},
					            { "name": vm.objRetrieve.interaction.merchant.address.line2},
 				             	{ "name": "Correo electrónico	" + vm.objRetrieve.interaction.merchant.email},
 				             	{ "name": ""},
 				             	{ "name": "Fecha 	" + vm.dateToday + "	" + vm.hourToday},
					            { "name": "ID de transacción	" + vm.objRetrieve.order.id },
					            { "name": "Método de pago 	" + vm.objRetrieve.sourceOfFunds.provided.card.brand},
 				             	{ "name": "					" + vm.cardRes},
 				             	{ "name": ""},
 				             	{ "name": "Resumen del pago"},
			            		{ "name": " 		" + vm.objRetrieve.order.description + "	"+vm.objRetrieve.order.currency + " P" + vm.objRetrieve.order.amount } 				            	
					        ];					  

					        doc.autoTable(columns1, rows1, {
					            startY:27,   
					            theme: 'plain',
					            styles: { overflow: 'linebreak' },					          
					            margin: { top: 50, right: 30, bottom: 30, left: 30}					          
					        });
					        

				   			doc.save('Recibo de pago.pdf');
				   		
                			            	
	            	}
	            	else {
   						ngNotify.set('Error al verificar el pago', 'error');
	            	}
                }   
            });  
            
		}

	

        function logOut() {         
            delete $localStorage.currentUser;
            $window.location.reload();
        }


		function cancel() {
			$uibModalInstance.dismiss('cancel');		
		
		    logOut()
		}

		function ok() {
			
			logOut()			
		}


		var vm = this;
		vm.cancel = cancel;
		vm.ok = ok;

		
		function dameFecha(){
		
            var t = new Date();   
            var dia, mes, anio, minuto;

            dia = t.getDate();
			if(dia < 10){
			    dia = '0'+ dia;
			} 
			mes = t.getMonth();
			mes = mes + 1;
			if(mes  < 10){
			    mes  = '0' + mes ;
			}    
            anio = t.getFullYear();		
			vm.dateToday = dia + '/' + mes + '/' + anio;

			minuto = t.getMinutes();
			if(minuto < 10){
			    minuto = '0'+ minuto;
			} 

			vm.hourToday = t.getHours()+':'+minuto;
			
		}


    function getImageDataURL() 
    {            
   
        var url = document.getElementById("reciboLogo").src;  
        var data, canvas, ctx;

        img.onload = function()
        {
            // Create the canvas element.
            canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            // Get '2d' context and draw the image.
            ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            // Get canvas data URL
            data = canvas.toDataURL();              
        }
            // Load image URL.    
        img.src = url;  
    }

		init();

	});


