(function() {
  'use strict';
  angular
    .module('unreadMessages')
    .directive('unreadMessages', unreadMessagesDirective);

  angular
    .module('unreadMessages')
    .controller('unreadMessagesController', unreadMessagesController);

  function unreadMessagesDirective() {
    return {
      templateUrl: 'unread-messages/unread-messages.template.html',
      controller: 'unreadMessagesController as vm'
    };
  }

  function unreadMessagesController($scope) {
    var vm = this;
    vm.startChat = startChat;    
    vm.chatContext = { sender: '', members: []};
    vm.isReady = false;
    vm.selectedConversationId = '';
    vm.unreadMsgConversationList = [];

    // ---------------------------------------------


    $scope.$watch('vm.chatContext', function() {
      vm.isReady = false;
      fetchUnreadMessageList();
    }, true);
    $scope.$watch('vm.selectedConversationId', function(newValue, oldValue) {
      if (newValue === oldValue) { return; }
      for (var i = vm.unreadMsgConversationList.length - 1; i >= 0; i--) {
        var item = vm.unreadMsgConversationList[i];
        if (item.conversation.id === newValue) {
          vm.chatContext.members = item.conversation.members;
          break;
        }
      }
    }, true);    

    function fetchUnreadMessageList(){
      if (vm.chatContext.sender === '') {
        return;
      }

      vm.unreadMsgConversationList = []; // clear old list      

      var Realtime = AV.Realtime;
      var TextMessage = AV.TextMessage;
      var realtime = new Realtime({
        appId: 'a7722WJjRqpbSOQprmljvReW-gzGzoHsz',
        region: 'cn', //美国节点为 "us"
      });
      // Tom 用自己的名字作为 clientId，获取 IMClient 对象实例
      realtime.createIMClient(vm.chatContext.sender).then(function(clientObj) {
        // add message receive callback
        clientObj.on('unreadmessages', function unreadMessagesEventHandler(payload, conversation) {
          //console.log(payload, conversation);
          $scope.$apply(function() {
            var item = {};
            item.payload = payload;
            item.conversation = conversation;
            item.displayText = '会话名称[' + conversation.name + ']: ' + payload.count + '条未读消息';
            item.conversationId = conversation.id;
            vm.unreadMsgConversationList.push(item);
          });
          console.log(vm.unreadMsgConversationList)
        })        
      });
    }

    function startChat(){      
      vm.isReady = true;
    }
  } //unreadMessagesController
})();