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
    vm.apiNotReady = true; // if the leancloud API is ready to send message
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
        appKey: 'iI054CAWE8107qrX5m4aiXnX',
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
        vm.apiNotReady = false;
        conversationAPI.queryMessages({
          limit: 20, // limit 取值范围 1~1000，默认 20
        }).then(function(messages) {
          // 最新的十条消息，按时间增序排列
          console.log('最新的十条消息，按时间增序排列：', messages);
          $scope.$apply(function() {
            for (var i = 0; i < messages.length; i++) {
              vm.historyMsgList.push(composeMsg(messages[i]));
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

      var file = new AV.File.withURL('百度', 'http://img0.bdstatic.com/static/searchresult/img/logo-2X_b99594a.png');
      file.save().then(function() {
        var message = new AV.ImageMessage(file);
        message.setText('百度logo');
        return conversationAPI.send(message);
      }).then(function() {
        console.log('发送成功');
        vm.imgMsg = '';
      }).catch(console.error.bind(console));
    }

    function receiveMsg(message, conversation) {
      $scope.$apply(function() {
        vm.msgList.push(composeMsg(message));
      });
    }

    function composeMsg(message) {
      var msg = {
        hasImage: false
      };
      msg.id = message.id;
      msg.from = message.from;
      msg.isReceiver = !(msg.from === vm.sender);
      msg.text = msg.from + ' said:' + message.text;

      var file;
      switch (message.type) {
        case AV.TextMessage.TYPE:
          console.log('收到文本消息， text: ' + message.getText() + ', msgId: ' + message.id);
          break;
        case AV.FileMessage.TYPE:
          file = message.getFile(); // file 是 AV.File 实例
          console.log('收到文件消息，url: ' + file.url() + ', size: ' + file.metaData('size'));
          break;
        case AV.ImageMessage.TYPE:
          file = message.getFile();
          console.log('收到图片消息，url: ' + file.url() + ', width: ' + file.metaData('width'));
          msg.messageImageUrl = file.url();
          msg.hasImage = true;
          break;
        case AV.AudioMessage.TYPE:
          file = message.getFile();
          console.log('收到音频消息，url: ' + file.url() + ', width: ' + file.metaData('duration'));
          break;
        case AV.VideoMessage.TYPE:
          file = message.getFile();
          console.log('收到视频消息，url: ' + file.url() + ', width: ' + file.metaData('duration'));
          break;
        case AV.LocationMessage.TYPE:
          var location = message.getLocation();
          console.log('收到位置消息，latitude: ' + location.latitude + ', longitude: ' + location.longitude);
          break;
        default:
          if (message.content._lcfile.url) {
            messageContentText = message.content._lctext;
            messageImageUrl = message.content._lcfile.url;
          }
          console.warn('收到未知类型消息');
      }
      return msg;
    }
  } //chatBoardUIController
})();