var LegacyExtends = require('LegacyExtends');
var Helpers = require('Helpers');
var MainBrain = require('MainBrain');

module.exports.loop = function () {
    MainBrain.instance.run();

    //Helpers.garbageCollection();
}
