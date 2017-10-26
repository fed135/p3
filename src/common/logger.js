/**
 * Basic logger
 */

/* Requires ------------------------------------------------------------------*/

const LRTimer = require('./lrtimer');
const iv = require('./iv');

/* Local variables -----------------------------------------------------------*/

const timer = LRTimer().step();

function Logger(scope = {}) {
    return iv.compose((ref) => [{
        log: (msg) => ref._wrap(ref.stdOut, 'log', msg),
        warn: (msg) => ref._wrap(ref.stdOut, 'warn', msg),
        error: (msg) => ref._wrap(ref.stdErr, 'error', msg),
        exception: (err) => ref._wrap(ref.stdErr, 'critical', err),
    }, {
        stdOut: scope.stdOut || process.stdout,
        stdErr: scope.stdErr || process.stderr,
        _wrap: (out, level, msg) => {
            return out.write(JSON.stringify({ node: scope.name, level, msg, timestamp: timer.read() }) + '\n');
        }
    }]);
}

/* Exports -------------------------------------------------------------------*/

module.exports = Logger;
