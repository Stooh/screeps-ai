var Parsers = {};

['GameObjectParser'].forEach(function(v) {
    Parsers[v] = require(v).parse;
});

module.exports = Parsers;
