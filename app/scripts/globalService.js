'use strict';
angular.module('softvFrostApp')
	.service('globalService', function () {
		var svc = {};

		svc.getUrl = function() {			
			return 'http://localhost:64481/SoftvWCFService.svc';	
			//return 'http://192.168.50.35:2000/SoftvWCFService.svc';
			//return 'http://172.16.126.44:2000/SoftvWCFService.svc';
			//return 'http://172.16.126.58:2010/SoftvWCFService.svc'; // privada
			//return 'http://189.204.147.26:2010/SoftvWCFService.svc'; //pública
		};
			

		return svc;
	});


