'use strict';

const config = require('../configs/config');
const photacles = require('./photacles');

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- -- Constants
// set server port
const PORT = config.server.port || process.env.PORT || 3000;

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- -- Diverse plugins

const log = require('fancy-log');
const uuid = require('uuid');
const path = require('path');

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- -- ExpressJS plugins

const express = require('express');

const expMorgan = require('morgan');
const expFavicon = require('serve-favicon');
const expHelmet = require('helmet');
const bodyParser = require('body-parser');
// todo: add https://www.npmjs.com/package/express-urlrewrite

expMorgan.token('id', function getId(req) {
    return req.id;
});

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- -- App settings

const app = new express();
app.use(assignId);

app.use(expMorgan('dev'));
app.use(expFavicon(path.join(__dirname, '../public', 'favicon.ico')));
// parse application/json
app.use(bodyParser.json());

// todo: add https://helmetjs.github.io/docs/hpkp/
// todo: add https://www.npmjs.com/package/helmet-csp
app.use(expHelmet({
    frameguard: true,
    referrerPolicy: true
}));
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- -- App routing

// get an instance of the express Router
const router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/images', function (req, res) {
    let list;

    try {
        list = photacles.getImages();
        res.json(list);
    } catch (e) {
        log(e.message);
        res.status(400).json();
    }
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- -- Start server

if (!module.parent) {
    app.listen(PORT, () => log('app started 3000'));
}

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- -- private functions

function assignId(req, res, next) {
    req.id = uuid.v4();
    next();
}
