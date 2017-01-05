(function() {
	'use strict'

	// Define the `chatBoard` module
	angular.module('bamaChat', [
		'chatBoard'
	]);

	angular
		.module('bamaChat')
		.controller('appController', appController);

	function appController($scope) {
		var vm = this;
		vm.tomName = 'Xiaoming';
		vm.jerryName = 'Judy';
		vm.tomContext = {};
		vm.jerryContext = {};

		vm.tomContext.sender = vm.tomName;
		vm.tomContext.receiver = vm.jerryName;
		vm.showTom = true;

		vm.jerryContext.sender = vm.jerryName;
		vm.jerryContext.receiver = vm.tomName;
		vm.showJerry = true;
	}


})();