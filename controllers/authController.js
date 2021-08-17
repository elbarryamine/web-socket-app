const bcrypt = require('bcrypt');
exports.logoutUser = (req, res) => {
  req.logout();
  res.redirect('/login');
};
exports.getLoginPage = (req, res) => {
  res.render('pages/login');
};
exports.getSignUpPage = (req, res) => {
  res.render('pages/signup', { message: 'ok' });
};
exports.signUser = async (req, res) => {
  const db = req.db;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const email = req.body.email.toLowerCase();
  const username = req.body.username.toLowerCase();
  const role = req.body.role.toLowerCase();
  if (!password || !passwordConfirm || !email || !username) return res.render('page/signup', { message: 'Veuillez fournir tous les champs obligatoires' });
  if (password !== passwordConfirm) return res.render('pages/signup', { message: 'Veuillez confirmer que les mots de passe correspondent' });
  try {
    db.query(`SELECT * FROM users WHERE email = ?`, [email], function (err) {
      if (!err) {
      } else return res.render('pages/signup', { message: 'Cet email existe déjà' });
    });
    db.query(`SELECT * FROM users WHERE username = ?`, [username], function (err) {
      if (!err) {
      } else return res.render('pages/signup', { message: "Ce nom d'utilisateur est pris" });
    });
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    db.query(`INSERT INTO users (username, email, password, roles) VALUES(?, ?, ?, ?)`, [username, email, hashPassword, role], function (err, results) {
      if (err) return res.render('pages/signup', { message: 'Quelque chose a mal tourné' });
      else return res.render('pages/login');
    });
  } catch (err) {
    return res.render('pages/signup', { message: 'Quelque chose a mal tourné2' });
  }
};
