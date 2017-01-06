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
    vm.txtMsg = '';
    vm.imgMsg = '';
    vm.sender = $scope.chatContext.sender;
    vm.members = $scope.chatContext.members;
    vm.msgList = [];
    vm.historyMsgList = [];
    vm.hasHistoryMsg = false;
    vm.sendTextMsg = sendTextMsg;
    vm.sendImgMsg = sendImgMsg;
    init();


    var conversationAPI;

    function init() {
      // 初始化存储 SDK
      AV.init({
        appId: 'a7722WJjRqpbSOQprmljvReW-gzGzoHsz', 
        appKey:'iI054CAWE8107qrX5m4aiXnX',
      });

      var Realtime = AV.Realtime;
      var realtime = new Realtime({
        appId: 'a7722WJjRqpbSOQprmljvReW-gzGzoHsz',
        region: 'cn', //美国节点为 "us"
        plugins: [AV.TypedMessagesPlugin], // 注册富媒体消息插件
      });

      // Tom 用自己的名字作为 clientId，获取 IMClient 对象实例
      realtime.createIMClient(vm.sender).then(function(clientObj) {
        // add message receive callback
        clientObj.on('message', receiveMsg);
        // 创建与Jerry之间的对话
        return clientObj.createConversation({
          members: vm.members,
          name: vm.members.join(" & "),
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
          console.log('最新的十条消息，按时间增序排列：', messages);
          $scope.$apply(function() {
            for (var i = 0; i < messages.length; i++) {
              vm.historyMsgList.push(composeMsg(messages[i], vm.sender));
              vm.hasHistoryMsg = true;
            }
          });
        }).catch(console.error.bind(console));
      });
    }

    function sendTextMsg() {
      // send 
      if (vm.txtMsg === '') {
        return;
      }
      conversationAPI.send(new AV.TextMessage(vm.txtMsg)).then(function(message) {
        console.log(vm.sender + ' send Message: ' + vm.txtMsg);
        vm.txtMsg = '';
        $scope.$apply(function() {
          vm.msgList.push(composeMsg(message));
        });
      }).catch(console.error);
    }

    function sendImgMsg() {
      // send 
      if (vm.imgMsg === '') {
        return;
      }

      var file = new AV.File.withURL('萌妹子', 'http://pic2.zhimg.com/6c10e6053c739ed0ce676a0aff15cf1c.gif');
      file.save().then(function() {
        var message = new AV.ImageMessage(file);
        message.setText('萌妹子一枚');
        return conversationAPI.send(message);
      }).then(function() {
        console.log('发送成功');
      }).catch(console.error.bind(console));
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