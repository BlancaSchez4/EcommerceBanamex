'use strict';
angular.module('softvFrostApp').controller('PermisosCtrl', PermisosCtrl);

function PermisosCtrl(permisoFactory, rolFactory, ngNotify) {
	function Init() {
		rolFactory.GetRoleList().then(function(data) {
			vm.Roles = data.GetRoleListResult;
			vm.Rol = vm.Roles[0];
			GetModuleList();
		});
	}

	function GetModuleList() {
		permisoFactory.GetModulopermiso(vm.Rol.IdRol).then(function(data) {			
			
			vm.Modules=	data.GetModulos_PermisosResult;
		});
	}



	function ObtenPermisos() {
		GetModuleList();
	}

	function Guardar() {
		if (vm.Rol == null) {
			ngNotify.set('Selecciona algún rol para continuar.', 'error');
			return;
		}
		permisoFactory.GuardaPermisos(vm.Rol.IdRol, vm.Modules).then(function(data) {
			ngNotify.set('Los permisos se establecieron correctamente', 'success');

		});

	}
	var vm = this;
	Init();
	vm.ObtenPermisos = ObtenPermisos;
	vm.Guardar = Guardar;
}
