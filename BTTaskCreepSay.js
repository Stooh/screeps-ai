module.exports = require('BTTaskLeaf').extend({
    constructor: function(text) {
        this.base();
        this.text = text;
    },
    tick: function(executor, context) {
        Game.creeps.forEach(this.speak, this);
    },
    speak: function(creep) {
        creep.say(text);
    },
});
