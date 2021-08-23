exports.getAdminPanel = (req, res) => {
  const db = req.db;
  db.query('SELECT * FROM menu', (err, results) => {
    res.render('pages/admin', { results: results });
  });
};
exports.getUsersPage = (req, res) => {
  const db = req.db;
  db.query('SELECT * FROM users', (err, results) => {
    res.render('pages/users', { results: results ,currentuserid : req.user.id});
  });
};
exports.getInfoPage = (req, res) => {
  const db = req.db;
  db.query('SELECT * FROM info', (err, results) => {
    res.render('pages/info', {  location: results[0].location, phoneNumber: results[0].phone , email : results[0].email });
  });
};
exports.getChefsPage = (req, res) => {
  const db = req.db;
  db.query('SELECT * FROM chef', (err, results) => {
    if(err) return console.log(err)
    if(results.length) {
      res.render('pages/chefs', { results: results});
    }else{
      res.render('pages/chefs', { results: []})

    }
  });
};
exports.postAdmin = (req, res) => {
  const { menuitemid, menuitemname, menuitemcategory, menuitemdescription, menuitemextras, menuitemprice } = req.body;
  const image = '/uploads/' + req.file.filename;
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
exports.postChef = (req, res) => {
  const { chefid,chefname,cheftask } = req.body;
  const chefimage = '/uploads/' + req.file.filename;
  const db = req.db;
  if (chefid === 'add') {
    db.query(`INSERT INTO chef (name , tasks, image) VALUES(?, ?, ?)`, [
      chefname,
      cheftask,
      chefimage,
    ]);
  } else {
    chefimage && db.query(`UPDATE chef SET image='${chefimage}' WHERE  id='${chefid}'`);
    chefname && db.query(`UPDATE chef SET name='${chefname}' WHERE  id='${chefid}'`);
    cheftask && db.query(`UPDATE chef SET tasks='${cheftask}' WHERE  id='${chefid}'`);
  }
  res.redirect('/admin/chefs')
};
exports.postInfo = (req, res) => {
  const { infoLocation,infoTel,infoEmail } = req.body;
  const db = req.db;
  infoLocation && db.query(`UPDATE info SET location='${infoLocation}'`);
    infoEmail && db.query(`UPDATE info SET email='${infoEmail}'`);
    infoTel && db.query(`UPDATE info SET phone='${infoTel}'`);
  res.redirect('/admin/info')
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
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const db = req.db;
  if (isNaN(req.params.id)) {
    res.render('pages/error');
  } else {
    db.query(`DELETE FROM users WHERE id = ?`, [id], function (err, results) {
      if (err) {
        res.render('pages/error');
      }
    });
    res.redirect('/admin');
  }
};
exports.deleteChef = (req, res) => {
  const { id } = req.params;
  const db = req.db;
  if (isNaN(req.params.id)) {
    res.render('pages/error');
  } else {
    db.query(`DELETE FROM chef WHERE id = ?`, [id], function (err, results) {
      if (err) {
        res.render('pages/error');
      }
    });
    res.redirect('/admin/chefs');
  }
};
exports.allowUser = (req, res) => {
  const { id } = req.params;
  const db = req.db;
  if (isNaN(+id)) {
    res.render('pages/error');
  } else {
    db.query(`UPDATE users SET isAllowed = '1' WHERE id = ?`, [id], function (err, results) {
      if (err) {
        res.render('pages/error');
      }else{
        res.redirect('/admin/users');
        
      }
    });
  }
};
exports.disallowUser = (req, res) => {
  const { id } = req.params;
  const db = req.db;
  if (isNaN(+id)) {
    res.render('pages/error');
  } else {
    db.query(`UPDATE users SET isAllowed = '0' WHERE id = ?`, [id], function (err, results) {
      if (err) {
        res.render('pages/error');
      }
      else{
        res.redirect('/admin/users');

      }
    });
  }
};
