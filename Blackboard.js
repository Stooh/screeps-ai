var Log = require('Log');
var Helpers = require('Helpers');
var BTTreeContext = require('BTTreeContext');

function Blackboard(behaviourTrees) {
    // refresh instance
    Blackboard.instance = this;

    this.behaviourTrees = behaviourTrees;

    // loading memory
    var mem = Helpers.MemRoot.memObject('blackboard');
    this.mem = mem;
    this.btContextsMem = mem.memArray('btContextsMemory');
    this.global = mem.memObject('memGlobal');

    // creating context objects from memory
    this.btContexts = _.map(mem.btContextsMem.values(), this.initBehaviourTreeContext, this)
                            .filter(_.isObject);
};

Blackboard.prototype.initBehaviourTreeContext = function(btContextMem, key) {
    var treeTitle = btContextMem.treeName;
    var tree = this.behaviourTrees[treeTitle];
    if(!tree)
        Log.crash('No tree for label ' + treeTitle);

    try {
        return new BTTreeContext(this, btContextMem, tree);
    } catch(ex) {
        Log.warn('Dropping tree context because of exception: ' + ex);
        this.btContextsMem.remove(key);
        return undefined;
    }
};

Blackboard.prototype.getGlobalMem = function() {
    return this.global;
};

Blackboard.prototype.getBehaviourTree = function(label) {
    return this.behaviourTrees[label];
};

Blackboard.prototype.getBehaviourTreeContextsMemory = function() {
    return this.btContextsMem;
};

Blackboard.prototype.getBehaviourTreeContexts = function() {
    return this.btContexts;
};

Blackboard.prototype.isBehaviourTreeRunning = function(treeName) {
    return this.btContexts.some(function(context) {
        return context.tree.title = treeName;
    });
};

Blackboard.prototype.startBehaviourTree = function(treeName, executor) {
    var tree = this.behaviourTrees[treeName];
    if(!tree)
        Log.crash('No tree for label ' + treeName);

    var mem = {};
    this.btContextsMemory.push(mem);

    var res = new BTTreeContext(this, mem, tree);
    this.btContexts.push(res);

    executor.start(tree.root, res);

    return res;
};

Blackboard.prototype.parse = function(value) {
    // we are only interested
    if(value.global)
        this.global = Helpers.parse(value.global);
    if(value.btContexts)
        this.btContexts = value.btContexts.map(BTContext.parse).filter(_.isObject);
};

Blackboard.prototype.serialize = function() {
    return {
        global: Helpers.serialize(this.global),
        btContexts: Helpers.serialize(this.btContexts),
    };
};

// TODO : handle clean up of tree memory

module.exports = Blackboard;
