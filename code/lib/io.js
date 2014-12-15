var io = require('socket.io');
var _ = require('underscore');
var deck = require('./deck');
var DAL = require('./dal');
var tables = require('./tabledecks');


function Io() {
    return {
        init: function(server) {
            var objServ = io.listen(server);
            var table = tables.createNewTable();
            objServ.sockets.on('connection', function(client) {
                // var playerInfo = DAL.db.users.find({_id:Object(client.id)})
                client.on('joinTable', function(args) {
                    var addedPlayer = table.addPlayer({
                        id: client.id,
                        cardSet: {
                            closed: true
                        },
                        playerInfo: args
                    }, client);
                    console.log('now player count is:' + table.getActivePlayers());
                    if (addedPlayer !== false) {
                        var newPlayer = {
                            id: client.id,
                            tableId: table.gid,
                            slot: addedPlayer.slot,
                            active: addedPlayer.active,
                            packed: addedPlayer.packed,
                            playerInfo: args,
                            cardSet: addedPlayer.cardSet,
                            otherPlayers: table.getPlayers()
                        };
                        client.emit('tableJoined', newPlayer);
                        client.broadcast.emit('newPlayerJoined', newPlayer);
                        startNewGameOnPlayerJoin();
                    }
                });
                client.emit('connectionSuccess', {
                    id: client.id,
                    tableId: table.gid
                });
                client.on('seeMyCards', function(args) {
                    console.log(args)
                    var cardsInfo = table.getCardInfo()[args.id].cards;
                    table.updateSideShow(args.id);
                    client.emit('cardsSeen', {
                        cardsInfo: cardsInfo,
                        players: table.getPlayers()
                    });
                    client.broadcast.emit('playerCardSeen', {
                        id: args.id,
                        players: table.getPlayers()
                    });
                });

                client.on('placePack', function(args) {
                    var players = table.packPlayer(args.player.id);
                    if (table.getActivePlayers() === 1) {
                        table.decideWinner();
                        client.emit('showWinner', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            packed: true

                        });
                        client.broadcast.emit('showWinner', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            packed: true
                        });
                        table.stopGame();
                        startNewGame();

                    } else {
                        client.emit('playerPacked', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                        client.broadcast.emit('playerPacked', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                    }


                });

                function startNewGameOnPlayerJoin() {
                    if (table.getPlayersCount() >= 2 && !table.gameStarted) {
                        setTimeout(function() {
                            client.emit('gameCountDown', {
                                counter: 7
                            });
                            client.broadcast.emit('gameCountDown', {
                                counter: 7
                            });
                        }, 1000);
                        setTimeout(function() {
                            if (table.getPlayersCount() >= 2 && !table.gameStarted) {
                                table.startGame();
                                var sentObj = {
                                    players: table.getPlayers(),
                                    table: table.getTableInfo()
                                };
                                client.emit('startNew', sentObj);
                                client.broadcast.emit('startNew', sentObj);
                            } else if (table.getPlayersCount() == 1 && !table.gameStarted) {
                                client.emit('notification', {
                                    message: 'Please wait for more players to join',
                                    timeout: 4000
                                });
                                client.broadcast.emit('notification', {
                                    message: 'Please wait for more players to join',
                                    timeout: 4000
                                });
                            }
                        }, 9000);
                    } else if (table.getPlayersCount() == 1 && !table.gameStarted) {
                        client.emit('notification', {
                            message: 'Please wait for more players to join',
                            timeout: 4000
                        });
                        client.broadcast.emit('notification', {
                            message: 'Please wait for more players to join',
                            timeout: 4000
                        });
                    }
                }

                function startNewGame(after) {
                    if (table.getPlayersCount() >= 2 && !table.gameStarted) {
                        setTimeout(function() {
                            client.emit('gameCountDown', {
                                counter: 9
                            });
                            client.broadcast.emit('gameCountDown', {
                                counter: 9
                            });
                        }, after || 6000);
                        setTimeout(function() {
                            if (table.getPlayersCount() >= 2 && !table.gameStarted) {
                                table.startGame();
                                var sentObj = {
                                    players: table.getPlayers(),
                                    table: table.getTableInfo()
                                };
                                client.emit('startNew', sentObj);
                                client.broadcast.emit('startNew', sentObj);
                            } else if (table.getPlayersCount() == 1) {
                                client.emit('notification', {
                                    message: 'Please wait for more players to join',
                                    timeout: 4000
                                });
                                client.broadcast.emit('notification', {
                                    message: 'Please wait for more players to join',
                                    timeout: 4000
                                });
                                // setTimeout(function() {
                                table.reset();
                                var sentObj = {
                                    players: table.getPlayers(),
                                    table: table.getTableInfo()
                                };
                                client.emit('resetTable', sentObj);
                                client.broadcast.emit('resetTable', sentObj);
                                // }, 7000);
                            }
                        }, 13000);
                    } else if (table.getPlayersCount() == 1) {
                        setTimeout(function() {
                            client.emit('notification', {
                                message: 'Please wait for more players to join',
                                timeout: 4000
                            });
                            client.broadcast.emit('notification', {
                                message: 'Please wait for more players to join',
                                timeout: 4000
                            });
                        }, 4000);
                        setTimeout(function() {
                            table.reset();
                            var sentObj = {
                                players: table.getPlayers(),
                                table: table.getTableInfo()
                            };
                            client.emit('resetTable', sentObj);
                            client.broadcast.emit('resetTable', sentObj);
                        }, 4000);
                    }
                }

                client.on('placeBet', function(args) {

                    var players = table.placeBet(args.player.id, args.bet.amount, args.bet.blind, args.player.playerInfo._id);
                    if (args.bet.show || table.isPotLimitExceeded()) {
                        args.bet.show = true;
                        var msg = table.decideWinner(args.bet.show);
                        client.emit('showWinner', {
                            message: msg,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            potLimitExceeded: table.isPotLimitExceeded()
                        });
                        client.broadcast.emit('showWinner', {
                            message: msg,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            potLimitExceeded: table.isPotLimitExceeded()
                        });
                        table.stopGame();
                        startNewGame();
                    } else {
                        client.emit('betPlaced', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()

                        });
                        client.broadcast.emit('betPlaced', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                    }
                });

                client.on('respondSideShow', function(args) {
                    var players = table.getPlayers(),
                        msg = "";
                    table.resetSideShowTurn();
                    if (args.lastAction === "Denied") {
                        table.setNextPlayerTurn();
                        table.sideShowDenied(args.player.id);
                        msg = [args.player.playerInfo.userName, ' has denied side show'].join('');
                        client.emit('sideShowResponded', {
                            message: msg,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                        client.broadcast.emit('sideShowResponded', {
                            message: msg,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });

                    } else if (args.lastAction === "Accepted") {
                        table.setNextPlayerTurn();
                        msg = table.sideShowAccepted(args.player.id);
                        client.emit('sideShowResponded', {
                            message: msg.message,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                        client.broadcast.emit('sideShowResponded', {
                            message: msg.message,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                    }
                });
                client.on('placeSideShow', function(args) {
                    var sideShowMessage = table.placeSideShow(args.player.id, args.bet.amount, args.bet.blind, args.player.playerInfo._id);
                    var players = table.getPlayers();
                    if (table.isPotLimitExceeded()) {
                        args.bet.show = true;
                        var msg = table.decideWinner(args.bet.show);
                        client.emit('showWinner', {
                            message: msg,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            potLimitExceeded: table.isPotLimitExceeded()
                        });
                        client.broadcast.emit('showWinner', {
                            message: msg,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            potLimitExceeded: table.isPotLimitExceeded()
                        });
                        table.stopGame();
                        startNewGame();
                    } else {
                        client.emit('sideShowPlaced', {
                            message: sideShowMessage,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()

                        });
                        client.broadcast.emit('sideShowPlaced', {
                            message: sideShowMessage,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                    }
                });

                client.on('disconnect', function() {
                    if (table.gameStarted && table.isActivePlayer(client.id)) {
                        table.packPlayer(client.id);
                    }
                    var removedPlayer = table.removePlayer(client.id);
                    console.log('disconnect for ' + client.id);
                    console.log('total players left:' + table.getActivePlayers());
                    client.broadcast.emit('playerLeft', {
                        bet: {
                            lastAction: "Packed",
                            lastBet: ""
                        },
                        removedPlayer: removedPlayer,
                        placedBy: removedPlayer.id,
                        players: table.getPlayers(),
                        table: table.getTableInfo()
                    });
                    if (table.getActivePlayers() == 1 && table.gameStarted) {
                        table.decideWinner();
                        client.emit('showWinner', {
                            bet: {
                                lastAction: "Packed",
                                lastBet: ""
                            },
                            placedBy: removedPlayer.id,
                            players: table.getPlayers(),
                            table: table.getTableInfo(),
                            packed: true

                        });
                        client.broadcast.emit('showWinner', {
                            bet: {
                                lastAction: "Packed",
                                lastBet: ""
                            },
                            placedBy: removedPlayer.id,
                            players: table.getPlayers(),
                            table: table.getTableInfo(),
                            packed: true
                        });
                        table.stopGame();
                        startNewGame();
                    }
                });
            });

        }
    }

}
module.exports = new Io();