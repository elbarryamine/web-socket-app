exports.getAdminPanel = (req, res) => {
  res.render('pages/admin', { username: req.user.username, role: req.user.roles });
};
