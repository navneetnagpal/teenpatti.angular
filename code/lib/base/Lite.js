var Lite = (function() {
    function isNullOrUndefined(val){
        return val===undefined || val===null;
    }
    function isBlank(val){
        return val.toString()==="";
    }
    function isArray(val){
        return val instanceof Array;
    }
    function _Model() {

    }

    function _Module(name, base, module) {

    }

    function _Event(name, callback) {
        this.name = name;
        this.callbacks = [callback];
    }
    _Event.prototype = {
        trigger: function(context, args) {

        },
        add: function(fn) {

        },
        remove: function(fn) {

        }
    }

    

    function _EventManager() {
        this.events = {};
    }
    _EventManager.prototype = {
        attach: function(eventname, fn) {

        },
        detach: function(eventname) {

        },
        extractNameSpace: function(namespace) {

        },
        createHeirarchy: function(namespace) {

        }
    }

    return {
        isNullOrUndefined:isNullOrUndefined,
        isBlank:isBlank,
        isArray:isArray,
        Model: _Model,
        Module: _Module,
        Event: _Event,
        EventManager: _EventManager
    }
})();



module.exports = Lite;