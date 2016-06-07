var BTTask = require('BTTask');

module.exports = require('BTDecorator').extend({
    constructor: function(task) {
        this.base(task);
    },

    childFinish: function(executor, context, child, success) {
        // We invert the result
        return success ? BTTask.FAILURE : BTTask.SUCCESS;
    },
});
