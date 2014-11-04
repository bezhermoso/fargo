
var app = angular.module('fargoApp');
app.controller('GameController', ['$scope', '$stateParams', 'fargoGameService', function ($scope, $stateParams, fargoGameService) {

    $scope.game = fargoGameService.find($stateParams.id);
    $scope.innings = 10;
    $scope.player_name = 'Player 1';
    $scope.add_player = function () {
        $scope.game.new_player($scope.player_name);
        $scope.player_name = 'Player ' + ($scope.game.players.length + 1);
        fargoGameService.save($scope.game);
    };

    $scope.remove_player = function (id) {
        $scope.game.remove_player(id);
        fargoGameService.save($scope.game);
    };

    $scope.start = function () {
        $scope.game.started = true;
        $scope.game.innings = $scope.innings;
        var rack = $scope.game.new_rack();
        fargoGameService.save($scope.game);
    };

    $scope.end_rack = function () {
        $scope.game.end_rack();
        if ($scope.game.complete) {
            return;
        }
        $scope.game.new_rack();
        fargoGameService.save($scope.game);
    }

    $scope.start_rotation = function() {
        $scope.game.rack.rotation_mode = true;
        fargoGameService.save($scope.game);
    }

    $scope.pot = function () {
        $scope.game.pot(1);
        fargoGameService.save($scope.game);
    };
}]);
