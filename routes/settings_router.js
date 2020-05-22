const Router = require('./router');
const asyncHandler = require('express-async-handler');
const DatabaseHandler = require('../lib/database_handler');
const dbHandler = new DatabaseHandler();
const collection = 'Settings';

class SubRouter extends Router {

    constructor() {
        super();

        this.get('/', (req, res) => {
            res.render('settings', {title: collection});
        });
    }

}

module.exports = SubRouter;
