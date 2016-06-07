var Log = require('Log');
var Helpers = require('Helpers');

function Blackboard(behaviourTrees) {
    this.behaviourTrees = behaviourTrees;
    var mem = Helpers.createMemory('blackboard')
    this.memory = mem;
    if(!('global' in mem))
        mem.global = {};
    if(!('btContexts' in mem))
        mem.btContextsMemory = [];
    this.btContextsMemory = mem.btContextsMemory;
    this.btContexts = mem.btContextsMemory.map(this.initBehaviourTreeContext, this);
};

BlackBoard.initBehaviourTreeContext = function(btContextMem) {
    var treeTitle = btContextMem.treeName;
    var tree = this.behaviourTrees[treeTitle];
    if(!tree)
        Log.crash('No tree for label ' + treeTitle);

    return new BTTreeContext(this, btContextMem, tree);
};

Blackboard.instance = new Blackboard();

Blackboard.prototype.getGlobalMemory = function() {
    return this.memory.global;
};

Blackboard.prototype.getBehaviourTree = function(label) {
    return this.behaviourTrees[label];
};

Blackboard.prototype.getBehaviourTreeContextsMemory = function() {
    return this.btContextsMemory;
};

Blackboard.prototype.startBehaviourTree = function(treeName) {
    var tree = this.behaviourTrees[treeTitle];
    if(!tree)
        Log.crash('No tree for label ' + treeTitle);

    var mem = {};
    this.btContextsMemory.push(mem);

    return new BTTreeContext(this, mem, tree);
};

// TODO : handle clean up of tree memory

module.exports = Blackboard;
