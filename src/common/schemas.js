/**
 * Schema pool
 */

/* Requires ------------------------------------------------------------------*/

const Compactr = require('compactr');
const iv = require('./iv');

/* Methods -------------------------------------------------------------------*/

function Schemas(scope) {
    return iv.compose((ref) => [{
        get: (name) => {
            // TODO
            return ref.build(name);
        }
    }, {
        build: (name) => {
            // TODO
            return name;
        }
    }]);
}

/* Exports -------------------------------------------------------------------*/

module.exports = Schemas;
