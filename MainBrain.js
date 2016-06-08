var Blackboard = require('Blackboard');
var BT = require('BT');

// TODO externalize trees ?
function createBehaviourTrees() {
    var res = {};

    // test tree
    res['helloWorld'] = new BT.Tree('helloWorld',
        new BT.Repeat(
            new BT.TaskCreepSay('Hello World !')
        )
    );

    return res;
};

function MainBrain() {
    this.executor = new BT.Executor();
    this.blackBoard = new Blackboard(createBehaviourTrees());
}

MainBrain.instance = new MainBrain();

function runBehaviourTrees(bb, executor) {
    var contexts = bb.getBehaviourTreeContexts();
    contexts.forEach(function(context) {
        executor.tick(context);
    });
}

MainBrain.prototype.run = function() {
    // We start the main tree if it's not running already
    // TODO TEST
    var bb = this.blackBoard;
    if(!bb.isBehaviourTreeRunning('helloWorld'))
        bb.startBehaviourTree('helloWorld', this.executor);

    // TODO run all brains (word/room/unit)
    runBehaviourTrees(this.blackBoard, this.executor);
}

module.exports = MainBrain;
