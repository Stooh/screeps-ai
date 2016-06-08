var Log = require('Log');
var BTTask = require('BTTask');

module.exports = require('BTTaskLeaf').extend({
    constructor: function(stack, item) {
        this.base();
        this.stack = stack;
        this.item = item;
    },
    tick: function(executor, context) {
        var stack = this.getSharedMemory(context, this.stack);

        if(!_.isArray(stack)) {
            Log.warn('Stack is not an array: ' + stack);
            return BTTask.FAILURE;
        }

        if(stack.length <= 0) {
            return BTTask.FAILURE;
        }

        var value = stack.pop();
        this.setSharedMemory(context, this.item, value);
        
        return BTTask.SUCCESS;
    },
});
