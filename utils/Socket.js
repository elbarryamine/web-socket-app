const fs = require('fs');
const socketHandler = function (io) {
  io.on('connection', async (socket) => {
    let arrayOfNotifications = [];
    try {
      const data = await fs.promises.readFile('./history/history.json', 'utf-8');
      arrayOfNotifications = Array.from(JSON.parse(data));
    } catch (err) {
      arrayOfNotifications = [];
    }
    socket.on('connected', (message) => {
      io.emit('oldData', JSON.stringify(arrayOfNotifications));
    });
    socket.on('sendNewOrderToList', async (message) => {
      const editedMessage = JSON.parse(message);
      editedMessage.orderBy = 'Amine';
      arrayOfNotifications.push(editedMessage);
      try {
        await fs.promises.writeFile('./history/history.json', JSON.stringify(arrayOfNotifications));
      } catch (err) {
        console.log(err);
      }
      io.emit('listHasNewOrderWaiting', JSON.stringify(editedMessage));
    });
    socket.on('sendOrderToServer', (message) => {
      io.emit('notificationOrderSentToKitchen', message);
    });
    socket.on('sendToServerOrderUnfinished', (message) => {
      io.emit('notificationOrderUnFinished', message);
    });
  });
};

module.exports = socketHandler;
