var _ = require('underscore');
var utils = require('./base/utils');
var DAL = require('./dal');
var deck = require('./deck');
var cardComparer = require('./cardComparer');

function Table(boot) {

    this.gid = utils.guid();
    this.gameStarted = false;
    var maxPlayers = 5;
    var players = {};
    var clients = {};
    var tableInfo;
    var cardsInfo = {};

    var avialbleSlots = {
        "slot1": "slot1",
        "slot2": "slot2",
        "slot3": "slot3",
        "slot4": "slot4",
        "slot5": "slot5"
    };

    this.resetTable = function() {
        var iBoot = boot || 1000;
        tableInfo = {
            boot: iBoot,
            lastBet: iBoot,
            lastBlind: true,
            maxBet: iBoot * Math.pow(2, 7),
            potLimit: iBoot * Math.pow(2, 11),
            showAmount: true
        };
    }
    this.getPlayers = function() {
        return players;
    };
    this.getPlayersCount = function() {
        return _.size(players);
    }

    this.getTableInfo = function() {
        tableInfo.isShowAvailable = this.getActivePlayers() === 2;
        return tableInfo;
    }
    this.isPotLimitExceeded = function() {
        if (tableInfo.amount) {
            return tableInfo.amount > tableInfo.potLimit;
        }
        return false;
    }

    this.addPlayer = function(player, client) {
        if (this.getActivePlayers() <= maxPlayers) {
            for (var slot in avialbleSlots) {
                player.slot = slot;
            }
            players[player.id] = player;
            clients[player.id] = client;
            players[player.id].active = !this.gameStarted;
            delete avialbleSlots[player.slot];
            return player;
        }
        return false;
    };
    this.removePlayer = function(id) {
        if (id && players[id]) {
            var player = players[id];
            avialbleSlots[player.slot] = player.slot;
            delete cardsInfo[id];
            delete players[id];
            delete clients[id];
            return player;
        }
    };

    this.getPlayerBySlot = function(slot) {
        for (var player in players) {
            if (players[player].slot === slot) {
                return players[player];
            }
        }
        return undefined;
    }
    this.getPrevActivePlayer = function(id) {
        var slot = players[id].slot,
            num = slot.substr(4) * 1;
        for (var count = 0; count <= 4; count++) {
            num--;
            if (num === 0) {
                num = 5;
            }
            if (avialbleSlots["slot" + num]) {
                continue;
            }
            if (this.getPlayerBySlot("slot" + num)) {
                if (!this.getPlayerBySlot("slot" + num).active || this.getPlayerBySlot("slot" + num).packed) {
                    continue;
                } else {
                    break;
                }
            }
        }

        var newPlayer = this.getPlayerBySlot("slot" + num);
        return newPlayer;
    }
    this.getNextActivePlayer = function(id) {
        var slot = players[id].slot,
            num = slot.substr(4) * 1;
        for (var count = 0; count <= 4; count++) {
            num++;
            if (num > 5) {
                num = num % 5;
            }
            if (avialbleSlots["slot" + num]) {
                continue;
            }
            if (this.getPlayerBySlot("slot" + num)) {
                if (!this.getPlayerBySlot("slot" + num).active || this.getPlayerBySlot("slot" + num).packed) {
                    continue;
                } else {
                    break;
                }
            }
        }

        var newPlayer = this.getPlayerBySlot("slot" + num);
        return newPlayer;
    }

    this.getNextSlotForTurn = function(id) {
        players[id].turn = false;
        var newPlayer = this.getNextActivePlayer(id);
        newPlayer.turn = true;
    }
    this.isActivePlayer = function(id) {
        return players[id] && players[id].active;
    }
    this.packPlayer = function(id) {

        players[id].packed = true;
        this.getNextSlotForTurn(id);
        return this.getPlayers();
    }
    this.placeBetOnly = function(id, bet, blind) {
        tableInfo.amount += bet;
        tableInfo.lastBet = bet;
        players[id].playerInfo.chips -= bet;
        console.log('user updating result: ' + players[id].playerInfo._id);
        DAL.db.users.update({
            userName: players[id].playerInfo.userName
        }, {
            $set: {
                chips: players[id].playerInfo.chips
            }
        }, function(err, result) {
            console.log('user update result: ' + result);
        });
        tableInfo.lastBlind = blind;
    }
    this.placeBet = function(id, bet, blind) {
        this.placeBetOnly(id, bet, blind);
        this.getNextSlotForTurn(id);
        return this.getPlayers();
    };
    this.getActionTurnPlayer = function() {
        var activePlayer;
        for (var player in players) {
            if (players[player].turn) {
                activePlayer = players[player];
                break;
            }
        }
        return activePlayer;
    }

    this.resetSideShowTurn = function() {
        for (var player in players) {
            players[player].sideShowTurn = false;
        }
    }
    this.sideShowDenied = function(id) {
        players[id].lastAction = 'Denied';
        return [players[id].playerInfo.userName, ' has denied the request'].join('');
    }
    this.sideShowAccepted = function(id) {
        players[id].lastAction = 'Accepted';
        var nextPlayer = this.getNextActivePlayer(id);
        var cardsToCompare = [{
            id: id,
            set: cardsInfo[id].cards
        }, {
            id: nextPlayer.id,
            set: cardsInfo[nextPlayer.id].cards
        }];
        var result = cardComparer.getGreatest(cardsToCompare),
            cardsToShow = {};
        cardsToShow[id] = {
            cardSet: cardsInfo[id].cards
        };
        cardsToShow[nextPlayer.id] = {
            cardSet: cardsInfo[nextPlayer.id].cards
        };
        if (result.id === id) {
            nextPlayer.packed = true;
        } else {
            players[id].packed = true;
        }
        return {
            message: [players[result.id].playerInfo.userName, ' has won the side show'].join(''),
            cardsToShow: cardsToShow
        }
    };

    this.setNextPlayerTurn = function() {
        var activeTurnPlayer = this.getActionTurnPlayer();
        this.getNextSlotForTurn(activeTurnPlayer.id);
    }
    this.placeSideShow = function(id, bet, blind) {
        this.placeBetOnly(id, bet, blind);
        var message = this.setPlayerForSideShow(id);
        return message;
    }
    this.setPlayerForSideShow = function(id) {
        var prevPlayer = this.getPrevActivePlayer(id);
        prevPlayer.sideShowTurn = true;
        return [players[id].playerInfo.userName, ' asking for side show'].join('');
    }

    this.stopGame = function() {
        this.gameStarted = false;
        tableInfo.gameStarted = false;
    }

    this.collectBootAmount = function() {
        var bootAmount = 0;
        for (var player in players) {
            if (players[player].active) {
                players[player].lastBet = tableInfo.boot;
                players[player].lastAction = "";
                bootAmount = bootAmount + tableInfo.boot;
                players[player].playerInfo.chips -= tableInfo.boot;
                DAL.db.users.update({
                    userName: players[player].playerInfo.userName
                }, {
                    $set: {
                        chips: players[player].playerInfo.chips
                    }
                }, function(err, result) {
                    console.log('user update result: ' + result);
                });
            }
        }
        tableInfo.amount = bootAmount;
    }
    this.getCardInfo = function() {
        return cardsInfo;
    }
    this.updateSideShow = function(id) {
        var nextPlayer = this.getNextActivePlayer(id);
        if (nextPlayer) {
            nextPlayer.isSideShowAvailable = true;
        }
    }

    function distributeCards() {
        deck.shuffle();
        var deckCards = deck.getCards(),
            index = 0;
        for (var i = 0; i < 3; i++) {
            for (var player in players) {
                if (players[player].active) {
                    if (!cardsInfo[players[player].id]) {
                        cardsInfo[players[player].id] = {};
                    }
                    if (!cardsInfo[players[player].id].cards) {
                        cardsInfo[players[player].id].cards = [];
                    }
                    cardsInfo[players[player].id].cards.push(deckCards[index++]);
                }
            }
        }
    }

    this.getActivePlayers = function() {
        var count = 0;
        for (var player in players) {
            if (players[player].active && !players[player].packed) {
                count++;
            }
        }
        return count;
    }
    this.resetAllPlayers = function() {
        for (var player in players) {
            delete players[player].winner;
            players[player].turn = false;
            players[player].active = true;
            players[player].packed = false;
            players[player].isSideShowAvailable = false;
            players[player].cardSet = {
                closed: true
            };
            players[player].lastBet = "";
            players[player].lastAction = "";
        }
    }
    this.decideWinner = function(showCards) {

        var cardSets = [],
            winnerCard,
            msg = "";
        for (var player in players) {
            players[player].turn = false;
            if (players[player].active && !players[player].packed) {
                if (showCards) {
                    players[player].cardSet.cards = cardsInfo[players[player].id].cards;
                    players[player].cardSet.closed = false;
                }
                cardSets.push({
                    id: players[player].id,
                    set: cardsInfo[players[player].id].cards
                });
            }
        }

        if (cardSets.length === 1) {
            winnerObj = players[cardSets[0].id];
        } else {
            winnerCard = cardComparer.getGreatest(cardSets);
            winnerObj = players[winnerCard.id];
        }
        winnerObj.winner = true;
        winnerObj.playerInfo.chips += tableInfo.amount;
        DAL.db.users.update({
            userName: winnerObj.playerInfo.userName
        }, {
            $set: {
                chips: winnerObj.playerInfo.chips
            }
        }, function(err, result) {
            console.log('user update result: ' + result);
        });
        if (winnerCard) {
            return [winnerObj.playerInfo.userName, ' won with ', winnerCard.typeName].join('');
        }
        return undefined
    }
    this.reset = function() {
        cardsInfo = {};
        this.resetTable();
        this.resetAllPlayers();
    }
    this.decideDeal = function() {
        var firstPlayer = null,
            dealFound = false,
            isFirst = true,
            dealPlayer;
        for (var player in players) {
            if (players[player].active) {

                if (isFirst) {
                    firstPlayer = players[player];
                    isFirst = false;
                }
                if (players[player].deal === true) {
                    players[player].deal = false;
                    dealPlayer = players[player];
                    dealFound = true;
                }
            }
        }
        if (!dealFound) {
            firstPlayer.deal = true;
        } else {
            var nextPlayer = this.getNextActivePlayer(dealPlayer.id);
            nextPlayer.deal = true;
        }
    }
    this.decideTurn = function() {
        var firstPlayer = null,
            dealFound = false,
            isFirst = true,
            dealPlayer;
        for (var player in players) {

            if (players[player].active) {
                if (isFirst) {
                    firstPlayer = players[player];
                    isFirst = false;
                }
                if (players[player].deal === true) {
                    dealPlayer = players[player];
                    dealFound = true;
                }
            }
        }
        if (!dealFound) {
            firstPlayer.turn = true;
        } else {
            var nextPlayer = this.getNextActivePlayer(dealPlayer.id);
            nextPlayer.turn = true;
        }
    }
    this.startGame = function() {
        cardsInfo = {};
        this.resetTable();
        this.resetAllPlayers();
        this.gameStarted = true;
        tableInfo.gameStarted = true;
        this.decideDeal();
        this.decideTurn();
        tableInfo.isShowAvailable = this.getActivePlayers() === 2;
        tableInfo.isSideShowAvailable = false;
        this.collectBootAmount();
        distributeCards();

    }
    this.resetTable();
    return this;

}


function TableManager() {
    var tables = [];

    return {
        createNewTable: function(boot) {
            var table = new Table(boot);
            tables.push(table);
            return table;
        },
        getTable: function(guid) {
            var result = _.where(tables, {
                guid: guid
            });
            if (result.length !== 0) {
                return result[0];
            }
            return null;
        },
        getTableByBoot: function(boot) {

        },

        startCountDown: function(secs) {

        },

        startGame: function() {

        }
    }
}


module.exports = new TableManager();