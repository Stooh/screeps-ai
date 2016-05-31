Log = {};

function _log(gravity, message) {
    console.log(Game.time + ' [' + gravity + '] ' + message);
}

Log.info = function(message) {
    _log('INFO', message);
}

Log.warn = function() {
    _log('WARN', message);
}

Log.error = function() {
    _log('ERROR', message);
}

module.exports = Log;
