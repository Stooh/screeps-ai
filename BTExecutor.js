var BTTask = require('BTTask');
var Queue = require('Queue');
var Log = require('Log');

module.exports = require('Base').extend({
    constructor: function() {
        this.queue = new Queue();
        this.running = false;
    },

    toTick: undefined,
    running: false,

    start: function(task, context) {
        // register as active node if not already the case
        if(!this.registerStart(task, context))
            return false;

        if(!task.checkConditions(context))
            Log.crash('Conditions not satisfied for task: ' + this.constructor.name);

        task.start(this, context);

        // if we're running, we enqueue it for a tick
        if(this.running)
            this.toTick.enqueue(task);

        return true;
    },
    end: function(task, context) {
        // we remove the task from the active nodes, if it was there in the first place
        if(!this.registerEnd(task, context))
            return false;

        task.end(this, context);
    },
    wait: function(task, context) {
        this.registerEnd(task, context);
    },
    registerStart: function(task, context) {
        return context.addActiveNode(task);
    },
    registerEnd: function(task, context) {
        return context.removeActiveNode(task);
    },
    childFinish: function(context, child, parent, res) {
        if(res == BTTask.WAITING) {
            // we dont need tick, but we're not finished yet
            this.wait(child, context);
        } else if(res == BTTask.RUNNING) {
            // might be possible for a recursive call
            // a parent is starting again to run, from a waiting state
            // we dont tick it, because it can do work itself in the
            // childFinished call
            this.registerStart(child, context);
        } else {
            // here the child finish executing
            if(!this.end(child, context))
                Log.warn('Child was already finished: ' + child.id);

            // check if we finished the tree
            if(_.isUndefined(parent)) {
                context.onTreeResult(res);
                return;
            }

            // if not, we transmit the result to the parent
            // but we might have to transmit the parent's answer to the grandparent as well
            // so we get its value now, just in case it might be modified
            var grandParent = parent.parent;
            var parentRes = parent.childFinish(this, context, child, res == BTTask.SUCCESS);

            // if parent task finishes, we must now report its success too
            if(parentRes != BTTask.RUNNING && parentRes != BTTask.WAITING)
                this.childFinish(context, parent, grandParent, parentRes);
        }
    },
    tick: function(context) {
        this.running = true;

        var activeNodes = context.getActiveNodes();
        if(activeNodes.length == 0) {
            // No active nodes, it's a failure, it shouldnt happen
            context.onTreeResult(BTTask.FAILURE);
            return;
        }

        // we give a copy because we want to be able to modify active nodes
        this.toTick = new Queue(activeNodes);
        this._tick(context);

        this.running = false;
    },
    _tick: function(context) {
        if(!this.running)
            Log.crash('Invalid state, not running');

        // We tick all actives nodes
        var toTick = this.toTick;
        while(!toTick.isEmpty()) {
            var activeNode = toTick.dequeue();

            var res = activeNode.tick(this, context);

            // if it's not running anymore, we have to unregister the task
            // and give the result to the parent
            if(res != BTTask.RUNNING)
                this.childFinish(context, activeNode, activeNode.parent, res);
        }
    }
});
