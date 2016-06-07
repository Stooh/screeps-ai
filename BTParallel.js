var Log = require('Log');

const COUNT_WAITING = 'countTaskWaiting';

module.exports = require('BTComposite').extend({
    constructor: function(tasks) {
        this.base(tasks);
    },

    start: function(executor, context) {
        this.setMemory(context, COUNT_WAITING, this.tasks.length);
    },
    end: function(executor, context) {
        this.setMemory(context, COUNT_WAITING, -1);
        // TODO end all tasks if needed
    },
    tick: function(executor, context) {
        // we launch all tasks
        this.tasks.forEach(function(task) {
            executor.start(task, context);
        });

        return WAITING;
    },
    childFinish: function(executor, context, child, success) {
        var left = this.getMemory(context, COUNT_WAITING);

        // We check if we're actually waiting for tasks to finish
        if(left < 0) {
            Log.warn('not waiting for finished task');
            return FAILURE;
        }

        // if child failed, we failed
        if(!success)
            return FAILURE;

        // if not, we finish only if all tasks finished
        this.setMemory(context, COUNT_WAITING, --left);
        return left > 0 ? WAITING : SUCCESS;
    },
});
