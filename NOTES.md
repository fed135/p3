Realtime sync engine

- distributed
- synchronized (timezone-agnostic)
- get past, present and future frames
- uuid on world entities
- frame types (verified, predicted, generated, corrected)

deployment options

- single instance, single node
- single instance, multi nodes
- mulit instances, single node

data store COULD be a db. 


types of trackable events

- user input ({ x: on | off }), isOn()
- game events ({ name, type, originalFrame, data })
- world entities ({ [attribute]: Number{ min, max, current() }})


interface example

const p3 = new P3Client({
  host: '0.0.0.0',
  port: 8000,
  transport: (kalm transports),
  sendRate: 60,
  instanceId: 2983209843,
});

p3.getFrame(int) -x / +x
p3.emitEvent({})
p3.createEntity(typeName, { [x]: y }, ) => entityId
p3.updateEntity(entityId, { [x]: y }) => entityId
p3.setInputState(entityId, {input: boolean})
p3.on('frame')
p3.on('connect')
p3.on('disconnect')

const p3 = new P3Server({
  host: '0.0.0.0',
  port: 8000,
  transport: (kalm transports),
  tickRate: 90,
  bufferFrame: 20,
  instanceId : w9823094 OR auto-generated
  // distributed poutine
});

p3.createEntityType(typeName, { 
    fields: { 
        props [x]: { interpolate:, min:, max:, dataType: 'number', accessControl: 'client'|'server'|'seed' }
    },
    connectionBound: true 
})
p3.on('tick', ())
connection.on('entityCreated', ())
p3.on('connection', ())
p3.on('disconnection', ())
p3.getConnections()
    connection.getEntities()
p3.on('frameDropped')

frame example

{
    id: 200,
    type: 'verified',
    events: [{
        name: 'boss_spawned',
        type: 'world_events',
        originalFrame: 198,
        data: 'orlok_1,1000,250,80',
    }],
    entities: [{
        id: '123',
        age: 10,
        input: {
            up: true,
        },
    }]
    getWorldEntities(),
}


-----------------

data structure

{
    entities: [
        {
            id: ...
            typeName
            firstSeen
            lastSeen
            data: 
            connectionId
        }
    ],
    connections: [
        {
            id:
            firstSeen
            lastSeen
            entities
        }
    ],
    frames: [
        {
            id:
            globalTimeDesynced:
            events: [
                {...}
            ],
            entityUpdates: [
                {...}
            ]
        }
    ]
}

