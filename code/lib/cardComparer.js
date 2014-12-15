var _ = require('underscore');


function CardComparer() {
    var _options = {
        wininingPriority: {
            cardType: {
                "spade": {
                    priority: 4
                },
                "heart": {
                    priority: 3
                },
                "diamond": {
                    priority: 2
                },
                "club": {
                    priority: 1
                }
            },
            setType: {
                "highcard": {
                    type: 'highcard',
                    displayName: 'High Card',
                    priority: 1
                },
                "pair": {
                    type: 'pair',
                    displayName: 'Pair',
                    priority: 2
                },
                "color": {
                    type: 'color',
                    displayName: 'Color',
                    priority: 3
                },
                "sequence": {
                    type: 'sequence',
                    displayName: 'Sequence',
                    priority: 4
                },
                "puresequence": {
                    type: 'puresequence',
                    displayName: 'Pure Sequence',
                    priority: 5
                },
                "trail": {
                    type: 'trail',
                    displayName: 'Trail',
                    priority: 6
                }
            }
        }
    }

    function isTrail(cardSet) {
        return cardSet[0].rank === cardSet[1].rank && cardSet[2].rank === cardSet[0].rank;
    }

    function isPureSeq(cardSet) {
        var sorted = _.sortBy(cardSet, 'priority');
        var sortedRank = _.sortBy(cardSet, 'rank');
        return ((sorted[0].priority + 1 === sorted[1].priority && sorted[1].priority + 1 === sorted[2].priority) || (sortedRank[0].rank + 1 === sortedRank[1].rank && sortedRank[1].rank + 1 === sortedRank[2].rank)) && (sorted[0].type === sorted[1].type && sorted[1].type === sorted[2].type);
    }

    function isSeq(cardSet) {
        var sorted = _.sortBy(cardSet, 'priority');
        var sortedRank = _.sortBy(cardSet, 'rank');
        return (sorted[0].priority + 1 === sorted[1].priority && sorted[1].priority + 1 === sorted[2].priority) || (sortedRank[0].rank + 1 === sortedRank[1].rank && sortedRank[1].rank + 1 === sortedRank[2].rank);

    }

    function isColor(cardSet) {
        return (cardSet[0].type === cardSet[1].type && cardSet[1].type === cardSet[2].type);
    }

    function isPair(cardSet) {
        return (cardSet[0].rank === cardSet[1].rank || cardSet[1].rank === cardSet[2].rank || cardSet[0].rank === cardSet[2].rank);
    }

    this.getSetType = function(cardSet) {
        if (isTrail(cardSet)) {
            return _options.wininingPriority.setType.trail;
        }
        if (isPureSeq(cardSet)) {
            return _options.wininingPriority.setType.puresequence;
        }
        if (isSeq(cardSet)) {
            return _options.wininingPriority.setType.sequence;
        }
        if (isColor(cardSet)) {
            return _options.wininingPriority.setType.color;
        }
        if (isPair(cardSet)) {
            return _options.wininingPriority.setType.pair;
        }
        return _options.wininingPriority.setType.highcard;
    }

    function compareTrail(sets, setProp) {
        var result = _.max(sets, function(obj) {
            return obj[setProp][0].priority;
        });
        return result;
    }

    function isHighSet(set1, set2) {
        var set1D = _.sortBy(set1, 'priority').reverse();
        var set2D = _.sortBy(set2, 'priority').reverse();
        if (set1D[0].priority > set2D[0].priority) {
            return true;
        } else if (set1D[0].priority < set2D[0].priority) {
            return false;
        } else {
            if (set1D[1].priority > set2D[1].priority) {
                return true;
            } else if (set1D[1].priority < set2D[1].priority) {
                return false;
            } else {
                if (set1D[2].priority > set2D[2].priority) {
                    return true;
                } else if (set1D[2].priority < set2D[2].priority) {
                    return false;
                } else {
                    return _options.wininingPriority.cardType[set1D[2].type].priority >
                        _options.wininingPriority.cardType[set2D[2].type].priority;
                }
            }
        }

        return true;
    }

    function compareHighCard(sets, setProp) {
        var firstSet, highSet = sets[0];
        for (var count = 1, len = sets.length; count < len; count++) {
            var set2 = sets[count];
            if (isHighSet(set2[setProp], highSet[setProp])) {
                highSet = set2;
            }
        }
        return highSet;
    }

    function isHighColor(set1, set2) {
        var set1D = _.sortBy(set1, 'priority').reverse();
        var set2D = _.sortBy(set2, 'priority').reverse();
        if (set1D[0].priority > set2D[0].priority) {
            return true;
        } else if (set1D[0].priority < set2D[0].priority) {
            return false;
        } else {
            if (set1D[1].priority > set2D[1].priority) {
                return true;
            } else if (set1D[1].priority < set2D[1].priority) {
                return false;
            } else {
                if (set1D[2].priority > set2D[2].priority) {
                    return true;
                } else if (set1D[2].priority < set2D[2].priority) {
                    return false;
                } else {

                    return _options.wininingPriority.cardType[set1D[2].type].priority >
                        _options.wininingPriority.cardType[set2D[2].type].priority;
                }
            }
        }
        return true;
    }

    function compareColor(sets, setProp) {
        var firstSet, highSet = sets[0];
        for (var count = 1, len = sets.length; count < len; count++) {
            var set2 = sets[count];
            if (isHighColor(set2[setProp], highSet[setProp])) {
                highSet = set2;
            }
        }
        return highSet;
    }

    function getPairRank(set) {
        if (set [0].priority === set [1].priority) {
            return set [0].priority;
        } else if (set [1].priority === set [2].priority) {
            return set [1].priority;
        } else if (set [0].priority === set [2].priority) {
            return set [0].priority;
        }
        return -1;
    }

    function getOddCardForPair(set) {
        if (set [0].priority === set [1].priority) {
            return set [2];
        } else if (set [1].priority === set [2].priority) {
            return set [0];
        } else if (set [0].priority === set [2].priority) {
            return set [1];
        }
    }

    function isHighPair(set1, set2) {
        var pair1Rank = getPairRank(set1);
        var pair2Rank = getPairRank(set2);
        var last1Card = getOddCardForPair(set1);
        var last2Card = getOddCardForPair(set2);
        if (pair1Rank > pair2Rank) {
            return true;
        } else if (pair1Rank < pair2Rank) {
            return false;
        } else {

            if (last1Card.priority > last2Card.priority) {
                return true;
            } else if (last1Card.priority < last2Card.priority) {
                return false;
            } else {
                return _options.wininingPriority.cardType[last1Card.type].priority >
                    _options.wininingPriority.cardType[last2Card.type].priority;
            }

        }
        return true;
    }

    function comparePair(sets, setProp) {
        var firstSet, highSet = sets[0];
        for (var count = 1, len = sets.length; count < len; count++) {
            var set2 = sets[count];
            if (isHighPair(set2[setProp], highSet[setProp])) {
                highSet = set2;
            }
        }
        return highSet;
    }

    function isHighSequence(set1, set2) {
        var set1D = _.sortBy(set1, 'priority').reverse();
        var set2D = _.sortBy(set2, 'priority').reverse();
        if (set1D[0].priority > set2D[0].priority) {
            return true;
        } else if (set1D[0].priority < set2D[0].priority) {
            return false;
        } else {
            if (set1D[1].priority > set2D[1].priority) {
                return true;
            } else if (set1D[1].priority < set2D[1].priority) {
                return false;
            } else {
                if (set1D[2].priority > set2D[2].priority) {
                    return true;
                } else if (set1D[2].priority < set2D[2].priority) {
                    return false;
                } else {
                    return _options.wininingPriority.cardType[set1D[2].type].priority >
                        _options.wininingPriority.cardType[set2D[2].type].priority;
                }
            }
        }
        return true;
    }

    function compareSequence(sets, setProp) {
        var firstSet, highSet = sets[0];
        for (var count = 1, len = sets.length; count < len; count++) {
            var set2 = sets[count];
            if (isHighSequence(set2[setProp], highSet[setProp])) {
                highSet = set2;
            }
        }
        return highSet;
    }

    function getGreatestFromType(type, sets, setProp) {
        var setProp = setProp || 'set';
        switch (type) {
            case 'trail':
                return compareTrail(sets, setProp);
                break;
            case 'highcard':
                return compareHighCard(sets, setProp);
                break;
            case 'color':
                return compareColor(sets, setProp);
                break;
            case 'pair':
                return comparePair(sets, setProp);
                break;
            case 'sequence':
            case 'puresequence':
                return compareSequence(sets, setProp);
                break;
        }
        return sets[0];
    }

    this.getGreatest = function(sets, setProp) {
        var arrNew = [],
            sorted,
            setProp = setProp || 'set',
            maxP = -1;
        for (var count = 0, len = sets.length; count < len; count++) {
            var setType = this.getSetType(sets[count][setProp]);
            sets[count].type=setType.type;
            sets[count].typeName=setType.displayName;
            arrNew.push({
                type: setType.type,
                typeName: setType.displayName,
                priority: this.getSetType(sets[count][setProp]).priority,
                set: sets[count]
            });
        }
        sorted = _.sortBy(arrNew, 'priority').reverse();
        maxP = sorted[0].priority;
        typeLeft = _.where(sorted, {
            priority: maxP
        });
        if (typeLeft.length > 1) {
            return getGreatestFromType(typeLeft[0].type, _.map(typeLeft, function(a) {
                return a.set;
            }));
        }
        return sorted[0].set;
    }
}
module.exports = new CardComparer();