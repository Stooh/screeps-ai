var Blackboard = require('Blackboard');
var BTTree = require('BTTree');
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
    this.blackBoard = new BlackBoard(createBehaviourTrees());

    // We start a tree
    // TEST
    this.blackBoard.startBehaviourTree('helloWorld');
}

function runBehaviourTrees(bb) {
    var bb = this.blackBoard;
    var contexts = bb.getBehaviourTreeContexts();
    var bts = bb.getBehaviourTrees();
    var executor = this.executor;
    var l = contexts.length;
    for(var i = 0; i < l; ++i) {
        executor.tick(contexts[i]);
    }
}

MainBrain.prototype.run = function() {
    // TODO run all brains (word/room/unit)
    runBehaviourTrees();
}

module.exports = MainBrain;
