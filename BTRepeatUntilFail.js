var Log = require('Log');

module.exports = require('BTRepeat').extend({
    constructor: function(task) {
        this.base(task);
    },

    childFinish: function(executor, context, child, success) {
        // if it's a fail, we stop
        if(!success)
            return FAILURE;

        // if not we continue
        return this.base(executor, context, child, success);
    },
});
