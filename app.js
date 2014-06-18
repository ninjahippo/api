var express = require('express');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var v1 = require('./routes/v1');

var app = express();

mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/ninjahippo');

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

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

module.exports = app;
