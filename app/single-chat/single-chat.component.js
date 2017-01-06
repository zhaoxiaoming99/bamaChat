(function() {
  'use strict';
  angular
    .module('singleChat')
    .directive('singleChat', singleChatDirective);

  angular
    .module('singleChat')
    .controller('singleChatController', singleChatController);

  function singleChatDirective() {
    return {
      templateUrl: 'single-chat/single-chat.template.html',
      controller: 'singleChatController as vm'
    };
  }

  function singleChatController($scope) {
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
    
  } //singleChatController
})();