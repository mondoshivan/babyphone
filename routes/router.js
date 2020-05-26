const { Router } = require('express');
const debug = require('debug')('babyphone:router');

class SubRouter extends Router {

    // Executed before each HTTP route handling
    static before(req, res, next) {
        debug(`${req.method} ${req.url}`);
        next(); // keep executing the router middleware
    }
}

module.exports = SubRouter;