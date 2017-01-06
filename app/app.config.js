'use strict';

angular.
  module('bamaChat').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/single', {
          template: '<single-chat></single-chat>'
        }).
        when('/unreadmessages', {
          template: '<unread-messages></unread-messages>'
        }).
        otherwise('/single');
    }
  ]);
