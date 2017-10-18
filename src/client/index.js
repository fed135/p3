/**
 * Entry point for the client component
 */

/* Requires ------------------------------------------------------------------*/

const Kalm = require('kalm');
const Schemas = require('../common/schemas');
const Dispatcher = require('../common/dispatcher');
const Logger = require('../common/logger');
const defaults = require('./defaults');

/* Methods -------------------------------------------------------------------*/

function Client(scope = { isActive: false }) {
    function connect(opts = {}) {
        opts = Object.assign(opts, defaults);
        scope.handle = Kalm.connect({
            port: opts.port,
            profile: { tick: opts.tick }
        });
        scope.logger = Logger({ node: scope.handle.id });
        return new Promise((resolveClient) => {
            scope.handle.on('connect', () => {
                scope.handle.subscribe(1, dispatcher.handleRequest);
                beginHandshake();
                resolveClient(scope);
            });
        });
    }

    function beginHandshake() {
        dispatcher.write(scope.handle, 'rpc_hs', 0, {
            active: !!(scope.isActive),
            encrypt: false
        });
    }

    const dispatcher = Dispatcher(scope);
    scope.schemas = Schemas(scope);

    return Object.assign(scope, { connect });
}

/* Exports -------------------------------------------------------------------*/

module.exports = Client;
