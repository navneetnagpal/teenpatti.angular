 function Card(type, rank) {
     this.type = type;
     this.rank = rank;
     this.name = this.getName(rank);
     this.priority = this.getPriority(rank);
 }
 Card.prototype.getName = function() {
     switch (this.rank) {
         case 1:
             return "A";
         case 11:
             return "J";
         case 12:
             return "Q";
         case 13:
             return "K";
         default:
             return this.rank.toString();
     }
 }
 Card.prototype.getPriority = function() {
     switch (this.rank) {
         case 1:
             return 14;
         default:
             return this.rank;
     }
 }

 module.exports = Card;