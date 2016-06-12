var Log = require('Log');
var Helpers = require('Helpers');

var BTTreeContext = require('Serializable').extend({
    constructor: function(bb, tree, activeNodes, nodesMemory, sharedMemory) {
        this.bb = bb;
        this.tree = tree;

        this.activeNodes = activeNodes || [];
        this.nodesMemory = nodesMemory || {};
        this.sharedMemory = sharedMemory || {};
    },

    tree: undefined,
    bb: undefined,
    activeNodes: undefined,
    nodesMemory: undefined,
    sharedMemory: undefined,

    onTreeResult: function(result) {
        // TODO
    },

    getBlackboard: function() {
        return bb;
    },

    addActiveNode: function(node) {
        var activeNodes = this.activeNodes;
        if(_.indexOf(activeNodes, node) < 0)
            activeNodes.push(node);
    },

    removeActiveNode: function(node) {
        var activeNodes = this.activeNodes;
        var index = activeNodes.indexOf(node);
        if(index > -1)
            activeNodes.splice(index, 1);
    },

    getActiveNodes: function() {
        return this.activeNodes;
    },

    setSharedMemory: function(key, value) {
        return this.setMemory(null, BTTreeContext.MEM_TREE, key, value);
    },

    getSharedMemory: function(key, defaultValue) {
        return this.getMemory(null, BTTreeContext.MEM_TREE, key, defaultValue);
    },

    checkValidNode: function(node) {
        if(_.isUndefined(node))
            Log.crash('Given node is undefined.');

        if(_.isUndefined(node.id))
            Log.crash('Given node has no id.');
    },

    setNodeMemory: function(node, key, value) {
        return this.setMemory(node, BTTreeContext.MEM_NODE, key, value);
    },

    getNodeMemory: function(node, key, defaultValue) {
        return this.getMemory(node, BTTreeContext.MEM_NODE, key, defaultValue);
    },

    setGlobalMemory: function(key, value) {
        return this.setMemory(null, BTTreeContext.MEM_BLACKBOARD, key, value);
    },

    getGlobalMemory: function(key, defaultValue) {
        return this.getMemory(null, BTTreeContext.MEM_BLACKBOARD, key, defaultValue);
    },

    getMemory: function(node, scope, key, defaultValue) {
        var mem;
        switch(scope) {
            case BTTreeContext.MEM_NODE:
                this.checkValidNode(node);

                var mem = this.nodesMemory[node.id];
                if(!mem)
                    return defaultValue;

                break;
            case BTTreeContext.MEM_TREE:
                mem = this.sharedMemory;
                break;
            case BTTreeContext.MEM_BLACKBOARD:
                mem = this.bb.getGlobalMemory();
                break;
        }

        if(!key in mem)
            return defaultValue;

        return mem[key];
    },

    setMemory: function(node, scope, key, value) {
        var mem;
        switch(scope) {
            case BTTreeContext.MEM_NODE:
                this.checkValidNode(node);

                var nodeId = node.id;
                var nodesMemory = this.nodesMemory;
                var mem = nodesMemory[nodeId];
                if(!mem) {
                    mem = {};
                    nodesMemory[nodeId] = mem;
                }
                break;
            case BTTreeContext.MEM_TREE:
                mem = this.sharedMemory;
                break;
            case BTTreeContext.MEM_BLACKBOARD:
                mem = this.bb.getGlobalMemory();
                break;
        }

        return mem[key] = value;
    },

    serialize: function() {
        return {
            treeName: this.tree.title,
            treeHashCode: this.tree.hashCode,
            activeNodes: _.pluck(this.activeNodes, 'id'),
            nodesMemory: Helpers.serialize(this.nodesMemory),
            sharedMemory: Helpers.serialize(this.sharedMemory),
        };
    },
});

BTTreeContext.parse = function(bb, toParse) {
    if(!bb) {
        Log.warn('No blackboard !');
        return null;
    }

    var treeName = toParse.treeName;
    if(!treeName)
        return null;

    // we check the tree exists
    var tree = bb.getBehaviourTree(treeName);
    if(!tree) {
        Log.warn('No tree with name ' + treeName);
        return null;
    }

    // we check the tree didnt change hashcode
    var treeHashCode = toParse.treeHashCode;
    if(treeHashCode != tree.hashCode) {
        Log.warn('Tree changed hashcode ' + treeName);
        return null;
    }

    // check active nodes are valid
    var activeNodesIds = toParse.activeNodes;
    if(!activeNodesIds) {
        Log.warn('No active nodes');
        return null;
    }

    // we map activeNodes to the real nodes
    var activeNodes = _.map(activeNodesIds, function(id) {return tree.getNodeById(id);});

    if(_.some(activeNodes, _.isUndefined)) {
        Log.warn('Some invalid nodes in ' + activeNodesIds);
        return null;
    }

    return new BTTreeContext(
        bb,
        tree,
        activeNodes,
        Helpers.parse(toParse.nodesMemory),
        Helpers.parse(toParse.sharedMemory));
};

BTTreeContext.MEM_NODE = 0;
BTTreeContext.MEM_TREE = 1;
BTTreeContext.MEM_BLACKBOARD = 2;

module.exports = BTTreeContext;
