'use strict';
angular.module('teenPatti', [
    'teenPatti.controllers',
    'teenPatti.services',
    'teenPatti.directives',
    'ui.router',
    'ui.bootstrap'
])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise("/");
            //
            // Now set up the states
            $stateProvider
                .state('startup', {
                    url: "/startup",
                    templateUrl: "/startup/page",
                    controller: 'startUp'
                })
                .state('gamemenu', {
                    url: "/gamemenu",
                    templateUrl: "/gamemenu/page",
                    controller: 'gameMenu'
                })
                .state('gameplay', {
                    url: "/gameplay",
                    templateUrl: "gameplay/page",
                    controller: 'gamePlay'
                });
            // $urlRouterProvider.rule(function($injector, $location) {

            // });
        }
    ]);
angular.module('teenPatti.controllers', []);
angular.module('teenPatti.directives', []);
angular.module('teenPatti.services', []);
angular.module('teenPatti.controllers').controller('teenPattiCtrl', ['$scope', 'cardService',
    function($scope, cardService) {



    }
]);
angular.module('teenPatti.directives').directive('tableDealer', [

    function() {
        return {
            scope: {
                dealer: '='
            },
            templateUrl: 'table.dealer.html',
            link: function(scope, element, attrs) {

            }
        }


    }
]);
angular.module('teenPatti.directives').directive('playingCardsSet', [

    function() {
        return {
            scope: {
                player: '=',
                cardSet: '=',
                slot: '=',
                seeMyCards: '&seeMyCards'
            },
            templateUrl: 'playing.card.set.html',
            link: function(scope, element, attrs) {
                var lmargin = attrs.lmargin || 30;
                lmargin = lmargin * 1;
                scope.getCardStyle = function($index, data) {
                    var idx = $index + 1;
                    return {
                        'left': (-20 + idx * lmargin) + idx * 2,
                        'transform': ' rotate(' + ((-43 + (idx * 1) * 25) - idx * 5) + 'deg)'
                    };
                }
            }
        }
    }
]);
angular.module('teenPatti.directives').directive('playingCard', [

    function() {
        return {
            scope: {
                card: '='
            },
            templateUrl: 'playing.card.html',
            link: function(scope, element, attrs) {}
        }


    }
]);
angular.module('teenPatti.directives').directive('sidePlayer', ['$filter',

    function($filter) {
        return {
            scope: {
                table: '=',
                player: '='
            },
            templateUrl: 'side.player.html',
            link: function(scope, element, attrs) {
                function doAnimation(args, reverse) {

                    var animateDiv = $('<div  class="animate-bet alert alert-warning">$' + $filter('number')(args.amount) + '</div>').appendTo("body")
                    var animateTo = $(".table-bet").offset();
                    var animateFrom = $(element).find(".side-player-outer").offset();
                    animateFrom.top += 20;
                    animateFrom.left += 10;
                    animateTo.left += 10;
                    animateTo.top += 10;
                    if (reverse) {
                        var temp = animateFrom;
                        animateFrom = animateTo;
                        animateTo = temp;
                    }
                    animateDiv.css(animateFrom);
                    animateDiv.fadeIn(function() {
                        animateDiv.animate(animateTo, args.timeout || 2000, function() {
                            animateDiv.fadeOut(function() {
                                animateDiv.remove();
                                if (args.callback && typeof(args.callback) === 'function') {
                                    args.callback();
                                }
                            });
                        });
                    });
                }
                scope.$on('performBetAnimation', function(evt, args) {
                    if (scope.player && scope.player.turn) {
                        doAnimation({
                            amount: args.bet,
                            timeout: args.timeout
                        });
                    }
                });
                scope.$on('performWinnerAnimation', function(evt, args) {
                    if (scope.player && scope.player.winner) {
                        doAnimation({
                            amount: args.bet,
                            timeout: args.timeout,
                            callback: args.callback
                        }, true);
                    }
                });
                scope.$on('performBootAnimation', function(evt, args) {
                    if (scope.player && scope.player.active) {
                        doAnimation({
                            amount: args.boot,
                            timeout: args.timeout
                        });
                    }
                });
            }
        }


    }
]);
angular.module('teenPatti.directives').directive('mainPlayer', ['$filter',

    function($filter) {
        var BLIND_ALLOWED = 4;
        return {
            scope: {
                player: '=',
                table: '=',
                seeMyCards: '&seeMyCards',
                placeBet: '&placeBet',
                placePack: '&placePack',
                placeSideShow: '&placeSideShow',
                respondSideShow: '&respondSideShow'
            },
            templateUrl: 'main.player.html',
            link: function(scope, element, attrs) {

                function doAnimation(args, reverse) {
                    var animateDiv = $('<div class="animate-bet alert alert-warning">$' + $filter('number')(args.amount) + '</div>').appendTo("body")
                    var animateTo = $(".table-bet").offset();
                    var animateFrom = $(element).find(".current-player-outer").offset();
                    animateFrom.top += 20;
                    animateFrom.left += 100;
                    animateTo.left += 10;
                    animateTo.top += 10;
                    if (reverse) {
                        var temp = animateFrom;
                        animateFrom = animateTo;
                        animateTo = temp;
                    }
                    animateDiv.css(animateFrom);
                    animateDiv.fadeIn(function() {
                        animateDiv.animate(animateTo, args.timeout || 2000, function() {
                            animateDiv.fadeOut(function() {
                                animateDiv.remove();
                                if (args.callback && typeof(args.callback) === 'function') {
                                    args.callback();
                                }
                            });
                        });
                    });
                }

                scope.$on('performBetAnimation', function(evt, args) {
                    if (scope.player && scope.player.turn) {
                        doAnimation({
                            amount: args.bet,
                            timeout: args.timeout
                        });
                    }
                });
                scope.$on('performWinnerAnimation', function(evt, args) {
                    if (scope.player && scope.player.winner) {
                        doAnimation({
                            amount: args.bet,
                            timeout: args.timeout,
                            callback: args.callback
                        }, true);
                    }
                });

                scope.$on('performBootAnimation', function(evt, args) {
                    if (scope.player && scope.player.active) {
                        doAnimation({
                            amount: args.boot,
                            timeout: args.timeout
                        });
                    }

                });

                scope.disableActions = false;
                scope.pack = function() {
                    scope.player.lastAction = "Packed";
                    scope.player.lastBet = "";
                    scope.player.packed = true;
                    scope.disableActions = true;
                    scope.placePack();
                }

                scope.blind = function() {
                    scope.table.lastBlind = true;
                    scope.table.lastBet = scope.possibleBet;
                    scope.player.lastAction = "Blind";
                    scope.player.lastBet = scope.possibleBet;
                    scope.disableActions = true;
                    scope.blindCount++;
                    scope.placeBet();
                }

                scope.chaal = function() {
                    scope.player.lastAction = "Chaal";
                    scope.player.lastBet = scope.possibleBet;
                    scope.table.lastBlind = false;
                    scope.table.lastBet = scope.possibleBet;
                    scope.placeBet();
                    scope.disableActions = true;
                }

                scope.show = function() {
                    scope.player.lastAction = "Show";
                    scope.player.lastBet = scope.possibleBet;
                    scope.table.lastBlind = scope.player.cardSet.closed;
                    scope.table.lastBet = scope.possibleBet;
                    scope.player.show = true;
                    scope.placeBet();
                    scope.disableActions = true;
                }
                scope.sideshow = function() {
                    scope.player.lastAction = "Side Show";
                    scope.table.lastBlind = false;
                    scope.table.lastBet = scope.possibleBet;
                    scope.player.sideshow = true;
                    scope.disableActions = true;
                    scope.placeSideShow();
                }
                scope.acceptSideShow = function() {
                    scope.player.lastAction = "Accepted";
                    scope.respondSideShow();
                }
                scope.denySideShow = function() {
                    scope.player.lastAction = "Denied";
                    scope.respondSideShow();
                }
                scope.$watch('table', function(newVal) {
                    if (newVal) {
                        updatePossibleBet();
                        updateButtons();
                    }
                });

                function setInitialValues() {
                    scope.blindCount = 0;
                }

                scope.$on('startNew', function(args) {
                    if (scope.player && scope.player.active) {
                        setInitialValues();
                    }
                });
                scope.$watch('player.turn', function(newVal) {
                    if (newVal === false) {
                        scope.disableActions = false;
                    } else {
                        if (scope.blindCount >= BLIND_ALLOWED) {
                            scope.seeMyCards();
                        }
                    }
                });
                scope.$watch('player.cardSet.closed', function(newVal) {
                    if (newVal === false) {
                        updatePossibleBet();
                    }
                });
                scope.changeBet = function(type) {
                    switch (type) {
                        case '-':
                            scope.possibleBet = scope.possibleBet / 2;
                            break;
                        case '+':
                            scope.possibleBet = scope.possibleBet * 2;
                            break;
                    }
                    updateButtons();
                }

                function updatePossibleBet() {
                    scope.possibleBet = getLastBet();
                    updateButtons();
                }

                function updateButtons() {
                    var minBet = getLastBet();
                    scope.disableMinus = (scope.possibleBet == minBet) || !(scope.possibleBet > minBet);
                    scope.disablePlus = ((scope.possibleBet == minBet * 2) && (scope.possibleBet <= scope.table.maxBet)) || (scope.possibleBet >= scope.table.maxBet / 2 && scope.player.cardSet.closed) || (scope.possibleBet >= scope.table.maxBet && !scope.player.cardSet.closed);
                }

                scope.plus = function() {
                    scope.changeBet('+');
                }
                scope.minus = function() {
                    scope.changeBet('-');
                }

                function getLastBet() {
                    if (scope.player.cardSet.closed) {
                        if (scope.table.lastBlind == true) {
                            return scope.table.lastBet;
                        } else {
                            return scope.table.lastBet / 2;
                        }
                    } else {
                        if (scope.table.lastBlind == true) {
                            return scope.table.lastBet * 2;
                        } else {
                            return scope.table.lastBet;
                        }
                    }
                }
                setInitialValues();
            }
        }
    }
]);
angular.module('teenPatti.directives').directive('tableNotifications', [

    function() {
        return {
            scope: {
                showMessage: '=',
                message: '=',
                eventOn: '='
            },
            templateUrl: 'table.notifications.html',
            link: function(scope, element, attrs) {
                scope.$watch('showMessage', function(newVal, oldVal) {
                    if (newVal === true) {
                        element.find('.text-message').fadeIn('slow');
                    } else if (newVal === false) {
                        element.find('.text-message').fadeOut('slow');
                    } else {
                        element.find('.text-message').hide();
                    }
                });
            }
        }


    }
]);
angular.module('teenPatti.directives').directive('tableBet', [

    function() {
        return {
            scope: {
                table: '='
            },
            templateUrl: 'table.bet.html',
            link: function(scope, element, attrs) {
                scope.$watch('table.showAmount', function(newVal) {
                    if (newVal === true) {
                        fadeInBet();
                    } else if (newVal === false) {
                        fadeOutBet();
                    }
                });

                function fadeOutBet() {
                    var $betInfo = element.find('.bet-info');
                    $betInfo.fadeOut();
                }

                function fadeInBet() {
                    var $betInfo = element.find('.bet-info');
                    $betInfo.fadeIn();
                }

                scope.$on('performWinnerAnimation', function() {
                    fadeOutBet();
                });
            }
        }


    }
]);
angular.module('teenPatti.directives').directive('tableInfo', [

    function() {
        return {
            scope: {
                table: '='
            },
            templateUrl: 'table.info.html',
            link: function(scope, element, attrs) {

            }
        }


    }
]);
angular.module('teenPatti.controllers').controller('gamePlay', ['$rootScope', '$filter', '$scope', 'cardService',
    function($rootScope, $filter, $scope, cardService) {
        var socket;
        if ($rootScope.userInfo) {
            socket = io.connect(window.location.protocol + "//" + window.location.hostname + (window.location.port!=80?":"+window.location.port:"" ) );
            initSocketEvents();
        }
        $scope.currentPlayer = {};
        $scope.seatingInfo = {};
        $scope.seatingInfoById = {};
        $scope.dealSeat = "";
        $scope.currentTurn = ""; 
        $scope.seeMyCards = function() {
            socket.emit('seeMyCards', $scope.currentPlayer);
        }
        $scope.placeBet = function() {

            socket.emit('placeBet', {
                player: $scope.currentPlayer,
                bet: {
                    action: $scope.currentPlayer.lastAction,
                    amount: $scope.table.lastBet,
                    blind: $scope.table.lastBlind,
                    show: $scope.currentPlayer.show
                }
            });
            $scope.currentPlayer.playerInfo.chips -= $scope.table.lastBet;
        }
        $scope.placeSideShow = function() {

            socket.emit('placeSideShow', {
                player: $scope.currentPlayer,
                bet: {
                    action: $scope.currentPlayer.lastAction,
                    amount: $scope.table.lastBet,
                    blind: $scope.table.lastBlind,
                    show: $scope.currentPlayer.show
                }
            });
            $scope.currentPlayer.playerInfo.chips -= $scope.table.lastBet;
        }
        $scope.respondSideShow = function() {
            socket.emit('respondSideShow', {
                player: $scope.currentPlayer,
                lastAction: $scope.currentPlayer.lastAction
            });
        }
        $scope.placePack = function() {
            socket.emit('placePack', {
                player: $scope.currentPlayer,
                bet: {
                    action: $scope.currentPlayer.lastAction,
                    amount: "",
                    blind: false
                }
            });
        }

        function getNextSeat(slot) {
            var slotNum = slot.substr(4) * 1,
                seat = 1,
                currentPlayerSlot = $scope.currentPlayer.slot.substr(4) * 1,
                nextSlot = currentPlayerSlot;

            for (var iC = 0; iC < 4; iC++) {
                nextSlot++;
                if (nextSlot > 5) {
                    nextSlot = ((nextSlot) % 5);
                }
                seat++;
                if (slotNum === nextSlot) {
                    break;
                }
            }
            return "seat" + seat;
        }

        function setOtherPlayers(currentPlayer, otherPlayers) {
            for (var keyId in otherPlayers) {
                var objPlayer = otherPlayers[keyId];
                if (currentPlayer.slot !== objPlayer.slot) {
                    var seat = getNextSeat(objPlayer.slot);
                    $scope[seat] = objPlayer;
                    $scope.seatingInfo[objPlayer.slot] = seat;
                    $scope.seatingInfoById[objPlayer.id] = seat;
                }
            }
            $scope.$digest();
        }

        function showNotification(args, callback) {
            $scope.notificationMessage = args.message;
            $scope.showNotification = true;
            setTimeout(function() {
                $scope.showNotification = false;
                $scope.$digest();
                if (callback && typeof(callback) === 'function') {
                    callback();
                }
            }, args.timeout);

            $scope.$digest();
        }

        function initSocketEvents() {
            socket.on('betPlaced', function(args) {

                $scope.$broadcast('performBetAnimation', {
                    bet: args.bet.amount,
                    timeout: 2000
                });
                var lastActionPlayer = $scope[$scope.seatingInfoById[args.placedBy]];
                if (lastActionPlayer) {
                    lastActionPlayer.lastAction = args.bet.action;
                    lastActionPlayer.lastBet = args.bet.amount;
                }
                $scope.$digest();
                setTimeout(function() {
                    $scope.table = args.table;

                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.turn = args.players[player].turn;
                        currentPl.packed = args.players[player].packed;
                        currentPl.playerInfo.chips = args.players[player].playerInfo.chips;
                    }
                    $scope.$digest();
                }, 3000);
            });

            socket.on('sideShowResponded', function(args) {

                function sideShowRespond() {
                    $scope.table = args.table;
                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.lastAction = args.players[player].lastAction;
                        currentPl.sideShowTurn = args.players[player].sideShowTurn;
                        currentPl.turn = args.players[player].turn;
                        currentPl.packed = args.players[player].packed;
                    }
                    $scope.$digest();
                }
                if (args.message) {
                    showNotification({
                        message: args.message,
                        timeout: 3000
                    }, sideShowRespond);
                } else {
                    sideShowRespond();
                }
            });
            socket.on('sideShowResult', function(args) {

                function sideShowResult() {
                    $scope.table = args.table;
                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.cardSet.cards = args.players[player].cardSet.cards;
                        currentPl.cardSet.closed = args.players[player].cardSet.closed;
                    }
                    $scope.$digest();
                }
                if (args.message) {
                    showNotification({
                        message: args.message,
                        timeout: 2000
                    }, sideShowResult);
                } else {
                    sideShowResult();
                }
            });

            socket.on('sideShowPlaced', function(args) {

                $scope.$broadcast('performBetAnimation', {
                    bet: args.bet.amount,
                    timeout: 2000
                });

                function sideShowProcess() {
                    $scope.table = args.table;
                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.sideShowTurn = args.players[player].sideShowTurn;
                        if (currentPl.sideShowTurn) {
                            currentPl.sideShowMessage = args.message;
                        }
                    }
                    $scope.$digest();
                }

                if (args.message) {
                    showNotification({
                        message: args.message,
                        timeout: 2000
                    }, sideShowProcess);
                } else {
                    sideShowProcess();
                }


            });

            socket.on('showWinner', function(args) {

                function showWinner() {
                    $scope.table = args.table;
                    if (args.message) {
                        showNotification({
                            message: args.message,
                            timeout: args.timeout || 4000
                        });
                    }
                    var lastActionPlayer = $scope[$scope.seatingInfoById[args.placedBy]];
                    if (lastActionPlayer) {
                        lastActionPlayer.lastAction = args.bet.action;
                        lastActionPlayer.lastBet = args.bet.amount;
                    }
                    for (var player in args.players) {
                        var playerSeat = $scope.seatingInfoById[args.players[player].id];
                        $scope[playerSeat].packed = args.players[player].packed;
                        $scope[playerSeat].active = args.players[player].active;
                        $scope[playerSeat].turn = args.players[player].turn;
                        $scope[playerSeat].winner = args.players[player].winner;
                        // $scope[playerSeat].playerInfo.chips = args.players[player].playerInfo.chips;
                        if ((playerSeat !== 'currentPlayer') || (playerSeat === 'currentPlayer' && $scope[playerSeat].cardSet.closed)) {
                            $scope[playerSeat].cardSet.cards = args.players[player].cardSet.cards;
                            $scope[playerSeat].cardSet.closed = args.players[player].cardSet.closed;
                        }
                    }
                    $scope.$digest();
                    $scope.$broadcast('performWinnerAnimation', {
                        bet: args.table.amount,
                        timeout: 2000,
                        callback: function() {
                            for (var player in args.players) {
                                var playerSeat = $scope.seatingInfoById[args.players[player].id];
                                $scope[playerSeat].playerInfo.chips = args.players[player].playerInfo.chips;
                            }
                        }
                    });
                }

                if (args.potLimitExceeded) {
                    showNotification({
                        message: "Pot Limit Exceeded Force Show",
                        timeout: 3000
                    }, showWinner);
                } else {
                    if (!args.packed && !args.potLimitExceeded) {
                        $scope.$broadcast('performBetAnimation', {
                            bet: args.bet.amount,
                            timeout: 2000
                        });
                        setTimeout(showWinner, 3000);
                    } else {
                        showWinner();
                    }
                }


            });

            socket.on('playerPacked', function(args) {
                $scope.table = args.table;
                var lastActionPlayer = $scope[$scope.seatingInfoById[args.placedBy]];
                if (lastActionPlayer) {
                    lastActionPlayer.lastAction = args.bet.action;
                    lastActionPlayer.lastBet = args.bet.amount;
                }
                for (var player in args.players) {
                    var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                    currentPl.turn = args.players[player].turn;
                    currentPl.packed = args.players[player].packed;
                    currentPl.playerInfo.chips = args.players[player].playerInfo.chips;
                }
                $scope.$digest();
            });
            socket.on('connectionSuccess', function(args) {
                $rootScope.userInfo.clientId = args.id;
                socket.emit('joinTable', $rootScope.userInfo);
            });
            socket.on('tableJoined', function(args) {
                $scope.seatingInfo[args.slot] = "currentPlayer";
                $scope.seatingInfoById[args.id] = "currentPlayer";
                $scope.currentPlayer = args;
                setOtherPlayers($scope.currentPlayer, args.otherPlayers);
                $scope.$digest();
            });
            socket.on('playerLeft', function(args) {
                $scope[$scope.seatingInfo[args.removedPlayer.slot]] = null;
                $scope[$scope.seatingInfoById[args.removedPlayer.id]] = null;
                delete $scope.seatingInfo[args.removedPlayer.slot];
                delete $scope.seatingInfo[args.removedPlayer.id];
                $scope.table.isShowAvailable = args.table.isShowAvailable;
                $scope.table.isSideShowAvailable = args.table.isSideShowAvailable;
                for (var player in args.players) {
                    var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                    currentPl.turn = args.players[player].turn;
                    currentPl.packed = args.players[player].packed;
                    currentPl.playerInfo.chips = args.players[player].playerInfo.chips;
                }
                $scope.$digest();
            });

            socket.on('gameCountDown', function(args) {
                var counter = args.counter;
                if ($scope.table) {
                    $scope.table.showAmount = false;
                }
                $scope.gameCountdownMessage = "Your game will begin in " + counter + " seconds";
                $scope.showMessage = true;
                $scope.$digest();
                var interValId = window.setInterval(function() {
                    counter--;
                    if (counter == 0) {
                        clearInterval(interValId);
                        $scope.showMessage = false;
                    } else {
                        $scope.gameCountdownMessage = "Your game will begin in " + counter + " seconds";
                    }
                    $scope.$digest();
                }, 1000);
            });


            socket.on('cardsSeen', function(args) {
                $scope.currentPlayer.cardSet.cards = args.cardsInfo;
                $scope.currentPlayer.cardSet.closed = false;
                $scope.$digest()
            });
            socket.on('playerCardSeen', function(args) {
                $scope[$scope.seatingInfoById[args.id]].lastAction = "Card Seen";
                for (var player in args.players) {
                    $scope[$scope.seatingInfoById[args.players[player].id]].isSideShowAvailable = args.players[player].isSideShowAvailable;
                }
                $scope.$digest();
            });

            socket.on('notification', function(args) {
                showNotification(args);
            });

            socket.on('resetTable', function(args) {
                $scope.table = args.table;
                $scope.showMessage = false;
                $scope.table.showAmount = false;
                for (var player in args.players) {
                    $scope[$scope.seatingInfoById[args.players[player].id]] = args.players[player];
                }
                $scope.$digest();
            });

            socket.on('startNew', function(args) {
                $scope.$emit('startNew', {
                    args: args
                });
                for (var player in args.players) {
                    $scope[$scope.seatingInfoById[args.players[player].id]].turn = false;
                    $scope[$scope.seatingInfoById[args.players[player].id]].winner = false;
                    $scope[$scope.seatingInfoById[args.players[player].id]].packed = false;
                    $scope[$scope.seatingInfoById[args.players[player].id]].active = true;
                    $scope[$scope.seatingInfoById[args.players[player].id]].cardSet = null;
                    $scope[$scope.seatingInfoById[args.players[player].id]].lastAction = "";
                    $scope[$scope.seatingInfoById[args.players[player].id]].lastBet = "";
                }
                $scope.$digest();
                showNotification({
                    message: "Collecting boot amount of $" + $filter('number')(args.table.boot),
                    timeout: 2000
                }, function() {
                    $scope.$broadcast('performBootAnimation', {
                        boot: args.table.boot,
                        timeout: 2000
                    });
                });
                setTimeout(function() {
                    $scope.table = args.table;
                    $scope.showMessage = false;
                    $scope.table.showAmount = true;
                    for (var player in args.players) {
                        if ($scope.lastTurn) {
                            $scope[$scope.seatingInfoById[$scope.lastTurn]].turn = false;
                        }
                        $scope[$scope.seatingInfoById[args.players[player].id]] = args.players[player];
                    }
                    $scope.$digest();
                }, 4000);
            });

            socket.on('newPlayerJoined', function(args) {
                var seat = getNextSeat(args.slot);
                $scope.seatingInfo[args.slot] = seat;
                $scope.seatingInfoById[args.id] = seat;
                $scope[seat] = args;
                $scope.$digest();
            });
        }

    }
]);


angular.module('teenPatti.controllers').controller('mainCtrl', ['$rootScope',
    '$scope', 'cardService', '$state', '$timeout',
    function($rootScope, $scope, cardService, $state, $timeout) {
        $scope.backToMain = function() {

        };
        $scope.play = function() {

        }
        $scope.changeView = function(view) {
            $state.go(view, {
                id: $rootScope.userInfo._id
            });
        }

        $scope.checkLogin = function() {
            // if (!$rootScope.userInfo || !$rootScope.userInfo.login){
            //     $state.go('/');
            // }
        }
        $timeout(function() {
            $scope.checkLogin();
        }, 20);

    }
]);
angular.module('teenPatti.controllers').controller('startUp', ['$rootScope', '$scope', 'userService',
    function($rootScope, $scope, userService) {
        //$rootScope.userInfo={login:true};
        $scope.register = function() {
            userService.register({
                userName: $scope.userName
            }).success(function(res) {
                if (res.status == 'success') {
                    $rootScope.userInfo = res.data;
                    $scope.changeView("gamemenu");
                }
            });
        }

        $scope.login = function() {
            userService.getUser({
                userName: $scope.loginUserName
            }).success(function(res) {
                if (res.status == 'success') {
                    $rootScope.userInfo = res.data;
                    $scope.changeView("gamemenu");
                }
            })
        }

    }
]);
angular.module('teenPatti.controllers').controller('gameMenu', ['$rootScope', '$scope', 'userService', '$state',
    function($rootScope, $scope, userService, $state) {
        if ($rootScope.userInfo) {
            $scope.userName = $rootScope.userInfo.userName;
            $scope.chips = $rootScope.userInfo.chips;
        } else {
            /*userService.register({
                userName: "guest"
            }).success(function(res) {
                if (res.status == 'success') {
                    $rootScope.userInfo = res.data;
                     $scope.userName = $rootScope.userInfo.userName;
                     $scope.chips = $rootScope.userInfo.chips; 
                }
            });*/
        }

        $scope.playTable = function() {
            $state.go('gameplay');
        }

    }
]);
angular.module('teenPatti.services').factory('cardService', [

    function() {

    }
]);

angular.module('teenPatti.services').factory('userService', ['$http',

    function($http) {
        return {
            getUser: function(params) {
                return $http.post('/user/get', params);
            },
            register: function(params) {
                return $http.post('/user/register', params);
                /*.
                  success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                  }).
                  error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                  });
*/
            }
        }
    }
]);