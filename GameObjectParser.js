var GameObjectParser = {};

GameObjectParser.parse = function(toParse) {
    var id = toParse.id;
    if(!id)
        return null;

    return Game.getObjectById(id);
};

module.exports = GameObjectParser;
