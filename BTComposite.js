module.exports = require('BTTask').extend({
    constructor: function(tasks) {
        this.base();
        this.tasks = tasks || [];
        this.tasks.forEach(_setParent, this);
    },

    tasks: [],

    _setParent: function(task) {
        task.parent = this;
    },

    checkConditions: function(context) {
        return this.base() && this.tasks.length > 0;
    },

    _hashCodeTask: function(value, task) {
        return 17 * res + task.hashCode();
    },

    hashCode: function() {
        return this.tasks.reduce(this._hashCodeTask, this.base());
    },

    _generateUniqueId: function(id, childTask) {
        // return last id used by the child task
        // we'll increment for the next child task, etc.
        return childTask.generateUniqueIdsRecursive(id + 1);
    },

    generateUniqueIdsRecursive: function(id) {
        this.base(id);

        // affect id to all sub tasks
        return this.tasks.reduce(_generateUniqueId, id);
    },

    registerRecursive: function(register) {
        this.base(register);

        this.tasks.forEach(function(task) {task.registerRecursive(register)});

        return register;
    },
});