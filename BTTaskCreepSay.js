var BTTask = require('BTTask');

module.exports = require('BTTaskLeaf').extend({
    constructor: function(text) {
        this.base();
        this.text = text;
    },
    tick: function(executor, context) {
        _.each(Game.creeps, this.speak, this);
        return BTTask.SUCCESS;
    },
    speak: function(creep) {
        creep.say(this.text);
    },
});
