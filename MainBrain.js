var Blackboard = require('Blackboard');
var BTTree = require('BTTree');
var BTExecutor = require('BTExecutor');
var BTRepeat = require('BTRepeat');
var BTTaskCreepSay = require('BTTaskCreepSay');

// TODO externalize trees ?
function createBehaviourTrees() {
    var res = {};

    // test tree
    res['helloWorld'] = new BTTree('helloWorld',
        new BTRepeat(
            new BTTaskCreepSay('Hello World !')
        )
    );

    return res;
};

function MainBrain() {
    this.executor = new BTExecutor();
    this.blackBoard = new Blackboard(createBehaviourTrees());

    // We start a tree
    // TEST
    this.blackBoard.startBehaviourTree('helloWorld');
}

function runBehaviourTrees(bb, executor) {
    var contexts = bb.getBehaviourTreeContexts();
    contexts.forEach(function(context) {
        executor.tick(context);
    });
}

MainBrain.prototype.run = function() {
    // TODO run all brains (word/room/unit)
    runBehaviourTrees(this.blackBoard, this.executor);
}

module.exports = MainBrain;
