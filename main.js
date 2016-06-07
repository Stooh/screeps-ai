var LegacyExtends = require('LegacyExtends');
var HelperFunctions = require('HelperFunctions');
var MainBrain = require('MainBrain');

var MainBrain mainBrain = new MainBrain();

module.exports.loop = function () {
    mainBrain.run();

    Helpers.garbageCollection();
}
