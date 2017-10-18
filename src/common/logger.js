/**
 * Basic logger
 */

/* Requires ------------------------------------------------------------------*/

const LRTimer = require('./lrtimer');

/* Local variables -----------------------------------------------------------*/

const timer = LRTimer();

function Logger(scope={}) {
    const stdOut = scope.stdOut || process.stdout;
    const stdErr = scope.stdErr || process.stderr;

    function log(msg) {
        return _wrap(stdOut, 'log', msg);
    }

    function warn(msg) {
        return _wrap(stdOut, 'warn', msg);
    }

    function error(msg) {
        return _wrap(stdErr, 'err', msg);
    }

    function exception(err) {
        return _wrap(err);
    }

    function _wrap(out, level, msg) {
        return out.write(JSON.stringify({ node: scope.id, level, msg, timestamp: timer.read() }) + '\n');
    }

    return { log, warn, error, exception };
}

/* Exports -------------------------------------------------------------------*/

module.exports = Logger;
