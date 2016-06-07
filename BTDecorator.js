module.exports = require('BTTask').extend({
    constructor: function(task) {
        this.base();
        this.task = task;
        task.parent = this;
    },

    task: undefined,
    
    start: function(executor, context) {
        executor.start(this.task, context);
    },

    end: function(executor, context) {
        executor.end(this.task, context);
    },

    tick: function(executor, context) {
        return WAITING;
    },

    hashCode: function() { return 17 * this.base() + this.task.hashCode(); },

    generateUniqueIdsRecursive: function(id) {
        this.base();
        return this.task.generateUniqueIdsRecursive(this.id + 1);
    },
});
