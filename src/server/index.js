/**
 * Entry point for the server component
 */

/* Requires ------------------------------------------------------------------*/

const Kalm = require('kalm');
const Schemas = require('../common/schemas');
const Dispatcher = require('../common/dispatcher');
const Logger = require('../common/logger');
const defaults = require('./defaults');

/* Methods -------------------------------------------------------------------*/

function Server(scope = {}) {
    function start(opts = {}) {
        opts = Object.assign(opts, defaults);
        scope.server = Kalm.listen({
            port: opts.port,
            profile: { tick: opts.tick }
        });
        const dispatch = Dispatcher(scope);
        scope.logger = Logger({ node: scope.server.id });
        if (!opts.isSeed) {
            return new Promise((resolveClient) => {
                scope.logger.log(`Connecting to seed host ${opts.seedHost}:${opts.seedPort}`);
                scope.seedNode = Kalm.connect({ host: opts.seedHost, port: opts.seedPort });
                scope.seedNode.on('connect', () => {
                    scope.logger.log(`Connected to seed host`);
                    scope.seedNode.subscribe(0, dispatch.handleGossip);
                    resolveClient(scope);
                });
            });
        }

        scope.server.on('connection', (client) => {
            client.subscribe(1, dispatch.handleRequest);
        })
        return Promise.resolve(scope);
    }
    
    scope.schemas = Schemas(scope);

    return Object.assign(scope, { start });
}

/* Exports -------------------------------------------------------------------*/

module.exports = Server;
