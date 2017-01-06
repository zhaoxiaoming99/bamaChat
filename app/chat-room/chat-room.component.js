(function() {
  'use strict';
  angular
    .module('chatRoom')
    .directive('chatRoom', chatRoomDirective);

  angular
    .module('chatRoom')
    .controller('chatRoomController', chatRoomController);

  function chatRoomDirective() {
    return {
      templateUrl: 'chat-room/chat-room.template.html',
      controller: 'chatRoomController as vm'
    };
  }

  function chatRoomController($scope) {
    var vm = this;
    vm.startChat = startChat;    
    vm.chatContext = {};
    vm.sender = 'Xiaoming';
    vm.members = [];
    vm.isReady = false;


    $scope.$watch('vm.sender', function() {
      vm.isReady = false;
    }, true);
    $scope.$watch('vm.members', function() {
      vm.isReady = false;
    }, true);

    function startChat(){
      if (vm.sender === '' || vm.members.length == 0) {
        return;
      }      
      vm.chatContext.sender = vm.sender;
      vm.chatContext.members = angular.copy(vm.members);
      if (vm.chatContext.members.indexOf(vm.sender) === -1) {
        vm.chatContext.members.push(vm.sender);
      }
      vm.isReady = true;
    }
  } //chatRoomController
})();