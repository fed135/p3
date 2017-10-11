# Unamed project

**(WIP)**

An RPC protocol for distributed pub/sub using [Kalm](https://github.com/Kalm) and [Compactr](https://github.com/Compactr)

For simplicity, it will be referred to as "p3".


## Components

### Client

    Connects to a server, collects lists of filtered entities from it and listens for entity events.
    A server-side client can be setup to perform operations like moving data to storage or calculate physics, these would be passive clients.

    Clients can also emit entity events, these are active clients. 

### Server

    A server accepts connections from clients and returns filtered lists of entities. They re-broadcast entity events to all the nodes in the ring. Like distributed datastores, a seed node is responsible for initial registration, after which topology is shared and updated on every node.

    Gossip rounds (while very straigthforward) make sure that events are shared to all nodes in a timely manner.

    Server nodes are connected as passive clients to every other nodes in the ring.

    A node has a local pool of all it's connected client's predicated entities. Once an entity is no longer watched by any connected active clients, it gets dropped from the pool.

### Dashboard

    A web UI to display statistics and monitoring metrics of the system. Connects to the seed node, retreives topology and updates in order to connect to the rest of the ring nodes. 

---

## Events

ID | Code | Description
--- | --- | ---
0 | E_REG | Registering a new entity
1 | E_UPD | Entity update
2 | E_UPG | Entity upgrade, for schema version change
3 | E_LST | Client wants a list of filtered entities
10 | S_REG | Registering a new schema
11 | S_UPD | Creates a new version of an existing schema
20 | H_OPN | Client starts listening for an entity predicate
21 | H_STP | Client pauses listening for an entity predicate
22 | H_RSM | Client resumes listening for an entity predicate
23 | H_FIN | Client stops listening for an entity predicate
100 | S_SYN | Gossip round start for a schema synchronization
101 | S_ACK | Schema synchronization step
102 | S_FIN | End of schema sync
110 | E_SYN | Gossip round start for a entity event synchronization
111 | E_ACK | Entity event synchronization step
112 | E_FIN | End of entity event sync

---

## Notification SLA

### Gossip timing 

- Entity Gossip to all nodes should take <= 11ms (90Hz)
- Schema Gossip to all nodes and all consumers should take <= 16ms (60Hz)
- A warning should trigger in the monitoring dashboard when (x) consecutive rounds take more than (y) ms to complete.  

### Entity pool

- A warning should trigger in the monitoring dashboard when a node's entity pool exceeds (x)

---

## Models

### Entity

```
{
    ts: <timestamp>
    id: <uuid>
    schema: <uuid>
    schemaVersion: <int>
    bound: <uuid>   // Kalm client id
    data: { ... }
}
```

### Schema 

```
{
    ts: <timestamp>
    id: <uuid>
    version: <int>
    schema: { ... }
}
```

### Entity Event

```
{
    id: <uuid> 
    ts: <timestamp>
    <modified property>: <modified value>
    [...]
}
```

---

## Coding examples

### Client

```node
const p3 = require('p3');

// Connects to the server ring using the seed node's ip
const handle = p3.connect({
    host: '0.0.0.0',
    port: 3000,
});

// During handshake, client will receive ring topology and schemas, then emit 'ready'
handle.on('ready', () => {
    console.log(handle.schemas.list());

    // Add a new schema
    const userSchema = handle.schemas.register('user', {
        name: { type: 'string' },
        age: { type: 'unsigned8' }
    });

    // Or update an existing one
    const userSchemaV2 = handle.schemas.update('user', {
        age: { type: 'string' }
    });

    // Register a new entity
    const steve = userSchema.create({
        name: 'steve',
        age: 20
    }, { bound: true });

    // Update it
    steve.update({
        age: 21
    });

    // Upgrade it
    steve.upgrade(userSchemaV2, {
        age: '21yo'
    });

    // Subscribe to updates
    const pipe = steve.subscribe((evt) => {
        console.log(`properties changed on ${steve.data.name}:`, evt);
        // Changes are resolved locally based on the timestamp of the events
    });

    // Pause the influx of events for that entity
    pipe.pause();

    // Resume events (does not replay missed events)
    pipe.resume();

    // Cancel subscription to this entity's events
    pipe.close();

    // Subscribe to a predicate
    userSchema.collect({
        age: { gt: 20 } // Mongod syntax
    }, (entities) => {
        // Returns a list of entities that have the 'age' property greater than 20
        const pipes = entities.map((entity) => entity.subscribe((evt) => {
            console.log(`properties changed on ${entity.data.name}:`, evt);
        }));
    });
});
```

### Server

Start server

```
$ p3 start --seed="0.0.0.0:3000" --dash="0.0.0.0:3001"
```

### Dashboard

Start dashboard

```
$ p3-dash start --seed="0.0.0.0:3000"
```

---

## License

[Apache 2.0](LICENSE) (c) 2017 Frederic Charette
