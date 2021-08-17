const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const socketHandler = (io) => {
  io.on('connection', (socket) => {
    const req = socket.reqdata;
    socket.on('launch', () => {
      fs.readFile('./history/orderslist.txt', 'utf-8', (err, dataFile) => {
        fs.readFile('./history/markedNotifications.txt', 'utf-8', (err2, dataFile2) => {
          if (err2) return console.log(err2);
          let orders;
          let nots;
          if (!dataFile) {
            orders = [];
          } else {
            orders = Array.from(JSON.parse(dataFile));
            if (orders.length > 2) orders.pop();
          }
          if (!dataFile2) {
            nots = [];
          } else {
            nots = Array.from(JSON.parse(dataFile2));
          }
          socket.emit('addingHistoryItems', { orders, nots });
        });
      });
    });

    socket.on('addNewOrderToList', (data) => {
      data.role = req.user.roles;
      data.orderBy = req.user.username;
      data.time = new Date();
      data.id = uuidv4();
      io.emit('newOrderToList', data);

      fs.readFile('./history/orderslist.txt', 'utf-8', (err, dataFile) => {
        let orders;
        if (!dataFile) {
          orders = [];
        } else {
          orders = Array.from(JSON.parse(dataFile));
        }
        orders.push(data);
        if (orders.length > 2) orders.pop();
        fs.writeFile('./history/orderslist.txt', JSON.stringify([...orders]), (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    });
    socket.on('removeOrder', (id) => {
      fs.readFile('./history/orderslist.txt', 'utf-8', (err, dataFile) => {
        if (err) return;
        let orders;
        orders = Array.from(JSON.parse(dataFile)).filter((el) => el.id != id);
        fs.writeFile('./history/orderslist.txt', JSON.stringify([...orders]), (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
      io.emit('removeHasBeenRemoved', id);
    });
    socket.on('notificationClicked', (id) => {
      fs.readFile('./history/markedNotifications.txt', 'utf-8', (err, dataFile) => {
        if (err) return console.log(err);
        let nots;
        if (!dataFile) {
          nots = [];
        } else {
          nots = Array.from(JSON.parse(dataFile));
          nots.push(id);
        }
        fs.writeFile('./history/markedNotifications.txt', JSON.stringify(nots), (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
      io.emit('notificationMarkedAsComplete', id);
    });
  });
};

module.exports = socketHandler;
