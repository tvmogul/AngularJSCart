var ytApp = angular.module('cat-video-demo', []);

ytApp.controller('SecondController', ['$scope', function ($scope) {
    'use strict';
}]);

ytApp.directive('youtube', function () {
    return {
        restrict: 'EA',
        scope: { code: '@code' },
        template: '<div style="height:400px;"><iframe style="overflow:hidden;height:420px;width:600px" width="600" height="420" src="http://www.youtube.com/embed/{{code}}" frameborder="0" allowfullscreen></iframe></div>'
    };
});