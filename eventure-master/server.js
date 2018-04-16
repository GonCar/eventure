//El server es para configuraciones y cargas
//load environment variables==================================
require('dotenv').config();

//grab our dependencies=================================
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const expressValidator = require('express-validator');
const multer = require('multer');

//login=================================================
const path = require('path');
const logger = require('morgan');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

require('./configs/passport.config').setup(passport);
require('./configs/mailer.config');

//confgure our app======================================
//set sessions and cookie parser========================
app.use(cookieParser());
app.use(
  session({
    secret: 'process.env.SECRET',
    cookie: { maxAge: 60000 },
    resave: false, //force the session to be saved to the store
    saveUninitialized: false // dont save unmodifed
  })
);
app.use(flash());

//tell express whre to look for static assets===========
app.use(express.static(__dirname + '/public'));

//set ejs as our templating engine======================
app.set('view engine', 'ejs');
app.use(expressLayouts);

//connect to our database===============================
mongoose.promise = Promise;
mongoose.connect(process.env.DB_URI);

//use body parser to grab info from a form==============
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

//set login user========================================
app.use(
  session({
    secret: 'SuperSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.title = 'Eventure';
  res.locals.session = req.user || {};
  res.locals.flash = req.flash() || {};
  next();
});

//set routes============================================
app.use(require('./app/routes'));

//start our server======================================
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
