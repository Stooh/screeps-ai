var BTTask = require('BTTask');

module.exports = require('Base').extend({
    start: function(task, context) {
        this.registerStart(task, context);
        if(!task.checkConditions(context))
            Log.crash('Conditions not satisfied for task: ' + this.constructor.name);
        task.start(this, context);
    },
    end: function(task, context) {
        this.registerEnd(task, context);
        task.end(this, context);
    },
    wait: function(task, context) {
        this.registerEnd(task, context);
    },
    registerStart: function(task, context) {
        context.addActiveNode(task);
    },
    registerEnd: function(task, context) {
        context.removeActiveNode(task);
    },
    childFinish: function(child, context, parent, res) {
        if(res == BTTask.WAITING) {
            // we dont need tick, but we're not finished yet
            this.wait(child, context);
        } else if(res == BTTask.RUNNING) {
            // might be possible for a recursive call
            this.registerStart(child, context);
        } else {
            // here the child finish executing
            this.end(child, context);

            // check if we finished the tree
            if(_.isUndefined(parent)) {
                context.onTreeResult(res);
                return;
            }

            // if not, we transmit the result to the parent
            // but we might have to transmit the parent's answer to the grandparent as well
            // so we get its value now, just in case it might be modified
            var grandParent = parent.parent;
            var parentRes = parent.childFinish(this, context, child, ending.res == BTTask.SUCCESS);

            // if parent task finishes, we must now report its success too
            if(parentRes != BTTask.RUNNING && parentRes != BTTask.WAITING) {
                this.childFinish(parent, context, grandParent, parentRes);
            }
        }
    },
    tick: function(context) {
        /*
         * TODO gérer le fait qu'un parent peut lancer un child
         * dans son tick -> lequel ne sera tick qu'au tick suivant
         */
        var activeNodes = context.getActiveNodes();

        // We tick all actives nodes, and get thoses that finished
        var endings = [];
        for(var activeNode of activeNodes) {
            var res = activeNode.tick(this, context);

            // if it's not running anymore, we have to unregister the task
            // But we dont want any concurent modif, we do that later
            if(res != BTTask.RUNNING)
                endings.push({node: activeNode, res: res, parent: activeNode.parent});
        }

        // Now we handle finishing nodes
        endings.forEach(function(ending) {
                this.childFinish(ending.node, context, ending.parent, ending.res);
            },
            this
        );
    }
});
