exports.getAdminPanel = (req, res) => {
  const db = req.db;
  db.query('SELECT * FROM menu', (err, results) => {
    console.log(results);
    res.render('pages/admin', { results: results });
  });
};
exports.postAdmin = (req, res) => {
  const { menuitemid, menuitemname, menuitemcategory, menuitemdescription, menuitemextras, menuitemprice } = req.body;
  const image = 'uploads/' + req.file.filename;
  const db = req.db;
  if (menuitemid === 'add') {
    db.query(`INSERT INTO menu (name ,category , description, extra, image , prix) VALUES(?, ?, ?, ?, ?, ?)`, [
      menuitemname,
      menuitemcategory,
      menuitemdescription,
      menuitemextras,
      image,
      menuitemprice,
    ]);
  } else {
    image && db.query(`UPDATE menu SET image='${image}' WHERE  id='${menuitemid}'`);
    menuitemname && db.query(`UPDATE menu SET name='${menuitemname}' WHERE  id='${menuitemid}'`);
    menuitemcategory && db.query(`UPDATE menu SET category='${menuitemcategory}' WHERE  id='${menuitemid}'`);
    menuitemdescription && db.query(`UPDATE menu SET description='${menuitemdescription}' WHERE  id='${menuitemid}'`);
    menuitemextras && db.query(`UPDATE menu SET extra='${menuitemextras}' WHERE  id='${menuitemid}'`);
    menuitemprice && db.query(`UPDATE menu SET prix='${menuitemprice}' WHERE  id='${menuitemid}'`);
  }
  db.query('SELECT * FROM menu', (err, results) => {
    if (err) {
      res.render('pages/admin', { results: 'error', page: 'Restaurant' });
    } else {
      res.render('pages/admin', { results, page: 'Restaurant', search: req.search });
    }
  });
};

exports.getGestionPanel = (req, res) => {
  res.render('pages/gestion', { username: req.user.username, role: req.user.roles });
};
exports.deleteItem = (req, res) => {
  const { id } = req.params;
  const db = req.db;
  if (isNaN(req.params.id)) {
    res.render('pages/error');
  } else {
    db.query(`DELETE FROM menu WHERE id = ?`, [id], function (err, results) {
      if (err) {
        res.render('pages/error');
      }
    });
    res.redirect('/admin');
  }
};
