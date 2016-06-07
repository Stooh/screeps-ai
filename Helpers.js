var Constants = require('Constants');
var Log = require('Log');

var Helpers = {};


///// DISTANCE
Helpers.getDistance = function(a,b) {
    var ap = _.has(a, 'pos') ? a.pos : a;
    var bp = _.has(b, 'pos') ? b.pos : b;

    // check if we're not in the same room
    if(ap.roomName != bp.roomName) {
        // if not, we give some eval of what the distance may be
        return Constants.DISTANCE_PER_ROOM *
                (1 + Game.map.getRoomLinearDistance(ap.roomName, bp.roomName));
    }

    return Math.abs(ap.x - bp.x) + Math.abs(ap.y - bp.y);
}
///////////////////////

///// MEMORY
Helpers.createMemory = function(label, base, createCallback) {
    var memory = _.isUndefined(base) ? Memory : base.memory;

    // sanity check
    if(!_.isObject(memory))
        Log.crash('given memory is not an object: ' + memory);

    var res = memory[label];
    if(_.isUndefined(res)) {
        createCallback = createCallback || Helpers.OBJECT_CREATE_CALLBACK;
        res = createCallback.apply(null, null);
        memory[label] = res;
    }
    return res;
};
///////////////////

//// GARBAGE COLLECTOR //////////////
// l'objet qui gère si on doit garbage ou pas
const GARBAGE_DELAY = 30;
const CREEP_GARBAGE_EXTRA_DELAY = 30;

Helpers.OBJECT_CREATE_CALLBACK = function() {return {}};
Helpers.ARRAY_CREATE_CALLBACK = function() {return []};

var garbageCollectionMem = {};
garbageCollectionMem.memory = Helpers.createMemory('garbageCollection');

Helpers.getOrCreateFromMemory = function(base, label, createCallback) {
    var res = base.memory[label];
    if(!res) {
        createCallback = createCallback || Helpers.OBJECT_CREATE_CALLBACK;
        res = createCallback.apply(null, null);
        base.memory[label] = res;
    }
    return res;
};

// true if delay cycle or more have passed since last time it returned true
Helpers.checkRepeat = function(base, delay, label) {
	label = label || 'lastUpdateTime';
    var lastUpdate = base.memory[label];
    if(lastUpdate && Game.time - lastUpdate <= delay)
        return false;

    base.memory[label] = Game.time;
    return true;
};

Helpers.garbageCollection =  function() {
    if(!Helpers.checkRepeat(garbageCollectionMem, GARBAGE_DELAY))
        return;

	for(var n in Memory.creeps)
		if(!Game.creeps[n]) {
            // creeps can have memory before being created
            // while they spawn. So we leave them with a little extra time
            var mem = Memory.creeps[n];
            if(!mem.lastGarbageTry) {
                mem.lastGarbageTry = Game.time;
            } else if(Game.time - mem.lastGarbageTry >= CREEP_GARBAGE_EXTRA_DELAY) {
		        delete Memory.creeps[n];
            }
        }

    for(var n in Memory.spawns)
        if(!Game.spawns[n])
            delete Memory.spawns[n];

    for(var n in Memory.rooms)
        if(!Game.rooms[n])
            delete Memory.rooms[n];

    for(var n in Memory.gameObject)
        if(!Game.getObjectById(n))
            delete Memory.gameObject[n];
};
//////////////////////////


// convert {x,y} to integer value
const POS_MUL = Constants.ROOM_SIZE;

Helpers.posToInt = function(pos) {
    return pos.x * POS_MUL + pos.y;
};

Helpers.intToPos = function(value) {
    var y = value % POS_MUL;
    var x = (value - y) / POS_MUL;
    return {x: x, y: y};
};
///////////////////////////

module.exports = Helpers;
