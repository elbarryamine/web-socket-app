exports.getHomePage = function (req, res) {
  const db = req.db;
  const { page } = req.query;
  db.query('SELECT * FROM menu', function (err, results) {
    if (err) res.render('pages/error');
    else {
      let start;
      let end;

      if (page) {
        start = (page - 1) * 18;
        end = (page - 1) * 18 + 18;
      } else {
        start = 0;
        end = 18;
      }
      res.render('pages/index', { results: results.slice(start, end), page: page ? +page : 1, pagecount: Math.ceil(results.length / 18) });
    }
  });
};
exports.getContactPage = function (req, res) {
  res.render('pages/contact');
};
exports.getMenuPage = function (req, res) {
  const db = req.db;
  db.query('SELECT * FROM menu LIMIT 15', function (err, results) {
    if (err) res.render('pages/error');
    else {
      res.render('pages/menu', { results, page: 1, pagecount: 1 });
    }
  });
};
exports.getServicesPage = function (req, res) {
  res.render('pages/services');
};
exports.getAboutPage = function (req, res) {
  res.render('pages/about');
};
exports.getTeamPage = function (req, res) {
  const db = req.db;
  db.query('SELECT * FROM chef', function (err, results) {
    if (err) res.render('pages/error');
    else {
      res.render('pages/team', { results });
    }
  });
};
