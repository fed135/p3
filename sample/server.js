const p3 = require('../packages/server');
const ws = require('@kalm/ws');

const models = {
    player_contoller: {
        fields: {
            mouse_x: {
                type: 'number',
                /*interpolate: false,
                min: -Number.MAX_SAFE_INTEGER,
                max: Number.MAX_SAFE_INTEGER,*/
                access: 'client',
            },
            mouse_y: {
                type: 'number',
                /*interpolate: false,
                min: -Number.MAX_SAFE_INTEGER,
                max: Number.MAX_SAFE_INTEGER,*/
                access: 'client',
            },
        },
        connectionBound: true,
    },      
};

const server = p3.connect({
    host: '0.0.0.0',
    port: 3000,
    transport: ws(),
});

Object.keys(models).forEach(model => server.createEntityType(model, ...models[model]));


server.on('frame', (data, commit) => {
    // Sum of data collected into a provisional frame

    // React on, or modify the data, then commit the changes. This will insert the frame into the store
    commit({ ...data, foo: 123 });
})


server.on('connection', (connection) => {
    console.log('new connection')

    connection.on('entityCreated', (data, commit) => {
        // Provisional entity data
        console.log('entity created', data)
        
        console.log('entities!', server.getEntities())
    });
})
server.on('disconnection', () => {
    console.log('lost connection')
})

server.on('frameDropped', () => {
    console.log('frame dropped')
})

server.on('frameDeleted', () => {

})