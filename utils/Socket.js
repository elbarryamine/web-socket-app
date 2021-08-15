const fs = require('fs');
const socketHandler = (io) => {
  io.on('connection', async (socket) => {
    socket.on('launch', async (message) => {
      try {
        const data = await fs.promises.readFile('./history/orderslist.txt', 'utf-8');
        const orders = JSON.parse(data);
        io.emit('sendingPreviousData', JSON.stringify(orders));
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('sendNewOrderToList', async (message) => {
      const editedMessage = JSON.parse(message);
      try {
        const data = await fs.promises.readFile('./history/orderslist.txt', 'utf-8');
        if (!data) {
          await fs.promises.writeFile('./history/orderslist.txt', JSON.stringify([editedMessage]));
        } else {
          const dataArr = JSON.parse(data);
          dataArr.push(editedMessage);
          if (dataArr.length > 100) {
            const dataLimit = dataArr.splice(-100);
            await fs.promises.writeFile('./history/orderslist.txt', JSON.stringify([...dataLimit]));
          } else {
            await fs.promises.writeFile('./history/orderslist.txt', JSON.stringify([...dataArr]));
          }
        }
        // await fs.promises.writeFile('./history/orderslist.txt', );
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
