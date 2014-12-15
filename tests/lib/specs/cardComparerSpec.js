var expect = require("chai").expect;
var Card = require("../../../code/lib/card.js");
var cardComparer = require("../../../code/lib/cardComparer.js");
var data = require('../mocks/data-cards.js');

describe("Card Comparer", function() {
    describe("#getSetType()", function() {
        describe("High cards", function() {
            it("should return set1 type 'highcard'", function() {
                var result = cardComparer.getSetType(data.highcard.set1);
                expect(result.type).to.equal('highcard');
            });
            it("should return set2 type 'highcard'", function() {
                var result = cardComparer.getSetType(data.highcard.set2);
                expect(result.type).to.equal('highcard');
            });
            it("should return set3 type 'highcard'", function() {
                var result = cardComparer.getSetType(data.highcard.set3);
                expect(result.type).to.equal('highcard');
            });
            it("should return set4 type 'highcard'", function() {
                var result = cardComparer.getSetType(data.highcard.set4);
                expect(result.type).to.equal('highcard');
            });
            it("should return set5 type 'highcard'", function() {
                var result = cardComparer.getSetType(data.highcard.set5);
                expect(result.type).to.equal('highcard');
            });
            it("should return set6 type 'highcard'", function() {
                var result = cardComparer.getSetType(data.highcard.set6);
                expect(result.type).to.equal('highcard');
            });
        });
        describe("Pair cards", function() {
            it("should return set type 'pair'", function() {
                var result = cardComparer.getSetType(data.pair.set1);
                expect(result.type).to.equal('pair');
            });
            it("should return set type 'highcard'", function() {
                var result = cardComparer.getSetType(data.pair.set2);
                expect(result.type).to.equal('pair');
            });
            it("should return set type 'highcard'", function() {
                var result = cardComparer.getSetType(data.pair.set3);
                expect(result.type).to.equal('pair');
            });

        });
        describe("Color cards", function() {

            it("should return set type 'color'", function() {
                var result = cardComparer.getSetType(data.color.set1);
                expect(result.type).to.equal('color');
            });
            it("should return set type 'highcard'", function() {
                var result = cardComparer.getSetType(data.color.set2);
                expect(result.type).to.equal('color');
            });
            it("should return set type 'highcard'", function() {
                var result = cardComparer.getSetType(data.color.set3);
                expect(result.type).to.equal('color');
            });

        });
        describe("Sequence cards", function() {

            it("should return set1 type 'sequence'", function() {
                var result = cardComparer.getSetType(data.sequence.set1);
                expect(result.type).to.equal('sequence');
            });
            it("should return set2 type 'sequence'", function() {
                var result = cardComparer.getSetType(data.sequence.set2);
                expect(result.type).to.equal('sequence');
            });
            it("should return set3 type 'sequence'", function() {
                var result = cardComparer.getSetType(data.sequence.set3);
                expect(result.type).to.equal('sequence');
            });

        });
        describe("Pure Sequence cards", function() {

            it("should return set1 type 'puresequence'", function() {
                var result = cardComparer.getSetType(data.puresequence.set1);
                expect(result.type).to.equal('puresequence');
            });
            it("should return set2 type 'puresequence'", function() {
                var result = cardComparer.getSetType(data.puresequence.set2);
                expect(result.type).to.equal('puresequence');
            });
            it("should return set3 type 'puresequence'", function() {
                var result = cardComparer.getSetType(data.puresequence.set3);
                expect(result.type).to.equal('puresequence');
            });

        });
        describe("Trail Cards", function() {

            it("should return set type 'trail'", function() {
                var result = cardComparer.getSetType(data.trail.set1);
                expect(result.type).to.equal('trail');
            });
            it("should return set type 'highcard'", function() {
                var result = cardComparer.getSetType(data.trail.set2);
                expect(result.type).to.equal('trail');
            });
            it("should return set type 'highcard'", function() {
                var result = cardComparer.getSetType(data.trail.set3);
                expect(result.type).to.equal('trail');
            });

        });
    });


    describe("2 set compaisons", function() {
        describe("#Trails)", function() {
            it("comparing set1 with set2", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.trail.set1
                }, {
                    id: 'p2',
                    set: data.trail.set2
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.trail.set1);
            });
            it("comparing set1 with set4", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.trail.set1
                }, {
                    id: 'p2',
                    set: data.trail.set4
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.trail.set1);
            });
            it("comparing trail.set1 with sequence.set2", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.trail.set1
                }, {
                    id: 'p2',
                    set: data.sequence.set2
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.trail.set1);
            });
            it("comparing trail with highcard", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.trail.set1
                }, {
                    id: 'p2',
                    set: data.highcard.set2
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.trail.set1);
            });
            it("comparing trail with pure sequence", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.puresequence.set1
                }, {
                    id: 'p2',
                    set: data.trail.set2
                }]);
                expect(result.id).to.equal('p2');
                expect(result.set).to.equal(data.trail.set2);
            });
        });

        describe("#Highcards", function() {
            it("comparing set1 with set 2", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.highcard.set1
                }, {
                    id: 'p2',
                    set: data.highcard.set2
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.highcard.set1);
            });
            it("comparing set4 with set5", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.highcard.set4
                }, {
                    id: 'p2',
                    set: data.highcard.set5
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.highcard.set4);
            });
            it("comparing set2 with set3", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.highcard.set2
                }, {
                    id: 'p2',
                    set: data.highcard.set3
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.highcard.set2);
            });
            it("comparing set1 with set6", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.highcard.set1
                }, {
                    id: 'p2',
                    set: data.highcard.set6
                }]);
                expect(result.id).to.equal('p2');
                expect(result.set).to.equal(data.highcard.set6);
            });
        });
        describe("#Color", function() {
            it("comparing color.set1 with color.set2", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.color.set1
                }, {
                    id: 'p2',
                    set: data.color.set2
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.color.set1);
            });
            it("comparing color.set2 with color.set3", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.color.set2
                }, {
                    id: 'p2',
                    set: data.color.set3
                }]);
                expect(result.id).to.equal('p2');
                expect(result.set).to.equal(data.color.set3);
            });
            it("comparing color.set1 with color.set4", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.color.set1
                }, {
                    id: 'p2',
                    set: data.color.set4
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.color.set1);
            });
        });

        describe("#Pair", function() {
            it("comparing pair.set1 with pair.set2", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.pair.set1
                }, {
                    id: 'p2',
                    set: data.pair.set2
                }]);
                expect(result.id).to.equal('p2');
                expect(result.set).to.equal(data.pair.set2);
            });
            it("comparing pair.set2 with pair.set3", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.pair.set2
                }, {
                    id: 'p2',
                    set: data.pair.set3
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.pair.set2);
            });
            it("comparing pair.set1 with pair.set4", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.pair.set1
                }, {
                    id: 'p2',
                    set: data.pair.set4
                }]);
                expect(result.id).to.equal('p2');
                expect(result.set).to.equal(data.pair.set4);
            });
            it("comparing pair.set4 with pair.set5", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.pair.set4
                }, {
                    id: 'p2',
                    set: data.pair.set5
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.pair.set4);
            });
        });
        describe("#Sequence", function() {
            it("comparing sequence.set1 with sequence.set2", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.sequence.set1
                }, {
                    id: 'p2',
                    set: data.sequence.set2
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.sequence.set1);
            });
            it("comparing sequence.set2 with sequence.set3", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.sequence.set2
                }, {
                    id: 'p2',
                    set: data.sequence.set3
                }]);
                expect(result.id).to.equal('p2');
                expect(result.set).to.equal(data.sequence.set3);
            });
            it("comparing sequence.set1 with sequence.set4", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.sequence.set1
                }, {
                    id: 'p2',
                    set: data.sequence.set3
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.sequence.set1);
            });
            it("comparing sequence.set4 with sequence.set5", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.sequence.set1
                }, {
                    id: 'p2',
                    set: data.sequence.set4
                }]);
                expect(result.id).to.equal('p2');
                expect(result.set).to.equal(data.sequence.set4);
            });
        });

        describe("#Pure Sequence", function() {
            it("comparing puresequence.set1 with puresequence.set2", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.puresequence.set1
                }, {
                    id: 'p2',
                    set: data.puresequence.set2
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.puresequence.set1);
            });
            it("comparing puresequence.set2 with puresequence.set3", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.puresequence.set2
                }, {
                    id: 'p2',
                    set: data.puresequence.set3
                }]);
                expect(result.id).to.equal('p2');
                expect(result.set).to.equal(data.puresequence.set3);
            });
            it("comparing puresequence.set1 with puresequence.set4", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.puresequence.set1
                }, {
                    id: 'p2',
                    set: data.puresequence.set3
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.puresequence.set1);
            });
            it("comparing puresequence.set4 with puresequence.set5", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.puresequence.set1
                }, {
                    id: 'p2',
                    set: data.puresequence.set4
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.puresequence.set1);
            });
            it("comparing puresequence.set2 with puresequence.set5", function() {
                var result = cardComparer.getGreatest([{
                    id: 'p1',
                    set: data.puresequence.set2
                }, {
                    id: 'p2',
                    set: data.puresequence.set5
                }]);
                expect(result.id).to.equal('p1');
                expect(result.set).to.equal(data.puresequence.set2);
            });
        });

        describe("3 set compaisons", function() {
            describe("#Mixed", function() {
                it("should win 'sequence' : comparing with trail.set1,sequence.set1,puresequence.set1'", function() {
                    var result = cardComparer.getGreatest([{
                        id: 'p1',
                        set: data.trail.set1
                    }, {
                        id: 'p2',
                        set: data.sequence.set1
                    }, {
                        id: 'p3',
                        set: data.puresequence.set1
                    }]);
                    expect(result.id).to.equal('p1');
                    expect(result.set).to.equal(data.trail.set1);
                });
                it("should win 'sequence' : comparing with sequence.set1,puresequence.set1,highcard.set2", function() {
                    var result = cardComparer.getGreatest([{
                        id: 'p1',
                        set: data.puresequence.set1
                    }, {
                        id: 'p2',
                        set: data.sequence.set1
                    }, {
                        id: 'p3',
                        set: data.highcard.set2
                    }]);
                    expect(result.id).to.equal('p1');
                    expect(result.set).to.equal(data.puresequence.set1);
                });
                it("should win 'trail.set1' : comparing with trail.set1,trail.set2,trail.set3", function() {
                    var result = cardComparer.getGreatest([{
                        id: 'p1',
                        set: data.trail.set1
                    }, {
                        id: 'p2',
                        set: data.trail.set2
                    }, {
                        id: 'p3',
                        set: data.trail.set3
                    }]);
                    expect(result.id).to.equal('p1');
                    expect(result.set).to.equal(data.trail.set1);
                });
            });
        });

        describe("5 set compaisons", function() {
            describe("#Mixed", function() {
                it("should win 'pair' : comparing with pair.set1,pair.set2,pair.set3,highcard.set1,highcard.set2", function() {
                    var result = cardComparer.getGreatest([{
                        id: 'p1',
                        set: data.pair.set1
                    }, {
                        id: 'p2',
                        set: data.pair.set2
                    }, {
                        id: 'p3',
                        set: data.pair.set3
                    }, {
                        id: 'p4',
                        set: data.highcard.set1
                    }, {
                        id: 'p5',
                        set: data.highcard.set3
                    }]);
                    expect(result.type).to.equal('pair');
                    expect(result.typeName).to.equal('Pair');
                    expect(result.id).to.equal('p2');
                    expect(result.set).to.equal(data.pair.set2);
                });
                it("should win 'color' : comparing with pair.set1,pair.set2,pair.set3,highcard.set1,highcard.set2", function() {
                    var result = cardComparer.getGreatest([{
                        id: 'p1',
                        set: data.color.set1
                    }, {
                        id: 'p2',
                        set: data.pair.set2
                    }, {
                        id: 'p3',
                        set: data.pair.set3
                    }, {
                        id: 'p4',
                        set: data.highcard.set1
                    }, {
                        id: 'p5',
                        set: data.highcard.set3
                    }]);
                    expect(result.type).to.equal('color');
                    expect(result.typeName).to.equal('Color');
                    expect(result.id).to.equal('p1');
                    expect(result.set).to.equal(data.color.set1);
                });
                 it("should win 'color' : comparing with pair.set1,pair.set2,pair.set3,highcard.set1,highcard.set2", function() {
                    var result = cardComparer.getGreatest([{
                        id: 'p1',
                        set: data.color.set1
                    }, {
                        id: 'p2',
                        set: data.pair.set2
                    }, {
                        id: 'p3',
                        set: data.pair.set3
                    }, {
                        id: 'p4',
                        set: data.highcard.set1
                    }, {
                        id: 'p5',
                        set: data.highcard.set3
                    }]);
                    expect(result.id).to.equal('p1');
                    expect(result.set).to.equal(data.color.set1);
                });
            });
        });

    });
});