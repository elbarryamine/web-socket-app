exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('login');
  }
};
exports.isAllowed = (req, res, next) => {
  if (req.user.isAllowed!=0) {
    next();
  } else {
    res.render('pages/noaccess');
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
  if (req.user !== undefined && req.user.roles == 'admin') {
    next();
  } else {
    res.render('pages/noaccess');
  }
};
