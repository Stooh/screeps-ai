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
        return this.WAITING;
    },

    hashCode: function() { return 17 * this.base() + this.task.hashCode(); },

    childFinish: function(executor, context, child, success) {
        return success ? this.SUCCESS : this.FAILURE;
    },

    generateUniqueIdsRecursive: function(id) {
        this.base(id);
        return this.task.generateUniqueIdsRecursive(this.id + 1);
    },

    registerRecursive: function(register) {
        this.base(register);
        return this.task.registerRecursive(register);
    },
});
