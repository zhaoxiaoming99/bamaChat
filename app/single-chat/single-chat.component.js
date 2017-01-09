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
    vm.chatContext = {
      sender: 'Xiaoming',
      members: ['Judy'],
    };

    $scope.$watch('vm.chatContext', function() {
      if (vm.chatContext.sender === vm.chatContext.members[0]) {
        alert('发信人和收信人不能是同一个人！');
      }
    }, true);

    function startChat() {      
      
    }
  } //singleChatController
})();