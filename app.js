var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var v1 = require('./routes/v1');

var app = express();

mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/ninjahippo');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(function(req, res, next) {
    var t = false;
    if (req.headers.origin) {
        if (req.headers.origin == 'http://cms.ninjahippo.io') {
            res.header('Access-Control-Allow-Origin', 'http://cms.ninjahippo.io');
            res.header('Access-Control-Allow-Methods', 'OPTIONS, PUT, POST, DELETE, GET');
        } else {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'OPTIONS, GET');
        }
    }

    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-CSRF-TOKEN, Content-Type')

    if (t) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    if (t && req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
})

app.use('/', routes);
app.use('/v1', v1);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.json(err.status || 500, {
            message: err.message,
            error: err
        })
    });
}

// production error handler
app.use(function(err, req, res, next) {
    res.json(err.status || 500, {
        message: err.message,
        error: err
    })
});

module.exports = app;
