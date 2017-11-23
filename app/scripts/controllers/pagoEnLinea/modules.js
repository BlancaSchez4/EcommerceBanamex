'use strict';
angular.module('softvFrostApp').config(reportesConf);

function reportesConf($stateProvider) {
	var states = [{
			name: 'home.pagoEnLinea',
			abstract: true,
			template: '<div ui-view></div>'
		},
		{
			name: 'home.pagoEnLinea.pago',
			data: {
				pageTitle: 'STAR.GO | PAGO'				
			},
			url: '/pagoEnLinea/pago',
			templateUrl: 'views/pagoEnLinea/pago.html',
			controller: 'PagoEnLineaCtrl',
			controllerAs: '$ctrl'
		}
		
	];

	states.forEach(function(state) {
		$stateProvider.state(state);
	});
}