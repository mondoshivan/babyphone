const Router = require('./router');
const asyncHandler = require('express-async-handler');
const WebSocket = require('ws');
const Duplex = require('stream').Duplex;
const wav = require('wav');
const debug = require('debug')('babyphone:index_router');
const path = require('path');
const DatabaseHandler = require('../lib/database_handler');
const NotificationHandler = require('../lib/notification_handler');

class SubRouter extends Router {

    constructor() {
        super();

        this.get('/', (req, res) => {
            const file = path.join(process.env['PROJECT_ROOT']+"/angular/dist/angular/index.html");
            console.log(`file: ${file}`);
            res.sendFile(file);
        });

        this.get('/api/hello', (req, res) => {
            res.send({response: 'hello'});
        });

        this.get('/api/ping', (req, res) => {
            res.status(200);
            res.send('');
        });

        this.delete('/item', asyncHandler(async (req, res, next) => {
            const id = req.body.id;
            if (!id) {
                res.status(422);
                res.send('parameter is missing');
            } else {
                const params = { id: id };
                const collection = 'Index';
                const dbHandler = new DatabaseHandler();
                const result = await dbHandler.deleteOne(collection, params);
                if (!result) {
                    res.status(404);
                    res.send('not found');
                } else {
                    res.send(result);
                }
            }
        }));

        this.put('/item', asyncHandler(async (req, res, next) => {
            const id = req.body.id;
            const item = req.body.item;

            if (!id || !item) {
                res.status(422);
                res.send('parameter is missing');
            } else {
                const params = { id: id};
                const changes = { item: item};
                const collection = 'Index';
                const dbHandler = new DatabaseHandler();
                const result = await dbHandler.updateOne(collection, params, changes);
                if (!result) {
                    res.status(404);
                    res.send('not found');
                } else {
                    res.send(result);
                }
            }
        }));

        this.get('/api/clients', asyncHandler(async (req, res, next) => {
            const dbHandler = new DatabaseHandler();
            const clients = await dbHandler.find('Clients', { status: 'available' });
            res.send(clients);
        }));

        this.post('/api/client/baby', asyncHandler(async (req, res, next) => {
            const clientIp = req.connection.remoteAddress;
            const dbHandler = new DatabaseHandler();
            const client = await dbHandler.findClient({ip: clientIp});
            const collection = 'Clients';
            if (client) {
                const params = { _id: client._id};
                const changes = { name: req.body.name, gender: req.body.gender };
                const result = await dbHandler.updateOne(collection, params, changes);
                res.send(result);
            } else {
                res.status(404);
                res.send('not found');
            }
        }));

        this.get('/api/client/baby', asyncHandler(async (req, res) => {
            const dbHandler = new DatabaseHandler();
            const client = await dbHandler.findClient({ id: req.query.clientId });
            if (client) {
                res.send(client);
            } else {
                res.status(400);
                res.send('Client ID does not exist');
            }
        }));

        this.put('/api/client/available', asyncHandler(async (req, res, next) => {
            const clientIp = req.connection.remoteAddress;
            const dbHandler = new DatabaseHandler();
            const client = await dbHandler.findClient({ip: clientIp});
            const collection = 'Clients';
            const status = 'available';
            if (client) {
                const params = { _id: client._id};
                const changes = { status: status};
                const result = await dbHandler.updateOne(collection, params, changes);
                res.send(result);
            } else {
                const data = { ip: clientIp, status: status};
                const result = await dbHandler.insert(collection, data);
                res.send(result);
            }
        }));

        this.put('/api/client/disabled', asyncHandler(async (req, res, next) => {
            const clientIp = req.connection.remoteAddress;
            const dbHandler = new DatabaseHandler();
            const client = await dbHandler.findClient({ip: clientIp});
            const collection = 'Clients';
            const status = 'disabled';
            if (client) {
                const params = { _id: client._id};
                const changes = { status: status};
                await dbHandler.updateOne(collection, params, changes);
            } else {
                const data = { ip: clientIp, status: status};
                await dbHandler.insert(collection, data);
            }

            NotificationHandler.notify('Baby Station closed', '', 'assets/apple-icon-180x180.png')
                .then(() => res.status(200).json({message: 'Notification sent successfully.'}))
                .catch(err => {
                    console.error("Error sending notification, reason: ", err);
                    res.sendStatus(500);
                });
        }));

        this.post('/api/detected-event', asyncHandler(async (req, res, next) => {
            const clientIp = req.connection.remoteAddress;
            const volume = req.body.volume;
            const timestamp = req.body.timestamp;
            const dbHandler = new DatabaseHandler();
            const client = await dbHandler.findClient({ip: clientIp});

            if (!volume || !timestamp) {
                res.status(422);
                res.send('item parameter is missing');
            } else if (!client) {
                res.status(400);
                res.send('client does not exist');
            } else {
                const data = { volume: volume, timestamp: timestamp, client: client._id};
                const collection = 'DetectedEvents';
                await dbHandler.insert(collection, data);

                NotificationHandler.notify('Baby is awake', '', 'assets/apple-icon-180x180.png')
                    .then(() => res.status(200).json({message: 'Notification sent successfully.'}))
                    .catch(err => {
                        console.error("Error sending notification, reason: ", err);
                        res.sendStatus(500);
                    });
            }
        }));

        this.get('/api/detected-event/all', asyncHandler(async (req, res, next) => {
            const dbHandler = new DatabaseHandler();
            const client = await dbHandler.findClient({ id: req.query.clientId });
            if (client) {
                const collection = 'DetectedEvents';
                const result = await dbHandler.find(collection, { client: client._id });
                res.send(result);
            } else {
                res.status(400);
                res.send('Client ID does not exist');
            }
        }));

        this.delete('/api/detected-event/all', asyncHandler(async (req, res, next) => {
            const clientIp = req.connection.remoteAddress;
            const dbHandler = new DatabaseHandler();
            const client = await dbHandler.findClient({ip: clientIp});
            if (client) {
                const collection = 'DetectedEvents';
                const result = await dbHandler.deleteMany(collection, { client: client._id });
                res.send(result);
            } else {
                res.status(400);
                res.send('client does not exist');
            }
        }));

        this.post('/api/notifications/subscribe', asyncHandler(async (req, res, next) => {
            const data = req.body.subscriber;
            const dbHandler = new DatabaseHandler();
            const collection = 'NotificationSubscriptions';
            const result = await dbHandler.insert(collection, data);
            res.send(result);
        }));

        this.post('/api/notifications/submit', asyncHandler(async (req, res, next) => {
            NotificationHandler.notify('Baby is awake', 'some body', 'assets/apple-icon-180x180.png')
                .then(() => res.status(200).json({message: 'Notification sent successfully.'}))
                .catch(err => {
                    console.error("Error sending notification, reason: ", err);
                    res.sendStatus(500);
                });

        }));

        // const webSocketServer = new WebSocket.Server({ port: 8080 });
        //
        // webSocketServer.on('connection', ws => {
        //     ws.binaryType = 'arraybuffer';
        //     let fileWriter = null;
        //     ws.on('message', message => {
        //         const array = new Uint16Array(message);
        //
        //         fileWriter = new wav.FileWriter('demo.wav', {
        //             channels: 1,
        //             sampleRate: 48000,
        //             bitDepth: 16,
        //         });
        //
        //         bufferToStream(array).pipe(fileWriter);
        //     });
        // })
    }
}

function bufferToStream(buffer) {
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

module.exports = SubRouter;
