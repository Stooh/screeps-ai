var BTTask = require('BTTask');

var SAYS = [
    ':)',
    ':(',
    'o_O',
    'XD',
    'o/',
    '(>\'-\')>',
    '<(\'-\'<)',
    '^(\'-\')^',
];

module.exports = require('BTTaskLeaf').extend({
    constructor: function(creep) {
        this.base();
        this.creep = creep;
    },
    tick: function(executor, context) {
        var creep = this.getSharedMemory(context, this.creep);
        if(!creep)
            return BTTask.FAILURE;

        this.speak(creep);
        return BTTask.SUCCESS;
    },
    speak: function(creep) {
        var index = Game.time % SAYS.length;
        creep.say(SAYS[index]);
    },
});
