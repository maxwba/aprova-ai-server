const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Company = require('../models/company');

passport.serializeUser((loggedInCompany, cb) => {
  cb(null, loggedInCompany._id);
});

passport.deserializeUser((companyIdFromSession, cb) => {
  Company.findById(companyIdFromSession, (err, companyDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, companyDocument);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (username, password, next) => {
      Company.findOne({ email: username }, (err, foundCompany) => {
        if (err) {
          next(err);
          return;
        }
        if (!foundCompany) {
          next(null, false, { message: 'Incorrect email.' });
          return;
        }
        if (!bcrypt.compareSync(password, foundCompany.password)) {
          next(null, false, { message: 'Incorrect password.' });
          return;
        }
        next(null, foundCompany);
      });
    },
  ),
);
