'use strict';
const socket = io('ws://localhost:3000');
// Handle Coming Back Messages
const notification = document.querySelector('#notification');
const tableHead = document.querySelector('#tableHead');
const tableList = document.querySelector('tbody');
const user = document.querySelector('#user').innerHTML;
socket.emit('launch');
let firstLoad = true;
socket.on('addingHistoryItems', ({ orders, nots }) => {
  if (firstLoad) {
    orders.map((el) => {
      notification.insertAdjacentHTML('afterbegin', markupnotification(el));
      tableList.insertAdjacentHTML('afterbegin', markupNewOrderToList(el));
    });
    let markedNots;
    if (!nots) {
      nots = [];
    } else {
    }
    nots.map((el) => {
      document.querySelector(`#${el}`).firstElementChild.classList.remove('hidden');
    });
    firstLoad = false;
  }
});
const markupNewOrderToList = (order) => {
  let output;
  if (order.orderBy == user) {
    output = `<td id='order-${order.id}' onclick="handleRemove('${order.id}')" class="flex align-middle items-center justify-center text-center py-3 pl-3 pr-1 w-30">
    <button class="py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" type="checkbox">Restaurer</button>
    </td>`;
  } else {
    output = `<td class="flex align-middle items-center justify-center text-center py-3 pl-3 pr-1 w-30">
    <button class="opacity-0 py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" type="checkbox">Envoyer</button>
    </td>`;
  }
  return `<tr role="row" class="hover:bg-blue-100 border-b flex cursor-pointer items-center">
  ${output}
  <td class="py-3 px-5 flex-1 min-w-max truncate text-center">${order.order}</td>
  <td class="py-3 px-5 flex-1 min-w-max truncate text-center">${order.orderBy}</td>
  <td class="py-3 px-5 flex-1 min-w-max truncate text-center">${order.table}</td>
  <td class="py-3 px-5 flex-1 min-w-max truncate text-center">${order.time}</td>
  </tr>`;
};
const markupBeforeSend = (order, orderBy, table, time) => `
<tr role="row" class="hover:bg-blue-100 border-b flex cursor-pointer items-center">
                  <td onclick="handleAbort()" class="flex align-middle items-center justify-center text-center py-3 pl-3 pr-1 w-40">
                  <button class="py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" type="checkbox">Restaurer</button>
                  </td>
                  <td class="py-3 px-1 flex-1 truncate order text-center">${order}</td>
                  <td class="py-3 px-1 flex-1 truncate orderdby text-center">${orderBy}</td>
                  <td class="py-3 px-1 flex-1 truncate table text-center">${table}</td>
                  <td class="py-3 px-1 flex-1 truncate time text-center">${time}</td>
                </tr>`;

const markupAddNew = `<tr class="border-b flex">
<th class="font-semibold py-3 pl-3 pr-1 w-30 text-center">
  <button class="py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" onclick="handleModelAdd()">Ajouter</button>
</th>
<th class="font-semibold py-3 px-5 flex-1 min-w-max truncate text-center">Demande</th>
<th class="font-semibold py-3 px-5 flex-1 min-w-max truncate text-center">Demandeur</th>
<th class="font-semibold py-3 px-5 flex-1 min-w-max truncate text-center">Table</th>
<th class="font-semibold py-3 px-5 flex-1 min-w-max truncate text-center">Temps posté</th>
</tr>`;
const markupnotification = (order) => {
  if (order.role == 'waiter') {
    return `<li id='not-${order.id}' class="relative">
<div id="finsihedorder" class="hidden h-full w-full text-9xl absolute top-0 left-0 text-center text-green-500">✔</div>
<article onclick='handleMarkNotification()'
class="cursor-pointer border rounded-md p-3 bg-white flex text-gray-700 mb-2 hover:border-green-500 focus:outline-none focus:border-green-500 ">

<span class="flex-none pt-1 pr-2">
  <img class="h-8 w-8 rounded-md" src="https://raw.githubusercontent.com/bluebrown/tailwind-zendesk-clone/master/public/assets/avatar.png" />
</span>
<div class="flex-1">
  <header class="mb-1"><span class="font-semibold">Nouvelle commande</span></header>
  <p class="text-gray-600 text-uppercase">Commande : ${order.order} <br/>table : ${order.table}<br/><br/>${order.orderBy}</p>
  <footer class="text-gray-500 mt-2 text-sm">${order.time}</footer>
</div>
</article>
</li>`;
  } else {
    return `<li id='not-${order.id}' class="relative">
<div id="finsihedorder" class="hidden h-full w-full text-9xl absolute top-0 left-0 text-center text-green-500">✔</div>
<article 
class="cursor-pointer border rounded-md p-3 bg-white flex text-gray-700 mb-2 hover:border-green-500 focus:outline-none focus:border-green-500 ">

<span class="flex-none pt-1 pr-2">
  <img class="h-8 w-8 rounded-md" src="https://raw.githubusercontent.com/bluebrown/tailwind-zendesk-clone/master/public/assets/avatar.png" />
</span>
<div class="flex-1">
  <header class="mb-1"><span class="font-semibold">Nouvelle commande</span></header>
  <p class="text-gray-600 text-uppercase">Commande : ${order.order} <br/>table : ${order.table}<br/><br/>${order.orderBy}</p>
  <footer class="text-gray-500 mt-2 text-sm">${order.time}</footer>
</div>
</article>
</li>`;
  }
};
const markupSendOrAbort = `<tr class="border-b flex">
   <th class="font-semibold text-left py-3 pl-3 pr-1 w-30 flex flex-col justify-between	">
     <button class="py-3 px-6 text-white rounded-lg bg-purple-600 shadow-lg block md:inline-block" onclick="handleCancelAdding()">Annuler</button>
     <button class="py-3 px-6 text-white rounded-lg bg-purple-600 mt-2 shadow-lg block md:inline-block" onclick="handleConfirmAdding()">Envoyer</button>
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

const handleModelAdd = function () {
  tableList.insertAdjacentHTML('afterbegin', markupSendOrAbort);
};
const handleCancelAdding = function () {
  window.event.target.closest('tr').remove();
};
const handleConfirmAdding = function () {
  const order = window.event.target.closest('tr').querySelector('#order').value;
  const table = window.event.target.closest('tr').querySelector('#table').value;
  window.event.target.closest('tr').remove();
  const obj = { order, table };
  socket.emit('addNewOrderToList', obj);
};
socket.on('newOrderToList', (order) => {
  console.log(order);
  tableList.insertAdjacentHTML('afterbegin', markupNewOrderToList(order));
  notification.insertAdjacentHTML('afterbegin', markupnotification(order));
});

const handleRemove = function (id) {
  socket.emit('removeOrder', id);
};
socket.on('removeHasBeenRemoved', (id) => {
  document.querySelector(`#not-${id}`).remove();
});

const handleMarkNotification = function () {
  const id = window.event.target.closest('li').getAttribute('id');

  socket.emit('notificationClicked', id);
};
socket.on('notificationMarkedAsComplete', (id) => {
  document.querySelector(`#${id}`).firstElementChild.classList.remove('hidden');
});
