var expect = require("chai").expect;
var Lite = require("../../../code/lib/base/Lite.js");

describe("Lite::Utility", function() {
    describe("Utility::#isNullOrUndefined()", function() {
        it('should return true in case of null', function() {
            expect(Lite.isNullOrUndefined(null)).to.equal(true);
        });
        it('should return false in case of blank string', function() {
            expect(Lite.isNullOrUndefined("")).to.equal(false);
        });
        it('should return false in case of 0 value', function() {
            expect(Lite.isNullOrUndefined(0)).to.equal(false);
        });
        it('should return true in case of undefined value', function() {
            expect(Lite.isNullOrUndefined(undefined)).to.equal(true);
        });

    });
     describe("Utility::#isArray()", function() {
        it('should return true in case of []', function() {
            expect(Lite.isArray([])).to.equal(true);
        });
        it('should return false in case of {}', function() {
            expect(Lite.isArray("")).to.equal(false);
        });
        it('should return false in case of string value', function() {
            expect(Lite.isArray("Abc")).to.equal(false);
        });
        it('should return true in case of {length:0} value', function() {
            expect(Lite.isArray({length:0})).to.equal(false);
        });

    });
});