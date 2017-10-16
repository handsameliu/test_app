var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var ejs = require('ejs');

var index = require('./routes/index');
var users = require('./routes/users');
var menu = require('./routes/menu');

var app = express();

// view engine setup 设置模版引擎
app.set('views', path.join(__dirname, 'views')); //设置模版存放目录
app.set('view engine', 'html'); //设置模版引擎
app.engine('html', require('ejs').__express); //设置渲染函数

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('[:date[clf]] [:status] :method :url ~:response-time(ms) -:res[content-length]- @:remote-addr #:user-agent'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

//设置跨域访问  
app.all('/menu', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	// res.header("X-Powered-By",' 3.2.1')  
	// res.header("Content-Type", "application/json;charset=utf-8");  
	next();
});

app.use('/menu', menu);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		console.log(err);
		res.render('error', {
			message: err.message,
			error: err
		});
    });
}

// production error handler no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;