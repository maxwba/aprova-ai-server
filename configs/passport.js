const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Company = require('../models/company');


passport.serializeUser((loggedInCompany, cb) => {
  // eslint-disable-next-line no-underscore-dangle
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

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID || null,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: '/api/auth/google/callback',
// },
// (accessToken, refreshToken, profile, done) => {
//   Company.findOne({
//     googleID: profile.id
//   })
//     .then((company) => {
//       if (company) {
//         done(null, company);
//         return;
//       }

//       Company.create({
//         googleID: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//       })
//         .then((newUser) => {
//           done(null, newUser);
//         })
//         .catch((err) => done(err)); // closes User.create()
//     })
//     .catch((err) => done(err)); // closes User.findOne()
// }));
