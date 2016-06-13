var Log = require('Log');
var BTTask = require('BTTask');

module.exports = require('BTTaskLeaf').extend({
    constructor: function(stack, source) {
        this.base();
        this.stack = stack;
        this.source = source || stack;
    },
    tick: function(executor, context) {
        var stack = Game[this.source];

        if(_.isObject)
            stack = _.values(stack);
        else if(!_.isArray(stack)) {
            Log.warn('Stack is not an array: ' + stack);
            return BTTask.FAILURE;
        }

        this.setSharedMemory(context, this.stack, stack);
        return BTTask.SUCCESS;
    },
});
