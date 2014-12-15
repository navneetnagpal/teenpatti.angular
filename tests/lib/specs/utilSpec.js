var expect = require("chai").expect;
var utils = require("../../../code/lib/base/utils.js");
 
describe("utils", function(){
   describe("#guid()", function(){
       it("should create guid utils", function(){
            var a = utils.guid();
           expect(typeof a).to.equal("string");
       });
       it("should create diffrent guid ", function(){
            var a = utils.guid();
            var b = utils.guid();
           expect(a).not.to.equal(b);
       });
   });
});