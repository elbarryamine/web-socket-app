'use strict';
const reservation = document.querySelector('#reservation');
const handleScrollToReservation = function () {
  reservation.scrollIntoView({ behavior: 'smooth', block: 'center', duration: 8000 });
};
