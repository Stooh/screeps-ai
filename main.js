var LegacyExtends = require('LegacyExtends');
var Helpers = require('Helpers');
var MainBrain = require('MainBrain');

var mainBrain = new MainBrain();

module.exports.loop = function () {
    mainBrain.run();

    Helpers.garbageCollection();
}
