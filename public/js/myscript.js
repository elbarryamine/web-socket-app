'use strict';
const handleScrollToReservation = function () {
  if(window.location.pathname !== "/") return window.location='/'
  const reservation = document.querySelector('#reservation');
  reservation.scrollIntoView({ behavior: 'smooth', block: 'center', duration: 8000 });
};
