/**
 * Low resolution timer
 */

/* Methods -------------------------------------------------------------------*/

function LRTimer(scope={}) {
  let val = 0;
  let inc = scope.rate || 16;

  function read() {
    return val;
  }

  function step() {
    setTimeout(step, inc);
    val = Date.now();
  }

  step();

  return { read };
}

/* Exports -------------------------------------------------------------------*/

module.exports = LRTimer;
