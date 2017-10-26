/**
 * Low resolution timer
 */

/* Requires ------------------------------------------------------------------*/

const iv = require('./iv');

/* Methods -------------------------------------------------------------------*/

function LRTimer(scope = {}) {
    return iv.compose(scope, (ref) => [{
        read: () => ref.val
    }, {
        val: 0,
        inc: scope.rate || 16,
        step: () => {
            setTimeout(ref.step, ref.inc);
            ref.val = Date.now();
            return ref;
        }
    }]);
}

/* Exports -------------------------------------------------------------------*/

module.exports = LRTimer;
