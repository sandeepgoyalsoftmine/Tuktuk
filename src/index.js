import path from 'path';
import morgan from 'morgan';
import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import './env';
import './db';
import passport from 'passport';
import routes from './routes';
import apiRoutes from './apiRoutes'
import session from 'express-session';
import fs from 'fs';
const app = express();

let APP_HOST = '0.0.0.0';
let APP_PORT = '3000';
let APP_HTTP_PORT = '8080';

if (process.env.NODE_ENV === 'production') {
    console.log("Application is running in production environment.");
    APP_HOST = process.env.APP_HOST_PROD;
    APP_PORT = process.env.APP_PORT_PROD;
    APP_HTTP_PORT = process.env.APP_HTTP_PORT_PROD;
}
else if (process.env.NODE_ENV === 'staging') {
   console.log("Application is running in staging environment.");
    APP_HOST = process.env.APP_HOST_STAG;
    APP_PORT = process.env.APP_PORT_STAG;
    APP_HTTP_PORT = process.env.APP_HTTP_PORT_STAG;
}
else {
    console.log("Application is running in development environment.");
    APP_HOST = process.env.APP_HOST_DEV;
    APP_PORT = process.env.APP_PORT_DEV;
    APP_HTTP_PORT = process.env.APP_HTTP_PORT_DEV;
}


app.set('port', APP_PORT);
app.set('host', APP_HOST);

app.locals.title = process.env.APP_NAME;
app.locals.version = process.env.APP_VERSION;

//app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
  secret  : 'MYSUPERSECRET',
  resave: false,
  saveUninitialized: true,
  maxAge:new Date(Date.now() + (60 * 1000 * 2))
}));

// view engine setup
app.set('views',path.join(__dirname,'../views/'));
app.set('view engine', 'ejs');

app.use('/public/stylesheets',express.static(path.join(__dirname,'../public/stylesheets')));
app.use('/public/javascripts',express.static(path.join(__dirname,'../public/javascripts')));
app.use('/public/images',express.static(path.join(__dirname,'../public/images')));

// Passport
app.use(passport.initialize());

// Site Routes
app.use('/njs/', apiRoutes);
app.use('/', routes);

app.listen(app.get('port'), app.get('host'), () => {
  console.log('info', `Server started at https://${app.get('host')}:${app.get('port')}`);
});

export default app;
