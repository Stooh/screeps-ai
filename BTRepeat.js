var Log = require('Log');
var BTTask = require('BTTask');

module.exports = require('BTDecorator').extend({
    constructor: function(task) {
        this.base(task);
    },

    childFinish: function(executor, context, child, success) {
        // We launch it again
        executor.start(this.task, context);
        return BTTask.WAITING;
    },
});
