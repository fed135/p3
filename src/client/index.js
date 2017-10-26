/**
 * Entry point for the client component
 */

/* Requires ------------------------------------------------------------------*/

const Kalm = require('kalm');
const Schemas = require('../common/schemas');
const Dispatcher = require('../common/dispatcher');
const Logger = require('../common/logger');
const defaults = require('./defaults');
const iv = require('../common/iv');

/* Methods -------------------------------------------------------------------*/

function Client(scope = { isActive: false }) {
    return iv.compose(scope, (ref) => [{
        schemas: Schemas(ref),
        connect: (opts = {}) => {
            opts = Object.assign(opts, defaults);
            ref.handle = Kalm.connect({
                port: opts.port,
                profile: { tick: opts.tick }
            });
            return new Promise((resolveClient) => {
                ref.handle.on('connect', () => {
                    ref.handle.subscribe(1, ref.dispatch.handleRequest);
                    ref.beginHandshake();
                    resolveClient(ref);
                });
            });
        }
    }, {
        logger: Logger(scope),
        dispatch: Dispatcher(ref),
        beginHandshake: () => {
            ref.dispatch.write(ref.handle, 'rpc_hs', 0, {
                active: !!(ref.isActive),
                encrypt: false
            });
        }
    }]);
}

/* Exports -------------------------------------------------------------------*/

module.exports = Client;
