//El archivo de rutas solo debe manejar las rutas
//create a new express roiuter

const express = require('express');
const router = express.Router();
const mainController = require('./controllers/main.controller');
const eventsController = require('./controllers/events.controller');
const authController = require('./controllers/auth.controller');
const passport = require('passport');
const userController = require('./controllers/user.controller');
const secure = require('../configs/passport.config');

//Login routes
router.get('/signup', authController.signup);
router.post('/signup', authController.doSignup);

router.get('/login', authController.login);
router.post('/login', authController.doLogin);

router.post(
  '/auth/google',
  passport.authenticate('google-auth', {
    scope: ['openid', 'profile', 'email']
  })
);
router.get('/auth/:provider/cb', authController.loginWithProviderCallback);

router.get('/logout', authController.logout);

//user routes
router.get('/users', secure.checkRole('ADMIN'), userController.list);

//login routes
router.get('/', mainController.showLogin);

//event routes
router.get('/events', eventsController.showEvents);

//create events
router.get('/events/create', eventsController.showCreate);
router.post('/events/create', eventsController.processCreate);

//show single page event
router.get('/events/:slug', eventsController.showSingle);

//edit events
router.get('/events/:slug/edit', eventsController.showEdit);
router.post('/events/:slug', eventsController.processEdit);

//show photos
router.get('/events/:slug/photos', eventsController.showPhotos);

//delete events
router.get('/events/:slug/delete', eventsController.deleteEvent);

router.post('/create');
//export router
module.exports = router;
