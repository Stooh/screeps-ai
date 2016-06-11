var Parsers = {};

['GameObjectCache'].forEach(function(v) {
    Parsers[v] = require(v).parse;
});

module.exports = Parsers;
