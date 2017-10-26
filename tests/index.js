require('../src/server')()
    .start()
    .then((server) => {
        console.log('server', server);

        require('../src/client')()
            .connect()
            .then((client) => {
                console.log('client', client);
            });
    });