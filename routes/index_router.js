const Router = require('./router');
const asyncHandler = require('express-async-handler');
const WebSocket = require('ws');
const Duplex = require('stream').Duplex;
const wav = require('wav');
const DatabaseHandler = require('../lib/database_handler');
const dbHandler = new DatabaseHandler();
const collection = 'Index';
const debug = require('debug')('babyphone:index_router');
const path = require('path');

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

        this.delete('/item', asyncHandler(async (req, res, next) => {
            const id = req.body.id;
            if (!id) {
                res.status(422);
                res.send('parameter is missing');
            } else {
                const params = { id: id };
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
                const result = await dbHandler.updateOne(collection, params, changes);
                if (!result) {
                    res.status(404);
                    res.send('not found');
                } else {
                    res.send(result);
                }
            }
        }));

        this.post('/items', asyncHandler(async (req, res, next) => {
            const data = req.body.items;
            if (!data) {
                res.status(422);
                res.send('items missing');
            } else {
                const result = await dbHandler.insert(collection, data);
                res.send(result);
            }
        }));

        this.post('/item', asyncHandler(async (req, res, next) => {
            const item = req.body.item;
            if (!item) {
                res.status(422);
                res.send('item parameter is missing');
            } else {
                const data = { item: item};
                const result = await dbHandler.insert(collection, data);
                res.send(result);
            }
        }));

        this.get('/items', asyncHandler(async (req, res, next) => {
            const result = await dbHandler.find(collection, {});
            res.send(result);
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
