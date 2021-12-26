const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load u model
const user = require('../model/userData');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      user.findOne({
        email: email
      }).then(u => {
        if (!u) {
          return done(null, false, { message: 'This email is not registered. Please create a new account' });
        }

        // Match password
        bcrypt.compare(password, u.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, u);
          } else {
            return done(null, false, { message: 'Password is incorrect for the registered email' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    user.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
