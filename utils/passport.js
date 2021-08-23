const bcrypt = require('bcrypt');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
const db = require('../utils/dbconfig');
const init = function () {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      function (email, password, done) {
        db.query('SELECT * FROM users WHERE email = ?', [email], async function (err, user) {
          try {
            if (!user) {
              return done(null, false, { message: 'Email ou mot de passe incorrect.' });
            }
            if (!(await bcrypt.compare(password, user[0].password))) {
              return done(null, false, { message: 'Email ou mot de passe incorrect.' });
            }
            return done(null, user[0]);
          } catch (err) {
            return done(null, false, { message: 'Aucun utilisateur trouvé avec cet email' });
          }
        });
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    db.query('SELECT * FROM users WHERE id = ?', [id], function (err, user) {
      if (err) {
        done(null, false);
      } else {
        done(err, user[0]);
      }
    });
  });
};

module.exports = init;
