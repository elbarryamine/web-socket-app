'use strict';
const handleScrollToReservation = function () {
  console.log(window.location.pathname == "/")
  if(window.location.pathname !== "/") return window.location='/'
  const reservation = document.querySelector('#reservation');
  reservation.scrollIntoView({ behavior: 'smooth', block: 'center', duration: 8000 });
};
