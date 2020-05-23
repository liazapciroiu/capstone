// Get dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
// DOM elements
const inputCheckIn = document.getElementById('date-checkin');
const inputCheckOut = document.getElementById('date-checkout');

const allowOnlyFutureDates = () => {
  let minDateIn = today.toISOString().substring(0, 10);
  let minDateOut = tomorrow.toISOString().substring(0, 10);
  inputCheckIn.setAttribute('min', minDateIn);
  inputCheckOut.setAttribute('min', minDateOut);
}

const handleDateInputs = () => {
  window.addEventListener('DOMContentLoaded', (event) => {
    allowOnlyFutureDates();
  })
}

handleDateInputs();

export { handleDateInputs };

