const socket = io('ws://localhost:3000');
// Handle Coming Back Messages
const notification = document.querySelector('#notification');
const tableHead = document.querySelector('#tableHead');
const tableList = document.querySelector('tbody');
const user = document.querySelector('#user').innerHTML;

socket.emit('launch');

const markupListItem = (order, orderBy, table, day, hour, minute) => {
  let output;
  if (orderBy == user) {
    output = `<td onclick="handleSendOrderToKitchen()" class="flex align-middle items-center justify-center text-center py-3 pl-3 pr-1 w-30">
    <button class="py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" type="checkbox">Envoyer</button>
    </td>`;
  } else {
    output = `<td class="flex align-middle items-center justify-center text-center py-3 pl-3 pr-1 w-30">
    <button class="opacity-0 py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" type="checkbox">Envoyer</button>
    </td>`;
  }
  return `<tr role="row" class="hover:bg-blue-100 border-b flex cursor-pointer items-center">
  ${output}
  <td class="py-3 px-5 flex-1 min-w-max truncate text-center">${order}</td>
  <td class="py-3 px-5 flex-1 min-w-max truncate text-center">${orderBy}</td>
  <td class="py-3 px-5 flex-1 min-w-max truncate text-center">${table}</td>
  <td class="py-3 px-5 flex-1 min-w-max truncate text-center">${day + ' ' + hour + ':' + minute}</td>
  </tr>`;
};
const markupSentToKitchen = (order, orderBy, table, time) => `
<tr role="row" class="hover:bg-blue-100 border-b flex cursor-pointer items-center">
                  <td onclick="handleUnfinished()" class="flex align-middle items-center justify-center text-center py-3 pl-3 pr-1 w-40">
                  <button class="py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" type="checkbox">Restaurer</button>
                  </td>
                  <td class="py-3 px-1 flex-1 truncate order text-center">${order}</td>
                  <td class="py-3 px-1 flex-1 truncate orderdby text-center">${orderBy}</td>
                  <td class="py-3 px-1 flex-1 truncate table text-center">${table}</td>
                  <td class="py-3 px-1 flex-1 truncate time text-center">${time}</td>
                </tr>`;
const markupUnFinished = (order, orderBy, table, time) => `
<tr role="row" class="hover:bg-blue-100 border-b flex cursor-pointer items-center">
                  <td onclick="handleSendOrderToKitchen()" class="flex align-middle items-center justify-center text-center py-3 pl-3 pr-1 w-30">
                  <button class="py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" type="checkbox">Envoyer</button>
                  </td>
                  <td class="py-3 px-1 flex-1 truncate order text-center">${order}</td>
                  <td class="py-3 px-1 flex-1 truncate orderdby text-center">${orderBy}</td>
                  <td class="py-3 px-1 flex-1 truncate table text-center">${table}</td>
                  <td class="py-3 px-1 flex-1 truncate time text-center">${time}</td>
                </tr>`;
const markupCancel = `<tr class="border-b flex">
<th class="font-semibold py-3 pl-3 pr-1 w-30 text-center">
  <button class="py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" onclick="handleAddOrderToList()">Ajouter</button>
</th>
<th class="font-semibold py-3 px-5 flex-1 min-w-max truncate text-center">Demande</th>
<th class="font-semibold py-3 px-5 flex-1 min-w-max truncate text-center">Demandeur</th>
<th class="font-semibold py-3 px-5 flex-1 min-w-max truncate text-center">Table</th>
<th class="font-semibold py-3 px-5 flex-1 min-w-max truncate text-center">Temps posté</th>
</tr>`;
const markupnotification = (order, time) => `<li id='${(order.order + order.orderBy + order.table).replace(/\s/g, '')}'><article
class="cursor-pointer border rounded-md p-3 bg-white flex text-gray-700 mb-2 hover:border-green-500 focus:outline-none focus:border-green-500">
<span class="flex-none pt-1 pr-2">
  <img class="h-8 w-8 rounded-md" src="https://raw.githubusercontent.com/bluebrown/tailwind-zendesk-clone/master/public/assets/avatar.png" />
</span>
<div class="flex-1">
  <header class="mb-1"><span class="font-semibold">Nouvelle commande</span></header>
  <p class="text-gray-600 text-uppercase">Commande : ${order.order} <br/>table : ${order.table}<br/><br/>${order.orderBy}</p>
  <footer class="text-gray-500 mt-2 text-sm">${time}</footer>
</div>
</article>
</li>`;
const markupAddOrder = `<tr class="border-b flex">
   <th class="font-semibold text-left py-3 pl-3 pr-1 w-30 flex flex-col justify-between	">
     <button class="py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" onclick="handleCancelAdding()">Annuler</button>
     <button class="py-3 px-6 text-white rounded-lg bg-purple-600 mt-2 shadow-lg block md:inline-block" onclick="handleSendOrderToList()">Envoyer</button>
   </th>
   <th class="font-semibold text-left py-3 px-1 flex-1 truncate">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="order">
            Ordre
         </label>
         <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="order" type="text" placeholder="Order">
   </th>
   <th class="font-semibold text-left py-3 px-1 flex-1 truncate">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="table">
            Table
         </label>
         <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="table" type="text" placeholder="Table">
   </th>

 </tr>`;

// Listeners

socket.on('notificationOrderSentToKitchen', (text) => {
  const order = JSON.parse(text);
  const sentOrder = {
    order: order.order,
    orderBy: order.orderBy,
    table: order.table,
  };
  notification.insertAdjacentHTML('beforebegin', markupnotification(sentOrder, order.time));
});
socket.on('listHasNewOrderWaiting', (text) => {
  const order = JSON.parse(text);
  tableList.insertAdjacentHTML('afterbegin', markupListItem(order.order, order.orderBy, order.table, order.day, order.hour, order.minute));
});

socket.on('notificationOrderUnFinished', (message) => {
  const order = JSON.parse(message);
  const child = document.querySelector(`#${(order.order + order.orderBy + order.table).replace(/\s/g, '')}`);
  child.remove();
  // notification.insertAdjacentHTML('beforebegin', markupnotification(JSON.parse(text), day, hour, minute));
});
socket.on('sendingPreviousData', (orders) => {
  const listItems = JSON.parse(orders);
  listItems.forEach((order) => {
    tableList.insertAdjacentHTML('afterbegin', markupListItem(order.order, order.orderBy, order.table, order.day, order.hour, order.minute));
  });
});

// Emitters

const handleSendOrderToList = () => {
  const order = document.querySelector('#order').value;
  const table = document.querySelector('#table').value;
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const day = days[date.getDay()];

  tableHead.innerHTML = '';
  tableHead.insertAdjacentHTML('afterbegin', markupCancel);
  socket.emit('sendNewOrderToList', JSON.stringify({ order, orderBy: user, table, day, hour, minute }));
};
const handleUnfinished = () => {
  const row = window.event.target.closest('tr');
  const order = window.event.target.closest('tr').querySelector('td + td').innerHTML;
  const orderBy = window.event.target.closest('tr').querySelector('td + td + td').innerHTML;
  const table = window.event.target.closest('tr').querySelector('td + td + td + td').innerHTML;
  const time = window.event.target.closest('tr').querySelector('td + td + td + td + td').innerHTML;
  row.innerHTML = '';
  row.insertAdjacentHTML('afterbegin', markupUnFinished(order, orderBy, table, time));
  socket.emit('sendToServerOrderUnfinished', JSON.stringify({ order, orderBy, table, time }));
};
const handleCancelAdding = () => {
  tableHead.innerHTML = '';
  tableHead.insertAdjacentHTML('afterbegin', markupCancel);
};
const handleAddOrderToList = function () {
  tableHead.innerHTML = '';
  tableHead.insertAdjacentHTML('afterbegin', markupAddOrder);
};
const handleSendOrderToKitchen = function () {
  const row = window.event.target.closest('tr');
  const order = window.event.target.closest('tr').querySelector('td + td').innerHTML;
  const orderBy = window.event.target.closest('tr').querySelector('td + td + td').innerHTML;
  const table = window.event.target.closest('tr').querySelector('td + td + td + td').innerHTML;
  const time = window.event.target.closest('tr').querySelector('td + td + td + td + td').innerHTML;
  row.innerHTML = '';
  row.insertAdjacentHTML('afterbegin', markupSentToKitchen(order, orderBy, table, time));
  socket.emit('sendOrderToServer', JSON.stringify({ order, orderBy, table, time }));
};
