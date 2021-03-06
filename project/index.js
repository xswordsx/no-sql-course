var util = require('util');
var path = require('path');

var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');

var config = require('./config');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session')({ secret: config.secret, resave: false, saveUninitialized: false });
var connect_ensure_login = require('connect-ensure-login');

var Model = mongoose.Model,
	Schema = mongoose.Schema;

var app = express();

var mongoString = util.format("mongodb://%s:%d/%s",
	config.mongo.server, config.mongo.port, config.mongo.db);

mongoose.connect(mongoString, function (err) {
	if (err) {
		console.error(util.format('[%s]:\t%s', err.name, err.message));
		cleanup(-1);
	} else {
		setupApp(app);
		app.listen(config.port || 3000, function() {
			console.log('Server started on http://localhost:' + (config.port || 3000));
		});
	}
});

function setupApp (app) {
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(expressSession);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(cookieParser());

	try {
		var loginRouter = require('./routes/login');
		var registerRouter = require('./routes/register');
		var tweetRouter = require('./routes/tweet');
		var followRouter = require('./routes/follow');
		var timelineRouter = require('./routes/timeline');
	} catch(e) {
		console.error(e.message, e.stack);
		cleanup(-2);
	}

	var ensureLoggedIn = connect_ensure_login.ensureLoggedIn('/login');

	app.use('/login', loginRouter);
	app.use('/register', registerRouter);
	app.use('/tweet', ensureLoggedIn, tweetRouter);
	app.use('/actions', ensureLoggedIn, followRouter);
	app.use('/timeline', ensureLoggedIn, timelineRouter);

	app.get('/', ensureLoggedIn, function (req, res) {
		res.render('index', {
			title: 'Hirundo',
			user: req.user,
			message: ''
		});
	});
	app.get('/logout', ensureLoggedIn, function(req, res) {
		req.logout();
		res.redirect('/login', {message: 'test'});
	});

	// catch errors
	//app.use(function(err, req, res, next) {
	//	if(err) {
	//		err.message = JSON.stringify(err);
	//		err.title = err.title || 'Hirundo - Error';
	//		res.render('error', err);
	//	} else {
	//		res.render('403', {title: 'Forbidden'});
	//	}
	//});
}

function cleanup (x) {
	mongoose.disconnect(process.exit.bind(process, x | 0));
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
