var expect = require("chai").expect;
var Lite = require("../../../code/lib/base/Lite.js");

describe("Lite::Model", function() {
    describe("Model::Basics", function() {
        it('should not be null', function() {
            expect(typeof(Lite.Model)).to.equal('function');
        });
        it('should be able to create new Model', function() {
            var person = Lite.Model(function() {
                return {
                    name: "navneet",
                    say: function() {
                        return "hello";
                    }
                }
            });

            expect(typeof(person)).to.equal('function');
        });
    });
});