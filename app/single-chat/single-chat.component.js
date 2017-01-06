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
    vm.chatContext.sender = 'Xiaoming';
    vm.chatContext.receiver = 'Judy';
    vm.isReady = false;


    $scope.$watch('vm.chatContext', function() {
      vm.isReady = false;
    }, true);

    function startChat(){
      if (vm.chatContext.sender === '' || vm.chatContext.receiver === '') {
        return;
      }
      if (vm.chatContext.sender === vm.chatContext.receiver) {
        alert('发信人和收信人不能是同一个人！');
        return;
      }
      vm.isReady = true;
    }
  } //singleChatController
})();