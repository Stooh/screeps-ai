var GameObjectCache = require('Serializable').extend({
    constructor: function(gameObject) {
        this.go = gameObject;
    },
    id: 0,
    go: undefined,
    get: function() {
        return this.go;
    },
    set: function(value) {
        this.go = value;
    },
    serialize: function() {
        var go = this.go;
        return {
            parser: 'GameObjectCache',
            id: go.id,
        };
    },
});

GameObjectCache.parse(toParse) {
    var id = toParse.id;
    if(!id)
        return null;

    var go = Game.getObjectById(id);
    if(_.isNull(go))
        return null;

    return new GameObjectCache(go);
};

module.exports = GameObjectCache;
