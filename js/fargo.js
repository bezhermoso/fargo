'use strict';

var fargo = angular.module('fargo', ['ngStorage']);

var FargoGame = function (innings) {
    this.innings = innings ? innings : 10;
    this.uid = moment().format('X');
    this.players = [];
    this.racks = [];
    this.started = false;
    this.rack = null;
    this.complete = false;

    var self = this;

    this.new_player = function (name) {
        var player = new Player(name);
        this.players.push(player);
        return player;
    };

    this.new_rack = function () {
        if (this.rack) {
            this.racks.push(this.rack);
        }
        var rack = new Rack(self.players[self.racks.length % self.players.length]);
        this.rack = rack;
        return rack;
    };

    this.pot = function (balls) {

        if (this.rack.complete) {
            return false;
        }
        this.rack.pot(balls);

        if (this.rack.complete) {
            this.end_rack();
        }
    };

    this.end_rack = function () {
        this.rack.complete = true;
        if (this.players.length * this.innings <= (this.racks.length + 1)) {
            this.end();
        }
    };

    this.end = function () {
        this.complete = true;
        this.racks.push(this.rack);
    };

    this.remove_player = function (id) {
        for (var i in this.players) {
            if (this.players[i].id == id) {
                this.players.splice(i, 1);
            }
        }
    };
};

var Player = function (name) {
    this.id = moment().format('X');
    this.name = name;
}

var Rack = function (player) {
    this.uid = moment().format('X');
    this.rotation_mode = false;
    this.random_balls = 0;
    this.rotation_balls = 0;
    this.pot = function (balls) {
        if (this.rotation_mode == true) {
            this.rotation_balls += balls;
        } else {
            this.random_balls += balls;
        }
        this.score = (this.rotation_balls * 2) + this.random_balls;
        this.complete = (this.rotation_balls + this.random_balls == 15);
    };
    this.complete = false;
    this.score = 0;
    this.player = player;
};

fargo.factory('fargoGameService', ['$localStorage', function ($localStorage) {

    $localStorage.$default({
        games: {}
    });

    var fargoGameService = {
        create: function (innings) {
            var game = new FargoGame(innings);
            $localStorage.games[game.uid] = game;
            return game;
        },
        find: function (id) {
            if ($localStorage.games[id]) {
                var data = $localStorage.games[id];
                for (var i in data.players) {
                    data.players[i] = angular.extend(new Player(''), data.players[i]);
                }
                for (var i in data.racks) {
                    data.racks[i] = angular.extend(new Rack(angular.extend(new Player(), data.racks[i].player)), data.racks[i]);
                }
                if (data.rack) {
                    data.rack = angular.extend(new Rack(angular.extend(new Player(), data.rack.player)), data.rack);
                }
                var game = angular.extend(new FargoGame(10), data);
                console.log(game);
                return game;
            }
            return null;
        },
        save: function (game) {
            $localStorage.games[game.uid] = game;
        }
    };

    return fargoGameService;

}]);