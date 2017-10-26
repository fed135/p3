/**
 * Entry point for the server component
 */

/* Requires ------------------------------------------------------------------*/

const Kalm = require('kalm');
const Schemas = require('../common/schemas');
const Dispatcher = require('../common/dispatcher');
const Logger = require('../common/logger');
const defaults = require('./defaults');
const iv = require('../common/iv');

/* Methods -------------------------------------------------------------------*/

function Server(scope) {
    return iv.compose(scope, (ref) => [{
        schemas: Schemas(ref),
        start: (opts = {}) => {
            opts = Object.assign(opts, defaults);
            ref.server = Kalm.listen({
                port: opts.port,
                profile: { tick: opts.tick }
            });
            
            if (!opts.isSeed) {
                return new Promise((resolveClient) => {
                    ref.logger.log(`Connecting to seed host ${opts.seedHost}:${opts.seedPort}`);
                    ref.seedNode = Kalm.connect({ host: opts.seedHost, port: opts.seedPort });
                    ref.seedNode.on('connect', () => {
                        ref.logger.log(`Connected to seed host`);
                        ref.seedNode.subscribe(0, ref.dispatch.handleGossip);
                        resolveClient(ref);
                    });
                });
            }

            ref.server.on('connection', (client) => {
                client.subscribe(1, ref.dispatch.handleRequest);
            })
            return Promise.resolve(ref);
        }
    }, {
        server: null,
        seedNode: null,
        dispatch: Dispatcher(ref),
        logger: Logger(scope)
    }]);
}

/* Exports -------------------------------------------------------------------*/

module.exports = Server;
