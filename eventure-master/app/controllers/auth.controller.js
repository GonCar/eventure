const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport');

module.exports.signup = (req, res, next) => {
  res.render('pages/signup');
};

module.exports.doSignup = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user != null) {
        res.render('pages/signup', {
          user: user,
          error: { username: 'Username already exists' }
        });
      } else {
        user = new User(req.body);
        user
          .save()
          .then(() => {
            req.flash('info', 'Successfully sign up, now you can login!');
            res.redirect('/login');
          })
          .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.render('pages/signup', {
                user: user,
                error: error.errors
              });
            } else {
              next(error);
            }
          });
      }
    })
    .catch(error => next(error));
};

module.exports.login = (req, res, next) => {
  res.render('pages/login', {
    flash: req.flash()
  });
};

module.exports.doLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.render('pages/login', {
      user: { email: email },
      error: {
        email: email ? '' : 'Email is required',
        password: password ? '' : 'Password is required'
      }
    });
  } else {
    passport.authenticate('local-auth', (error, user, validation) => {
      if (error) {
        next(error);
      } else if (!user) {
        res.render('pages/login', { error: validation });
      } else {
        req.login(user, error => {
          if (error) {
            next(error);
          } else {
            res.redirect('/events');
          }
        });
      }
    })(req, res, next);
  }
};

module.exports.loginWithProviderCallback = (req, res, next) => {
  passport.authenticate(`${req.params.provider}-auth`, (error, user) => {
    if (error) {
      next(error);
    } else {
      req.login(user, error => {
        if (error) {
          next(error);
        } else {
          res.redirect('/events');
        }
      });
    }
  })(req, res, next);
};

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');

  req.session.destroy(error => {
    if (error) {
      next(error);
    } else {
      req.logout();
      res.redirect('/login');
    }
  });
};
