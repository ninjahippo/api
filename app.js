var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors')
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var v1 = require('./routes/v1');

var app = express();

mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/ninjahippo');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());

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
