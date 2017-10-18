/**
 * Handles inbound requests, attempts to decode them and assign them
 */

/* Requires ------------------------------------------------------------------*/

const Compactr = require('compactr');

/* Methods -------------------------------------------------------------------*/

function Dispatcher(scope) {
    function handleRequest(frame) {
        console.log('request',frame);
    }

    function handleGossip(frame) {
        console.log('gossip',frame);
    }

    function write(handle, schema, channel, data) {
        return handle.write(channel, scope.schemas.get(schema).write(data))
    }

    return { handleRequest, handleGossip, write };
}

/* Exports -------------------------------------------------------------------*/

module.exports = Dispatcher;
