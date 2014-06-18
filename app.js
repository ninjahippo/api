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

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.renprocess.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || der('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
