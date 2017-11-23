'use strict';
angular.module('softvFrostApp')
	.factory('pagoEnLineaFactory', function($http, $q,  $base64, $window, globalService, $localStorage) {
		
		var factory = {};		
		var paths = {  		
			GetContratoCompuesto: '/Ecom_PagoEnLinea/GetContratoCompuesto',
			validarContrato: '/sp_dameContratoCompaniaAdic/Getsp_dameContratoCompaniaAdicList',			
			buscarContrato: '/Ecom_PagoEnLinea/GetBusCliPorContrato_FacList',
			ValidaSaldoContrato: '/ValidaSaldoContrato/GetValidaSaldoContrato',
			CobraSaldo: '/CobraSaldo/GetDeepCobraSaldo',
			dameSession: '/DameClv_Session/GetDeepDameClv_Session',
			////preguntaCajas: '/uspHaz_Pregunta/GetDeepuspHaz_Pregunta',
			getObservaciones: '/ConRelClienteObs/GetDeepConRelClienteObs',
			serviciosCliente: '/DameSerDelCliFac/GetDameSerDelCliFacList',
			dameSuscriptor: '/DameTiposClientes/GetDameTiposClientesList',
			damePeriodoCliente: '/InformacionClientePeriodos/GetPeriodoCliente',
			dameDetallePago: '/Ecom_PagoEnLinea/GetDameDetalleList',
			dameSumaPago: '/Ecom_PagoEnLinea/GetSumaDetalleList',
			ObtieneEdoCuentaSinSaldar: '/ObtieneEdoCuentaSinSaldar/GetObtieneEdoCuentaSinSaldarList',
			checaRetiro: '/ChecaOrdenRetiro/GetChecaOrdenRetiroList',
			ValidaHistorialContrato: '/ValidaHistorialContrato/GetDeepValidaHistorialContrato',
			////getMotivo: '/MUESTRAMOTIVOS/GetMUESTRAMOTIVOSList',
			////dameHistorialServicios: '/Ecom_PagoEnLinea/GetBuscaFacturasHistorialList',
			////getEstadoCuenta: '/Ecom_PagoEnLinea/GetDeeptieneEdoCuenta',
			////puedoAdelantarPago: '/Adelantar/GetDeepAdelantar',
			////checaAdelantarPagos: '/Adelantar/GetDeepChecaAdelantarPagosDif',
			////validaAdelantar: '/PagoAdelantado/GetAdelantaParcialidades',
			////pagoAdelantado: '/PagoAdelantado/GetPagoAdelantadoList',
			////dameSucursalCompa: '/DameRelSucursalCompa/GetDeepDameRelSucursalCompa',
			////dimeSiYaFact: '/DameRelSucursalCompa/GetDeepDimeSiYaGrabeFac',
			sumaTotalDetalle: '/SumaTotalDetalle/GetDeepSumaTotalDetalle',
			////dameBancos: '/MuestraBancos/GetMuestraBancosList',
			insertSeguridadToken: '/SeguridadToken/AddSeguridadToken',
			
			banamex6: '/Banamex/GetCreateCheckoutSession',
			//banamexRetrieve: '/Banamex/GetRetrieve',
			//guardaPagoEnLinea: '/Banamex/GetGuardaPagoEnLinea',
			guardaMovimiento: '/Banamex/GetGuardaMovimiento',
			buscarMovimiento: '/Banamex/GetBuscaMovimiento',
			validaNoContratoMaestro: '/Banamex/GetValidaNoContratoMaestro',
			//guardaReturnData: '/Banamex/GetGuarda_ReturnData',
			datosMerchant: '/Banamex/GetDatosMerchant',
			guardaIdSession: '/Banamex/GetGuarda_IdSessionByMovimiento'
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


		//----------------------------------------------
		factory.validaNoContratoMaestro = function (contrato) {			
			
			var deferred = $q.defer();
			var Parametros = {
				'contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.validaNoContratoMaestro, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};



		factory.banamex6 = function (merchantId, userid, password, orderId, orderAmount, orderCurrency, referenciaDePedido, returnUrl, cancelUrl, logoUrl) {			

			var token = $base64.encode(userid + ':' + password);

			var deferred = $q.defer();
			var Parametros = {
				'merchantId': merchantId,
				'idInt':1234,
				'token': token,
				'apiUsername': userid,
				'apiPassword': password,  
				'apiOperation':'CREATE_CHECKOUT_SESSION',   
	            'id':orderId,
	            'amount':orderAmount,
	            'currency':orderCurrency,
	            'referenciaDePedido': referenciaDePedido,
	            'returnUrl': returnUrl, // 'http://localhost:9000/#!/home/pagoEnLinea/pago'                 
				'cancelUrl':cancelUrl,
				'logoUrl':logoUrl
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.banamex6, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
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



		factory.guardaMovimiento = function ( idSessionCobra, contrato) {
			
			var deferred = $q.defer();
			var Parametros = {
				'clv_Session': idSessionCobra,
				'contrato': contrato,
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.guardaMovimiento, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};


		factory.guardaIdSession = function ( idSessionCobra, idSessionBanco, successIndicator) {
			
			var deferred = $q.defer();
			var Parametros = {
				'clv_Session': idSessionCobra,
				'idSessionBanco': idSessionBanco,
				'successIndicator':successIndicator
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.guardaIdSession, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};



		factory.buscarMovimiento = function ( idSessionCobra) {
		
			var deferred = $q.defer();
			var Parametros = {
				'clv_Session': idSessionCobra
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.buscarMovimiento, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};
//-------------------------------------------------------------------------------



		factory.getEstadoCuenta = function (contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.getEstadoCuenta, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});
			return deferred.promise;
		};


	factory.GetContratoCompuesto = function(ContratoReal) {			
 	
		var deferred = $q.defer();
		var Parametros = {
			'Contrato': ContratoReal
			};
		var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
		$http.post(globalService.getUrl() + paths.GetContratoCompuesto, JSON.stringify(Parametros), config).then(function(response) {
				deferred.resolve(response.data);
			}).catch(function(response) {
				deferred.reject(response.data);
			});

		return deferred.promise;
	};	

	factory.validarContrato = function (ContratoCom) {
		var deferred = $q.defer();
		var Parametros = {
			'ContratoCom': ContratoCom,
			'ClvUsuario': $localStorage.currentUser.idUsuario,
			'Modulo': 'facturacion'
		};
		var config = {
			headers: {
				'Authorization': $localStorage.currentUser.token
			}
		};
		$http.post(globalService.getUrl() + paths.validarContrato, JSON.stringify(Parametros), config).then(function (response) {
			deferred.resolve(response.data);
		}).catch(function (response) {
			deferred.reject(response);
		});
		return deferred.promise;
	};
	

	factory.buscarContrato = function (ContratoComp) {
		var deferred = $q.defer();
		var Parametros = {
			'Id': 0,
			'ContratoC': ContratoComp
		};
		var config = {
			headers: {
				'Authorization': $localStorage.currentUser.token
			}
		};
		$http.post(globalService.getUrl() + paths.buscarContrato, JSON.stringify(Parametros), config).then(function (response) {
			deferred.resolve(response.data);
		}).catch(function (response) {
			deferred.reject(response);
		});

		return deferred.promise;
	};


	factory.ValidaSaldoContrato = function (Contrato) {
		
		var deferred = $q.defer();
		var Parametros = {
			'Contrato': Contrato,

			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.ValidaSaldoContrato, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.CobraSaldo = function (Contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': Contrato,

			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.CobraSaldo, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};


		factory.dameSession = function (contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.dameSession, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};


		factory.preguntaCajas = function (contrato, op) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato,
				'Op': op
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.preguntaCajas, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};
		
		factory.getObservaciones = function (contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.getObservaciones, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};



		factory.serviciosCliente = function (contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.serviciosCliente, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.dameSuscriptor = function (contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.dameSuscriptor, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};


		factory.damePeriodoCliente = function (contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato,
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.damePeriodoCliente, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.dameDetallePago = function (session) {
			var deferred = $q.defer();
			var Parametros = {
				'Clv_Session': session
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.dameDetallePago, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.dameSumaPago = function (session) {
			var deferred = $q.defer();
			var Parametros = {
				'Clv_Session': session
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.dameSumaPago, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};


		factory.ObtieneEdoCuentaSinSaldar = function (Contrato, ClvSession) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': Contrato,
				'ClvSession': ClvSession
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.ObtieneEdoCuentaSinSaldar, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.checaRetiro = function (contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.checaRetiro, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.ValidaHistorialContrato = function (Contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': Contrato,

			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.ValidaHistorialContrato, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.getMotivo = function(op) {
			var deferred = $q.defer();
			var Parametros = {
				'Op': op
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.getMotivo, JSON.stringify(Parametros), config).then(function(response) {
				deferred.resolve(response.data);
			}).catch(function(response) {
				deferred.reject(response);
			});
			return deferred.promise;
		};

		factory.dameHistorialServicios = function (contrato) {

			var deferred = $q.defer();
			var Parametros = {
				'Id': 1,
				'Serie': '',
				'Folio': 0,
				'Fecha': '01/01/1900',
				'Tipo': 'T',
				'ContratoO': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
		
			$http.post(globalService.getUrl() + paths.dameHistorialServicios, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};


		factory.puedoAdelantarPago = function (session) {
			var deferred = $q.defer();
			var Parametros = {
				'IdSession': session
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.puedoAdelantarPago, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};


		factory.checaAdelantarPagos = function (contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.checaAdelantarPagos, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.validaAdelantar = function (contrato, session, adelantados) {
			
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato,
				'Clv_Session': session,
				'numeroAdelantar': adelantados
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.validaAdelantar, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});
			return deferred.promise;
		};


		factory.pagoAdelantado = function (session, servicio, llave, unicaNet, clave, meses, tipoCli, contrato) {
		
			var deferred = $q.defer();
			var Parametros = {
				'Clv_Session': session,
				'Clv_Servicio': servicio,
				'Clv_llave': llave,
				'Clv_UnicaNet': unicaNet,
				'Clave': clave,
				'MesesAdelantados': meses,
				'IdTipoCli': tipoCli,
				'Contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.pagoAdelantado, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		/*
		function guardaconcepto(item, index) {
			for (var i = 0; i < vm.detallePago.length; i++) {
				vm.detallePago[i].isChecked = false;
			}
			vm.detallePago[index].isChecked = true;
			vm.selectAparato = item;
		}*/


		factory.dameSucursalCompa = function (contrato) {
			
			var deferred = $q.defer();		
			var Parametros = {
				'IdSucursal': 64,//$localStorage.currentUser.sucursal,
				'Contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.dameSucursalCompa, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};
		

		factory.dimeSiYaFact = function (contrato) {
			var deferred = $q.defer();
			var Parametros = {
				'Contrato': contrato
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.dimeSiYaFact, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.sumaTotalDetalle = function (session) {
			var deferred = $q.defer();
			var Parametros = {
				'IdSession': session
			};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.sumaTotalDetalle, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.dameBancos = function () {
			var deferred = $q.defer();
			var Parametros = {};
			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.dameBancos, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		factory.insertSeguridadToken = function (session) {
			
			var deferred = $q.defer();
			var user = $localStorage.currentUser;
		
			var Parametros = {
				'objSeguridadToken': {
					'Token1': $localStorage.currentUser.token1,
					'Token2': $localStorage.currentUser.token,
					'IdUsuario': user.idUsuario,
					'Usuario': user.usuario,
					'IdSucursal': user.sucursal,
					'IpMaquina': user.maquina,
					'ClvSession': session
				}
			};

			var config = {
				headers: {
					'Authorization': $localStorage.currentUser.token
				}
			};
			$http.post(globalService.getUrl() + paths.insertSeguridadToken, JSON.stringify(Parametros), config).then(function (response) {
				deferred.resolve(response.data);
			}).catch(function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};










		return factory;

	});