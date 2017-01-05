(function() {
  'use strict';
  angular
    .module('chatBoard')
    .directive('chatBoardUi', chatBoardUi);

  angular
    .module('chatBoard')
    .controller('chatBoardUIController', chatBoardUIController);

  function chatBoardUi() {
    return {
      templateUrl: 'chat-board/chat-board.template.html',
      scope: {
        chatContext: '='
      },
      controller: 'chatBoardUIController as vm'
    };
  }

  function chatBoardUIController($scope) {
    var vm = this;
    vm.title = 'chat';
    vm.sender = $scope.chatContext.sender;
    vm.receiver = $scope.chatContext.receiver;
    vm.msgList = [];
    vm.send = sendMsg;
    init();


    var conversationAPI;

    function init() {
      var Realtime = AV.Realtime;
      var TextMessage = AV.TextMessage;
      var realtime = new Realtime({
        appId: 'a7722WJjRqpbSOQprmljvReW-gzGzoHsz',
        region: 'cn', //美国节点为 "us"
      });

      // Tom 用自己的名字作为 clientId，获取 IMClient 对象实例
      realtime.createIMClient(vm.sender).then(function(clientObj) {
        // add message receive callback
        clientObj.on('message', receiveMsg);
        // 创建与Jerry之间的对话
        return clientObj.createConversation({
          members: [vm.receiver],
          name: 'Tom & Jerry',
          transient: false,
          unique: true
        });
      }).then(function(conversation) {
        // 发送消息API
        conversationAPI = conversation;
        conversation.queryMessages({
          limit: 10, // limit 取值范围 1~1000，默认 20
        }).then(function(messages) {
          // 最新的十条消息，按时间增序排列
          console.log(messages);
          for (var i = 0; i < messages.length; i++) {
            vm.msgList.push(composeMsg(messages[i], vm.sender));
          }
          $scope.$apply();
        }).catch(console.error.bind(console));
      });
    }

    function sendMsg() {
      // send 
      conversationAPI.send(new AV.TextMessage(vm.newMsg)).then(function(message) {
        console.log('Message sent: ', vm.newMsg, ' from ' + vm.sender);
        vm.msgList.push(composeMsg(message));
        vm.newMsg = '';
        $scope.$apply();
      }).catch(console.error);
    }

    function receiveMsg(message, conversation) {
      console.log('Message received: ', message.text, ' by ' + vm.sender);
      vm.msgList.push(composeMsg(message));
      $scope.$apply();
    }

    function composeMsg(message) {
      var msg = {};
      msg.id = message.id;
      msg.from = message.from;
      msg.text = msg.from + ' said:' + message.text;
      msg.isReceiver = !(msg.from === vm.sender);
      return msg;
    }
  } //chatBoardUIController
})();