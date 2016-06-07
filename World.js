var Helpers = require('Helpers');
// var RoomHandler = require('RoomHandler');

const GARBAGE_DELAY = 10;

function World() {
    this.rooms = {};
    this.memory = Helpers.createMemory('world');
}

World.instance = new World();

/*
World.prototype.garbage = function() {
    var roomHandlers = this.memory.rooms;
    if(!roomHandlers)
        return;

    for(var name in roomHandlers) {
        if(!name in Game.rooms)
            delete roomHandlers[name];
    }
};

World.prototype.updateRooms = function() {
    // on garbage pas tout le temps
    if(Helpers.checkRepeat(this, GARBAGE_DELAY))
        this.garbage();

    // on veut detecter tout de suite un nouveau room
    for(var name in Game.rooms) {
        if(!(name in this.rooms)) 
            this.rooms[name] = new RoomHandler(Game.rooms[name]);
    }
};*/

World.prototype.run = function() {
	/*
    this.updateRooms();

    for(var name in this.rooms) {
        var rh = this.rooms[name];
        rh.run();
    }
    */
};

module.exports = World;
