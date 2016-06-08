var BT = {};

[
    'Task',
    'Composite',
    'Decorator',
    'Executor',
    'Inverter' ,
    'Parallel',
    'PopFromStack',
    'PushToStack',
    'Repeat',
    'RepeatUntilFail',
    'Sequence',
    'Succeeder',
    'TaskCreepSay',
    'TaskLeaf',
    'Tree',
    'TreeContext',
].forEach(function(v) {
    BT[v] = require('BT' + v);
});

module.exports = BT;
