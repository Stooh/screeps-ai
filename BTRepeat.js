var Log = require('Log');

module.exports = require('BTDecorator').extend({
    constructor: function(task) {
        this.base(task);
    },

    childFinish: function(executor, context, child, success) {
        // We launch it again
        executor.start(this.task, context);
        return WAITING;
    },
});
