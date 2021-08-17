const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + new Date().toISOString);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
