var Log = require('Log');
var BTTask = require('BTTask');

const CUR_TASK = 'curTask';

module.exports = require('BTComposite').extend({
    constructor: function(tasks) {
        this.base(tasks);
    },

    start: function(executor, context) {
        this.setMemory(context, CUR_TASK, 0);
    },
    end: function(executor, context) {
        this.setMemory(context, CUR_TASK, -1);
        // TODO end cur task if needed
    },
    getCurTaskIndex: function(context) {
        return this.getMemory(context, CUR_TASK);
    },
    nextTask: function(executor, context, taskIndex) {
        var curTask = taskIndex || this.getCurTaskIndex(context);

        // not running
        if(curTask < 0) {
            Log.warn('Running not started sequence');
            return BTTask.FAILURE;
        }

        // if we are over the list length, we have finished
        if(curTask >= this.tasks)
            return BTTask.SUCCESS;

        // We start current task
        executor.start(this.tasks[curTask], context);
        return BTTask.WAITING;
    },
    tick: function(executor, context) {
        // we start the first children, we will continue in childFinish
        return nextTask(executor, context);
    },
    childFinish: function(executor, context, child, success) {
        // We check it's the current task
        var curTask = this.getCurTaskIndex(context);
        if(curTask < 0 || curTask >= this.tasks) {
            Log.warn('the finished task is not current one');
            return BTTask.FAILURE;
        }

        // if child failed, we failed
        if(!success)
            return BTTask.FAILURE;

        // if not, we launch next task (or finish)
        this.setMemory(context, CUR_TASK, ++curTask);
        return nextTask(executor, context, curTask);
    },
});
