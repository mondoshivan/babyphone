const Router = require('./router');
const asyncHandler = require('express-async-handler');
const path = require('path');
const DatabaseHandler = require('../lib/database_handler');
const NotificationHandler = require('../lib/notification_handler');
const PV = require('../lib/parameter_validation');

class SubRouter extends Router {

    constructor() {
        super();

        this.get('/', (req, res) => {
            const file = path.join(process.env['PROJECT_ROOT']+"/angular/dist/angular/index.html");
            console.log(`file: ${file}`);
            res.sendFile(file);
        });

        this.get('/api/ping', (req, res) => {
            res.status(200);
            res.send('');
        });

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
                if (PV.name(req.body.name) && PV.gender(req.body.gender)) {
                    const params = { _id: client._id};
                    const changes = { name: req.body.name, gender: req.body.gender };
                    const result = await dbHandler.updateOne(collection, params, changes);
                    res.send(result);
                } else {
                    res.status(422);
                    res.send('invalid parameters');
                }
            } else {
                res.status(404);
                res.send('not found');
            }
        }));

        this.get('/api/client/baby', asyncHandler(async (req, res) => {
            const dbHandler = new DatabaseHandler();
            if (PV.clientId(req.query.clientId)) {
                const client = await dbHandler.findClient({ id: req.query.clientId });
                if (client) {
                    res.send(client);
                } else {
                    res.status(404);
                    res.send('Client ID does not exist');
                }
            } else {
                res.status(422);
                res.send('invalid parameters');
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

            if (PV.volume(volume) && PV.timestamp(timestamp)) {
                const dbHandler = new DatabaseHandler();
                const client = await dbHandler.findClient({ip: clientIp});

                if (!client) {
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
            } else {
                res.status(422);
                res.send('invalid parameter');
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
                res.status(404);
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
                res.status(404);
                res.send('client does not exist');
            }
        }));

        this.post('/api/notifications/subscribe', asyncHandler(async (req, res, next) => {
            const data = req.body.subscriber;
            if (PV.subscriber(data)) {
                const dbHandler = new DatabaseHandler();
                const collection = 'NotificationSubscriptions';
                const result = await dbHandler.insert(collection, data);
                res.send(result);
            } else {
                res.status(422);
                res.send('invalid parameter');
            }
        }));

        this.post('/api/notifications/submit', asyncHandler(async (req, res, next) => {
            NotificationHandler.notify('Baby is awake', 'some body', 'assets/apple-icon-180x180.png')
                .then(() => res.status(200).json({message: 'Notification sent successfully.'}))
                .catch(err => {
                    console.error("Error sending notification, reason: ", err);
                    res.sendStatus(500);
                });

        }));
    }
}

module.exports = SubRouter;
