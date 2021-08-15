exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('login');
  }
};
exports.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/admin');
  } else {
    next();
  }
};
exports.isAdmin = (req, res, next) => {
  if (req.user !== undefined && req.user.roles == 'admin') {
    next();
  } else {
    res.render('pages/noaccess');
  }
};
