const getInfo = function(results){
  return {location: results.location, phoneNumber: results.phone , email : results.email,facebookLink: results.facebook,instagramLink: results.instagram}
}
exports.getHomePage = function (req, res) {
  const db = req.db;
  const { page } = req.query;
  let info;
  db.query('SELECT * FROM info', (err, results) => {
    info = getInfo(results[0])
  });
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
      res.render('pages/index', { results: results.slice(start, end), page: page ? +page : 1, pagecount: Math.ceil(results.length / 18) ,info});
    }
  });
};
exports.getContactPage = function (req, res) {
  const db = req.db;
  let info;
 
  db.query('SELECT * FROM info', function (err, results) {
    info = getInfo(results[0])
    if (err) res.render('pages/error');
    else if(results.length) {
      res.render('pages/contact', { info });
    }
    else{
      res.redirect('/')
    }
  });
};
exports.getMenuPage = function (req, res) {
  const db = req.db;
  let info;
  db.query('SELECT * FROM info', (err, results) => {
    info = getInfo(results[0])
  });
  db.query('SELECT * FROM menu LIMIT 15', function (err, results) {
    if (err) res.render('pages/error');
    else {
      res.render('pages/menu', { results, page: 1, pagecount: 1, info });
    }
  });
};
exports.getServicesPage = function (req, res) {
  const db = req.db;
  db.query('SELECT * FROM info', (err, results) => {
    const info = getInfo(results[0])
    res.render('pages/services', {info});
  });
};
exports.getAboutPage = function (req, res) {
  db.query('SELECT * FROM info', (err, results) => {
    const info = getInfo(results[0])
    res.render('pages/about',{info});
  });
};
exports.getTeamPage = function (req, res) {

  const db = req.db;
  let info;
  db.query('SELECT * FROM info', (err, results) => {
    info = getInfo(results[0])
  });
  db.query('SELECT * FROM chef', function (err, results) {
    if (err) res.render('pages/error');
    else {
      res.render('pages/team', { results,info });
    }
  });
};
