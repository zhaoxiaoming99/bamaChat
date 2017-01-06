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
    vm.startChat = startChat;    
    vm.chatContext = {};
    vm.sender = 'Xiaoming';
    vm.receiver = 'Judy';
    vm.isReady = false;


    $scope.$watch('vm.sender', function() {
      vm.isReady = false;
    }, true);
    $scope.$watch('vm.receiver', function() {
      vm.isReady = false;
    }, true);

    function startChat(){
      if (vm.sender === '' || vm.receiver === '') {
        return;
      }
      if (vm.sender === vm.receiver) {
        alert('发信人和收信人不能是同一个人！');
        return;
      }
      vm.chatContext.sender = vm.sender;
      vm.chatContext.members = [vm.sender, vm.receiver];
      vm.isReady = true;
    }
  } //singleChatController
})();