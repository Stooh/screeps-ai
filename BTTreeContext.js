var Log = require('Log');
var Helpers = require('Helpers');

module.exports = require('Base').extend({
    constructor: function(bb, memory, tree) {
        this.bb = bb;
        this.memory = memory;
        this.tree = tree;
        this.activeNodesMemory = Helpers.createMemory('activeNodes', this, Helpers.ARRAY_CREATE_CALLBACK);
        this.nodesMemory = Helpers.createMemory('nodes', this);
        this.sharedMemory = Helpers.createMemory('shared', this);

        this.init();
    },

    tree: undefined,
    bb: undefined,
    memory: undefined,
    activeNodesMemory: undefined,
    nodesMemory: undefined,
    sharedMemory: undefined,

    init: function() {
        // check if we're recoving an existing state
        // or if we need to init a new one
        var memory = this.memory;

        var treeHashCode = this.tree.hashCode;
        var memTreeHashCode = memory.treeHashCode;

        if(_.isUndefined(memTreeHashCode)) {
            // init a new memory
            memory.treeHashCode = treeHashCode;

            // check other memories
            // sanity checks
            if(this.activeNodesMemory.length > 0)
                Log.crash('No tree hashcode, but we got active nodes');
            if(Object.keys(this.nodesMemory).length > 0)
                Log.crash('No tree hashcode, but we got node memories');
            if(Object.keys(this.sharedMemory).length > 0)
                Log.crash('No tree hashcode, but we got shared memories');
        } else if(treeHashCode != memTreeHashCode) {
            Log.crash('Wrong tree hashcode: ' + treeHashCode + ' vs ' + memTreeHashCode);
        }

        // TODO : check if activeNodesIds / node memories are correct ?

        // here everything's ok
    },

    onTreeResult: function(result) {
        // TODO
    },

    getBlackboard: function() {
        return bb;
    },

    addActiveNode: function(node) {
        var nodeId = node.id;
        var activeNodesIds = this.activeNodesMemory;
        if(_.indexOf(activeNodesIds, nodeId) < 0)
            activeNodesIds.push(nodeId);
    },

    removeActiveNode: function(node) {
        var nodeId = node.id;
        var activeNodesIds = this.activeNodesMemory;
        var index = activeNodesIds.indexOf(nodeId);
        if(index > -1)
            activeNodesIds.splice(index, 1);
    },

    getActiveNode: function(nodeId) {
        var node = this.tree.getNodeById(nodeId);
        if(_.isUndefined(node))
            Log.crash('Missing node: ' + nodeId + ' for tree ' + this.treeTitle);

        return node;
    },

    getActiveNodes: function() {
        return this.activeNodesMemory.map(this.getActiveNode, this);
    },

    setSharedMemory: function(key, value) {
        return this.sharedMemory[key] = value;
    },

    getSharedMemory: function(key, defaultValue) {
        return this._getMemory(this.sharedMemory, key, defaultValue);
    },

    checkValidNode: function(node) {
        if(_.isUndefined(node))
            Log.crash('Given node is undefined.');

        if(_.isUndefined(node.id))
            Log.crash('Given node has no id.');
    },

    setNodeMemory: function(node, key, value) {
        this.checkValidNode(node);

        return this._setMemory(this.nodesMemory, node.id, key, value);
    },

    getNodeMemory: function(node, key, defaultValue) {
        this.checkValidNode(node);

        return this._getMemory(this.nodesMemory[node.id], key, defaultValue);
    },

    setGlobalMemory: function(key, value) {
        var mem = this.getBlackboard().getGlobalMemory();
        return mem[key] = value;
    },

    getGlobalMemory: function(key, defaultValue) {
        var mem = this.getBlackboard().getGlobalMemory();
        if(!(key in mem))
            return defaultValue;
        return mem[key];
    },

    _setMemory: function(baseMemory, firstKey, secondKey, value) {
        var mem;
        if(!(firstKey in baseMemory)) {
            mem = baseMemory = {};
        } else {
            mem = baseMemory[firstKey];
        }

        return mem[secondKey] = value;
    },

    _getMemory: function(memory, key, defaultValue) {
        if(_.isUndefined(memory))
            return defaultValue;
        if(!(key in memory))
            return defaultValue;
        return memory[key];
    },
});
