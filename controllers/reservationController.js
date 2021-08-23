exports.sendReservation = function (req, res) {
  const db = req.db;
  const { name, time, date, persons } = req.query;
  // 2021-08-13 10:00:02
  const fulldate = new Date();
  const clock = time.replace('PM', '').replace('AM', '').trim();
  const queryDate = fulldate.getFullYear() + '-' + fulldate.getMonth() + '-' + fulldate.getDay() + ' ' + clock + ':00';
  db.query('INSERT INTO reservation (name,date,persons) VALUES(?,?,?)', [name, queryDate, persons], function (err, results) {
    if (err) {
      res.render('pages/error');
    } else {
      res.redirect('/');
    }
  });
};
