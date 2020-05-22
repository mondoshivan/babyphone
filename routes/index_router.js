const Router = require('./router');
const asyncHandler = require('express-async-handler');
const DatabaseHandler = require('../lib/database_handler');
const dbHandler = new DatabaseHandler();
const collection = 'Index';

class SubRouter extends Router {

    constructor() {
        super();

        this.get('/', (req, res) => {
            res.render('index', { title: 'Express' });
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
    }
}

module.exports = SubRouter;
