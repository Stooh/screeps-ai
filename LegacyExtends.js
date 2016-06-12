var Constants = require('Constants');
var Helpers = require('Helpers');
var Log = require('Log');


var LegacyExtends = {};

// Serialization of room objects
RoomObject.prototype.serialize = function() {
    return {
        parser: 'GameObjectParser',
        id: this.id,
    };
};
///////////


// DISTANCE
RoomObject.prototype.getDistance = function(other) {
    return Helpers.getDistance(this, other);
};

RoomPosition.prototype.getDistance = function(other) {
    return Helpers.getDistance(this, other);
};
//////////////////

///// ENERGY
Creep.prototype.curEnergy = function() {
    return this.carry.energy;
};

Creep.prototype.maxEnergy = function() {
    return this.carryCapacity;
};

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
