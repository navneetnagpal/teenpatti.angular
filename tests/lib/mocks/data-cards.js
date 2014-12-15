var Card = require("../../../code/lib/card.js");
var data = {
    highcard: {
        set1: [
            new Card('spade', 1),
            new Card('diamond', 11),
            new Card('spade', 13)
        ],
        set2: [
            new Card('club', 1),
            new Card('club', 10),
            new Card('diamond', 12)
        ],
        set3: [
            new Card('club', 11),
            new Card('club', 1),
            new Card('diamond', 4)
        ],
        set4: [
            new Card('spade', 4),
            new Card('diamond', 5),
            new Card('spade', 9)
        ],
        set5: [
            new Card('club', 4),
            new Card('club', 5),
            new Card('diamond', 9)
        ],
        set6: [
            new Card('club', 1),
            new Card('club', 13),
            new Card('spade', 11)
        ]
    },
    pair: {
        set1: [
            new Card('spade', 2),
            new Card('diamond', 2),
            new Card('spade', 13)
        ],
        set2: [
            new Card('club', 1),
            new Card('spade', 1),
            new Card('diamond', 12)
        ],
        set3: [
            new Card('club', 3),
            new Card('diamond', 3),
            new Card('diamond', 4)
        ],
        set4: [
            new Card('club', 4),
            new Card('diamond', 4),
            new Card('spade', 5)
        ],
        set5: [
            new Card('club', 4),
            new Card('diamond', 4),
            new Card('diamond', 5)
        ]
    },
    color: {

        set1: [
            new Card('spade', 1),
            new Card('spade', 13),
            new Card('spade', 11)
        ],
        set2: [
            new Card('diamond', 2),
            new Card('diamond', 3),
            new Card('diamond', 6)
        ],
        set3: [
            new Card('club', 1),
            new Card('club', 2),
            new Card('club', 5)
        ],
        set4: [
            new Card('diamond', 1),
            new Card('diamond', 13),
            new Card('diamond', 11)
        ]
    },
    sequence: {
        set1: [
            new Card('spade', 13),
            new Card('diamond', 1),
            new Card('club', 12)
        ],
        set2: [
            new Card('spade', 10),
            new Card('diamond', 9),
            new Card('club', 8)
        ],
        set3: [
            new Card('spade', 3),
            new Card('diamond', 2),
            new Card('club', 1)
        ],
        set4: [
            new Card('diamond', 13),
            new Card('spade', 1),
            new Card('heart', 12)
        ]
    },
    puresequence: {
        set1: [
            new Card('spade', 13),
            new Card('spade', 1),
            new Card('spade', 12)
        ],
        set2: [
            new Card('diamond', 10),
            new Card('diamond', 9),
            new Card('diamond', 8)
        ],
        set3: [
            new Card('spade', 3),
            new Card('spade', 2),
            new Card('spade', 1)
        ],
         set4: [
            new Card('club', 3),
            new Card('club', 2),
            new Card('club', 1)
        ],
        set5: [
            new Card('club', 10),
            new Card('club', 9),
            new Card('club', 8)
        ]
    },
    trail: {
        set1: [
            new Card('spade', 1),
            new Card('diamond', 1),
            new Card('club', 1)
        ],
        set2: [
            new Card('spade', 2),
            new Card('diamond', 2),
            new Card('club', 2)
        ],
        set3: [
            new Card('spade', 3),
            new Card('diamond', 3),
            new Card('club', 3)
        ],
        set4: [
            new Card('spade', 13),
            new Card('diamond', 13),
            new Card('club', 13)
        ]
    }
}
module.exports = data;