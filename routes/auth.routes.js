const express = require('express');

const authRoutes = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Company = require('../models/company');

// _____________________________________________SIGNUP________________________________//

authRoutes.post('/signup', (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Provide email and password' });
    return;
  }
  if (password.length < 4) {
    res.status(400).json({
      message:
        'Please make your password at least 4 characters long for security purposes.',
    });
    return;
  }
  Company.findOne({ email }, (err, foundCompany) => {
    if (err) {
      res.status(500).json({ message: 'Email check went bad.' });
      return;
    }
    if (foundCompany) {
      res.status(400).json({ message: 'Email taken. Choose another one.' });
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const aNewCompany = new Company({
      email,
      password: hashPass,
    });

    // Metodo save eu preciso instanciar o modo
    aNewCompany.save((error) => {
      if (error) {
        res
          .status(400)
          .json({ message: 'Saving Company to database went wrong.' });
        return;
      }
      // Automatically log in Company after sign up
      // .login() here is actually predefined passport method
      req.login(aNewCompany, (_error) => {
        if (_error) {
          res.status(500).json({ message: 'Login after signup went bad.' });
          return;
        }
        // Send the Company's information to the frontend
        // We can use also: res.status(200).json(req.Company);
        res.status(200).json(aNewCompany);
      });
    });
  });
});

// _____________________________________________LOGIN________________________________//

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theCompany, failureDetails) => {
    if (err) {
      res
        .status(500)
        .json({ message: 'Something went wrong authenticating Company' });
      return;
    }
    if (!theCompany) {
      // 'failureDetails' contains the error messages
      // from our logic in 'LocalStrategy' { message: '...' }.
      res.status(401).json(failureDetails);
      return;
    }
    // save Company in session
    req.login(theCompany, (__err) => {
      if (__err) {
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }
      // We are now logged in (that's why we can also send req.Company)
      res.status(200).json(theCompany);
    });
  })(req, res, next);
});

// AUTHORIZATION
authRoutes.get('/loggedin', (req, res) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({
    message: 'Unauthorized',
  });
});

// GOOGLE AUTHENTICATION
authRoutes.get('/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  }));

authRoutes.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.SHARE + '/dashboard',
    failureRedirect: process.env.SHARE + '/signup',
  }));


// _____________________________________________LOGOUT________________________________//

authRoutes.get('/logout', (req, res) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({
    message: 'Log out success!',
  });
});

module.exports = authRoutes;
