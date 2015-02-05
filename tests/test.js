var _ = require('underscore');


var arrC = [{
    p: 5, n:5
}, {
    p: 2, n:5
}, {
    p: 4, n:5
}];


console.log(_.sortBy(arrC, 'p').reverse());
console.log(_.max(arrC, function(a) {
	return a.p;
}));

var bc=_.where(arrC,{p:2});
console.log(bc);


var bc=_.map(arrC,function(a){
	return {p:a.p};
});
console.log(bc);