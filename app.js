var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var mongoose=require('mongoose');
var passport=require('passport');

var stylus=require('stylus');
var nib=require('nib');
//use connect-flash to put messages in the page
var flash=require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/auth');
var notes=require('./routes/notes');
var search=require('./routes/search');
var notebook=require('./routes/notebook');
var initPassport=require('./auth/init.js');
var app = express();

//connect to mongodb database using mongoose
mongoose.connect('mongodb://localhost/takenote');
    //take a look here to figure out how to handle mongoose connection:
    //http://theholmesoffice.com/mongoose-connection-best-practice/
    mongoose.connection.on('error',function(err){
        if(err)
            console.error(err);
    });
    mongoose.connection.on('connected',function(){
        console.log('connection established');
    });

    mongoose.connection.on('disconnected',function(){
        console.log('Disconnected from mongo db');
    });

    mongoose.connection.on('SIGINT',function(){
        //sigint represents the termination of the app
        mongoose.connection.close(function(){
            console.log("Connection to mongo db has been closed because the app terminated");
            process.exit(0);
        });
    });

//setup nib and stylus
function compile(str,path)
{
    return stylus(str).set('filename',path).use(nib());
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//static resources have to be loaded before you authenticate or use a session
initPassport(passport);
//use the stylus middleware to compile .styl files
app.use(stylus.middleware({
    src:__dirname+'/public/',
    compile:compile,
    dest:__dirname+'/public/'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:'1234567890QWRTY',
    saveUninitialized:true,
    resave:true
}));
app.use(cookieParser());

//setting up passport middleware:
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);
app.use('/auth', users);
app.use('/notes',notes);
app.use('/search',search);
app.use('/notebook',notebook);
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
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;