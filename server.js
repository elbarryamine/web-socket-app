const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
require('dotenv').config();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const socketHandler = require('./utils/Socket');
const db = require('./utils/dbconfig');
const upload = require('./utils/uploadconfig.js');
const reservation = require('./controllers/reservationController');
const homeRouter = require('./routes/homeRouter');
const adminRouter = require('./routes/adminRouter');
const authRouter = require('./routes/authRouter');
const flash = require('express-flash');
const init = require('./utils/passport');
const passport = require('passport');
const cookieSession = require('cookie-session');

const db_middleware = (req, res, next) => {
  req.db = db;
  next();
};
// app.use(helmet());
app.use(flash());

app.use(
  cookieSession({
    name: 'AuthSession',
    secret: process.env.SECRET,
    maxAge: 24 * 60 * 60 * 1000,
    saveUninitialized: false,
    resave: false,
  })
);

init(passport);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/sass', express.static('public/sass'));
app.use('/images', express.static('public/images'));
app.use('/fonts', express.static('public/fonts'));
app.use('/uploads', express.static('public/uploads'));
//
app.use(db_middleware, homeRouter);
app.use(db_middleware, authRouter);

app.use((req, res, next) => {
  io.use((socket, socketNext) => {
    socket.reqdata = req;
    socketNext();
  });
  next();
});
app.use(db_middleware, adminRouter);
app.get('/reservation/send', upload.none(), db_middleware, reservation.sendReservation);

app.use('*', function (req, res) {
  res.render('pages/404.ejs');
});
socketHandler(io);
// SOCKETS

server.listen(port, function (req, res) {
  console.log('Catch the action at http://localhost:' + port);
});
