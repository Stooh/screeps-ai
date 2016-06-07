var Constants = require('Constants');
var Helpers = require('Helpers');
var Log = require('Log');


var LegacyExtends = {};

/// MEMORIES
function createMem(go) {
    if(_.isUndefined(Memory.gameObject))
        Memory.gameObject = {};
    if(!_.isObject(Memory.gameObject))
        Log.crash('Memory.gameObject is not an object: ' + Memory.gameObject);

    return Memory.gameObject[go.id] = go.memory = {};
};


RoomObject.prototype.getCreateMem = function() {
    return _.isUndefined(this.memory) ?
        createMem(this)
        : this.memory;
};

RoomObject.prototype.getExistingMem = function() {
    return this.memory;
};

// Existing memory should be quick to access
[Creep, StructureSpawn].forEach(function(v) {
    v.prototype.getCreateMem = function() {
        return this.memory;
    };

    v.prototype.getExistingMem = function() {
        return this.memory;
    }
});
////


RoomObject.prototype.memGet = function(label, defaultValue) {
    var mem = this.getExistingMem();
    return _.isObject(mem) && _.has(mem, label) ? mem['label'] : defaultValue;
};

RoomObject.prototype.memSet = function(label, value) {
    return this.getCreateMem()[label] = value;
};
//////////////////

/*
[StructureExtension, Source, ConstructionSite].forEach(
    function(v) {
        if(v.prototype.hasOwnProperty('memory'))
            return;

        Object.defineProperty(v.prototype, 'memory', {
            get: function() {
                if(_.isUndefined(Memory.gameObject)) {
                    Memory.gameObject = {};
                }
                if(!_.isObject(Memory.gameObject)) {
                    return undefined;
                }
                return Memory.gameObject[this.id] = Memory.gameObject[this.id] || {};
            },
            set: function(value) {
                if(_.isUndefined(Memory.gameObject)) {
                    Memory.gameObject = {};
                }
                if(!_.isObject(Memory.gameObject)) {
                    throw new Error('Could not set gameObject memory');
                }
                Memory.gameObject[this.id] = value;
            }
        })
    }
);
*/


// DISTANCE
RoomObject.prototype.getDistance = function(other) {
    return Helpers.getDistance(this, other);
};

RoomPosition.prototype.getDistance = function(other) {
    return Helpers.getDistance(this, other);
};
//////////////////

///// ENERGY

/*
Creep.prototype.usesEnergyTransfer = function() {
    return this.memory.role == 'builder'
    || this.memory.role == 'upgrader'
    || this.memory.role == 'harvester'
    || this.memory.role == 'repair';
}

Creep.prototype.wantsGiveEnergy = function() {
    return this.memory.role == 'harvester';
}

Creep.prototype.needsEnergyTransfer = function() {
    return this.memory.role != 'energy' &&
    this.memory.role != 'harvester' &&
    this.memory.role != 'spawner' &&
    this.carry.energy < this.carryCapacity;
}
*/

Creep.prototype.curEnergy = function() {
    return this.carry.energy;
};

Creep.prototype.maxEnergy = function() {
    return this.carryCapacity;
};


/*
Structure.prototype.usesEnergyTransfer = function() {
    return this.maxEnergy() > 0;
}

Structure.prototype.wantsGiveEnergy = function() {
    return false;
}

Structure.prototype.needsEnergyTransfer = function() {
    return this.energy < this.energyCapacity;
} */

Structure.prototype.curEnergy = function() {
    return this.energy;
};

Structure.prototype.maxEnergy = function() {
    return this.energyCapacity;
};
//////////////////

////// Room handler
Room.prototype.getHandler = function() {
    return World.instance.rooms[this.name];
};
////////////


//////// String hashcode
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
////////////////////

module.exports = LegacyExtends;
