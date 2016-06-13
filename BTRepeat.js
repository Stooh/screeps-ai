var Log = require('Log');
var BTTask = require('BTTask');

module.exports = require('BTDecorator').extend({
    constructor: function(task) {
        this.base(task);
    },

    start: function(executor, context) {
        // we do not start it now
    },

    tick: function(executor, context) {
        executor.start(this.task, context);
        return BTTask.WAITING;
    },

    childFinish: function(executor, context, child, success) {
        // We launch it again next tick
        return BTTask.RUNNING;
    },
});
