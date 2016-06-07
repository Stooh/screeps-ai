Log = {};

function _log(gravity, message) {
    console.log(Game.time + ' [' + gravity + '] ' + message);
}

Log.info = function(message) {
    _log('INFO', message);
}

Log.warn = function(message) {
    _log('WARN', message);
}

Log.error = function(message) {
    _log('ERROR', message);
}

Log.crash = function(message) {
    throw new Error(Game.time + ' > ' + message);
}

module.exports = Log;
