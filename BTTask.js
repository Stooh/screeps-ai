var Log = require('Log');

var BTTask = require('Base').extend({
    constructor: function() {
        this.id = -1;
    },
    parent: undefined,
    checkConditions: function(context) { return true; },
    start: function(executor, context) {},
    end: function(executor, context) {},
    tick: function(executor, context) { Log.crash('Warning: tick of ' + this.title + ' not implemented!'); },
    childFinish: function(executor, context, child, success) {},
    setMemory: function(context, key, value) { return context.setNodeMemory(this, key, value); },
    getMemory: function(context, key) { return context.getNodeMemory(this, key); },
    setSharedMemory: function(context, key, value) { return context.setSharedMemory(key, value); },
    getSharedMemory: function(context, key) { return context.getSharedMemory(key); },
    hashCode: function() { return this.constructor.name.hashCode(); }, // FIXME : toujours 0 car constructor.name = ''
    generateUniqueIdsRecursive: function(id) {
        return this.id = id || 0;
    },
    registerRecursive: function(register) {
        register[this.id] = this;
        return register;
    },
});

BTTask.RUNNING = 0;
BTTask.SUCCESS = 1;
BTTask.FAILURE = 2;
BTTask.WAITING = 3; // parent task finish without result, waiting for children to finish

module.exports = BTTask;
