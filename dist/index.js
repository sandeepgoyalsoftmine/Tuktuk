'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

require('./env');

require('./db');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var APP_PORT = (process.env.NODE_ENV === 'test' ? process.env.TEST_APP_PORT : process.env.APP_PORT) || '3000';
var APP_HOST = process.env.APP_HOST || '0.0.0.0';

app.set('port', APP_PORT);
app.set('host', APP_HOST);

app.locals.title = process.env.APP_NAME;
app.locals.version = process.env.APP_VERSION;

//app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

app.use((0, _morgan2.default)('dev'));
app.use((0, _cookieParser2.default)());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.use((0, _expressSession2.default)({
  secret: 'MYSUPERSECRET',
  resave: false,
  saveUninitialized: true,
  maxAge: new Date(Date.now() + 60 * 1000 * 2)
}));

// view engine setup
app.set('views', _path2.default.join(__dirname, '../views/'));
app.set('view engine', 'ejs');

app.use('/public/stylesheets', _express2.default.static(_path2.default.join(__dirname, '../public/stylesheets')));
app.use('/public/javascripts', _express2.default.static(_path2.default.join(__dirname, '../public/javascripts')));
app.use('/public/images', _express2.default.static(_path2.default.join(__dirname, '../public/images')));

// Passport
app.use(_passport2.default.initialize());

// Site Routes
app.use('/', _routes2.default);

app.listen(app.get('port'), app.get('host'), function () {
  console.log('info', 'Server started at https://' + app.get('host') + ':' + app.get('port'));
});

exports.default = app;