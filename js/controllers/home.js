
var app = angular.module('fargoApp');
app.controller('HomeController', ['$scope', 'fargoGameService', '$state', function ($scope, fargoGameService, $state) {

    $scope.new_game = function () {
        var game = fargoGameService.create(10);
        $state.go('game', {
            id: game.uid
        });
    };

}]);
