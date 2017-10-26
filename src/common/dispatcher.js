/**
 * Handles inbound requests, attempts to decode them and assign them
 */

/* Requires ------------------------------------------------------------------*/

const Compactr = require('compactr');
const iv = require('./iv');

/* Methods -------------------------------------------------------------------*/

function Dispatcher(scope) {
    return iv.compose((ref) => [{
        handleRequest: (frame) => {
            console.log('request',frame);
        },
        handleGossip: (frame) => {
            console.log('gossip',frame);
        },
        write: (handle, schema, channel, data) => {
            return handle.write(channel, scope.schemas.get(schema).write(data))
        }
    }]);
}

/* Exports -------------------------------------------------------------------*/

module.exports = Dispatcher;
