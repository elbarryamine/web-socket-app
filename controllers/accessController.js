exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('login');
  }
};
exports.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/gestion');
  } else {
    next();
  }
};
exports.isAdmin = (req, res, next) => {
  console.log(req.user.roles);
  if (req.user !== undefined && req.user.roles == 'admin') {
    next();
  } else {
    res.render('pages/noaccess');
  }
};
