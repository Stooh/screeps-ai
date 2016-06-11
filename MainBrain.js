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
};

MainBrain.instance = new MainBrain();

function runBehaviourTrees(bb, executor) {
    var contexts = bb.getBehaviourTreeContexts();
    contexts.forEach(function(context) {
        executor.tick(context);
    });
};

MainBrain.prototype.checkMainTreeRunning = function() {
    // We start the main tree if it's not running already
    var bb = this.blackBoard;
    if(!bb.isBehaviourTreeRunning('helloWorld'))
    bb.startBehaviourTree('helloWorld', this.executor);
};

MainBrain.prototype.run = function() {
    this.loadBlackboard();

    this.checkMainTreeRunning();

    // run all trees
    runBehaviourTrees(this.blackBoard, this.executor);

    this.saveBlackboard();
};

MainBrain.prototype.loadBlackboard = function() {
    var parsed = JSON.parse(RawMemory.get())
    Memory = parsed; // does it work ?
    this.bb.parse(parsed);
};

MainBrain.prototype.saveBlackboard = function() {
    RawMemory.set(JSON.stringify(this.bb.serialize()));
};

module.exports = MainBrain;
